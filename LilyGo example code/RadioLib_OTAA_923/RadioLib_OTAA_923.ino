#include <RadioLib.h>
#include "LoRaBoards.h"

#include <Preferences.h>
Preferences store;

// LilyGo T3-1.6v board lora chip type
SX1276 radio = new Module(RADIO_CS_PIN, RADIO_DIO0_PIN, RADIO_RST_PIN, RADIO_DIO1_PIN);

// joinEUI - previous versions of LoRaWAN called this AppEUI
// for development purposes you can use all zeros - see wiki for details
#define RADIOLIB_LORAWAN_JOIN_EUI  0x0000000000000000


#ifndef RADIOLIB_LORAWAN_DEV_EUI   // Replace with your Device EUI
#define RADIOLIB_LORAWAN_DEV_EUI   0x70B3D57ED006EBB1
#endif
#ifndef RADIOLIB_LORAWAN_APP_KEY   
#define RADIOLIB_LORAWAN_APP_KEY   0x7D, 0xFC, 0x2E, 0x1E, 0x29, 0xC3, 0x6F, 0x39, 0x8D, 0x55, 0x6C, 0x01, 0x30, 0x4A, 0xD7, 0x3F
#endif
#ifndef RADIOLIB_LORAWAN_NWK_KEY   
#define RADIOLIB_LORAWAN_NWK_KEY   0x12, 0x42, 0x8B, 0xF0, 0x8F, 0xA4, 0x17, 0x6E, 0x08, 0xA7, 0x24, 0x2D, 0x33, 0xE5, 0x50, 0x1A
#endif

// Sends every 5 minutes?
const uint32_t uplinkIntervalSeconds = 5UL * 60UL;    // minutes x seconds

// Configures region feq band. We use aus915-923
const LoRaWANBand_t Region = AU915;
const uint8_t subBand = 0;  // No need to change this

// ============================================================================


// copy over the EUI's & keys in to the something that will not compile if incorrectly formatted
uint64_t joinEUI =   RADIOLIB_LORAWAN_JOIN_EUI;
uint64_t devEUI  =   RADIOLIB_LORAWAN_DEV_EUI;
uint8_t appKey[] = { RADIOLIB_LORAWAN_APP_KEY };
uint8_t nwkKey[] = { RADIOLIB_LORAWAN_NWK_KEY };

// create the LoRaWAN node
LoRaWANNode node(&radio, &Region, subBand);

RTC_DATA_ATTR uint8_t LWsession[RADIOLIB_LORAWAN_SESSION_BUF_SIZE];


// See https://jgromes.github.io/RadioLib/group__status__codes.html for a complete list of error codes
void debug(bool failed, const __FlashStringHelper *message, int state, bool halt)
{
    if (failed) {
        Serial.print(message);
        Serial.print(" - ");
        Serial.print(" (");
        Serial.print(state);
        Serial.println(")");
        while (halt) {
            delay(1);
        }
    }
}

void setup()
{
    Serial.begin(115200);

    while (!Serial);

    setupBoards();

    delay(5000);  // Give time to switch to the serial monitor

    Serial.println(F("\nSetup ... "));

    Serial.println(F("Initialise the radio"));

    int16_t state = 0;  // return value for calls to RadioLib
    Serial.println(F("Initialise the radio"));
    state = radio.begin();
    debug(state != RADIOLIB_ERR_NONE, F("Initialise radio failed"), state, true);


    // Override the default join rate
    uint8_t joinDR = 4;

    // Setup the OTAA session information
    node.beginOTAA(joinEUI, devEUI, nwkKey, appKey);

    // ##### setup the flash storage
    store.begin("radiolib");
    // ##### if we have previously saved nonces, restore them and try to restore session as well
    if (store.isKey("nonces")) {
        uint8_t buffer[RADIOLIB_LORAWAN_NONCES_BUF_SIZE];                                       // create somewhere to store nonces
        store.getBytes("nonces", buffer, RADIOLIB_LORAWAN_NONCES_BUF_SIZE); // get them from the store
        state = node.setBufferNonces(buffer);                                                           // send them to LoRaWAN
        Serial.println(store.getBytes("nonces", buffer, RADIOLIB_LORAWAN_NONCES_BUF_SIZE));

        debug(state != RADIOLIB_ERR_NONE, F("Restoring nonces buffer failed"), state, false);

        // recall session from RTC deep-sleep preserved variable
        state = node.setBufferSession(LWsession); // send them to LoRaWAN stack

        // if we have booted more than once we should have a session to restore, so report any failure
        // otherwise no point saying there's been a failure when it was bound to fail with an empty LWsession var.
        debug((state != RADIOLIB_ERR_NONE), F("Restoring session buffer failed"), state, false);

        // if Nonces and Session restored successfully, activation is just a formality
        // moreover, Nonces didn't change so no need to re-save them
        if (state == RADIOLIB_ERR_NONE) {
            Serial.println(F("Successfully restored session - now activating"));
            state = node.activateOTAA();
            debug((state != RADIOLIB_LORAWAN_SESSION_RESTORED), F("Failed to activate restored session"), state, true);

            // ##### close the store before returning
            store.end();
        }
    } else {  // store has no key "nonces"
        Serial.println(F("No Nonces saved - starting fresh."));
    }

    // trying to join
    uint32_t sleepForSeconds = 10*1000;
    state = RADIOLIB_ERR_NETWORK_NOT_JOINED;

    while (state != RADIOLIB_LORAWAN_NEW_SESSION) {

        Serial.println(F("Join ('login') to the LoRaWAN Network"));

        state = node.activateOTAA();

        // ##### save the join counters (nonces) to permanent store
        Serial.println(F("Saving nonces to flash"));
        uint8_t buffer[RADIOLIB_LORAWAN_NONCES_BUF_SIZE];           // create somewhere to store nonces
        uint8_t *persist = node.getBufferNonces();                  // get pointer to nonces
        memcpy(buffer, persist, RADIOLIB_LORAWAN_NONCES_BUF_SIZE);  // copy in to buffer
        store.putBytes("nonces", buffer, RADIOLIB_LORAWAN_NONCES_BUF_SIZE); // send them to the store
        Serial.println(store.getBytes("nonces", buffer, RADIOLIB_LORAWAN_NONCES_BUF_SIZE));

        if (state != RADIOLIB_LORAWAN_NEW_SESSION) {
            Serial.print(F("Join failed: "));
            Serial.println(state);

            // how long to wait before join attempts. This is an interim solution pending
            // implementation of TS001 LoRaWAN Specification section #7 - this doc applies to v1.0.4 & v1.1
            // it sleeps for longer & longer durations to give time for any gateway issues to resolve
            // or whatever is interfering with the device <-> gateway airwaves.
            // uint32_t sleepForSeconds = min((bootCountSinceUnsuccessfulJoin++ + 1UL) * 60UL, 3UL * 60UL);
            Serial.print(F("Boots since unsuccessful join: "));
            // Serial.println(bootCountSinceUnsuccessfulJoin);
            Serial.print(F("Retrying join in "));
            Serial.print("10");
            Serial.println(F(" seconds"));

            delay(sleepForSeconds);
        }
    } // if activateOTAA state

    // Print the DevAddr
    Serial.print("[LoRaWAN] DevAddr: ");
    Serial.println((unsigned long)node.getDevAddr(), HEX);

    // Enable the ADR algorithm (on by default which is preferable)
    node.setADR(true);

    // Set a datarate to start off with
    node.setDatarate(5);

    // Manages uplink intervals to the TTN Fair Use Policy
    node.setDutyCycle(true, 1250);

    // Enable the dwell time limits - 400ms is the limit for the US
    node.setDwellTime(true, 400);

    Serial.println(F("Ready!\n"));

    // Displaying to screen (Could be used for CO2 readings??)
    if (u8g2) {
        u8g2->clearBuffer();
        u8g2->setFont(u8g2_font_NokiaLargeBold_tf );
        uint16_t str_w =  u8g2->getStrWidth(BOARD_VARIANT_NAME);
        u8g2->drawStr((u8g2->getWidth() - str_w) / 2, 16, BOARD_VARIANT_NAME);
        u8g2->drawHLine(5, 21, u8g2->getWidth() - 5);

        u8g2->setCursor(0, 38);
        u8g2->print("LoRaWAN Ready!");
        u8g2->sendBuffer();
    }
}


void loop()
{
    int16_t state = RADIOLIB_ERR_NONE;

    // set battery fill level - the LoRaWAN network server
    // may periodically request this information
    // 0 = external power source
    // 1 = lowest (empty battery)
    // 254 = highest (full battery)
    // 255 = unable to measure
    // May be used for battery level check if we use battery packs?
    uint8_t battLevel = 0;
    node.setDeviceStatus(battLevel);

    // This is the place to CO2 sensor data
    // Instead of reading any real sensor, we just generate some random numbers as example
    uint8_t value1 = radio.random(100);
    uint16_t value2 = radio.random(2000);

    // Build payload byte array to be sent
    uint8_t uplinkPayload[3];
    uplinkPayload[0] = value1;
    uplinkPayload[1] = highByte(value2);   // See notes for high/lowByte functions
    uplinkPayload[2] = lowByte(value2);

    uint8_t downlinkPayload[10];  // Make sure this fits your plans!
    size_t  downlinkSize;         // To hold the actual payload size received

    // you can also retrieve additional information about an uplink or
    // downlink by passing a reference to LoRaWANEvent_t structure
    LoRaWANEvent_t uplinkDetails;
    LoRaWANEvent_t downlinkDetails;

    uint8_t fPort = 10;

    // Retrieve the last uplink frame counter
    uint32_t fCntUp = node.getFCntUp();

    // Send a confirmed uplink on the second uplink
    // and also request the LinkCheck and DeviceTime MAC commands
    Serial.println(F("Sending uplink"));
    if (fCntUp == 1) {
        Serial.println(F("and requesting LinkCheck and DeviceTime"));
        node.sendMacCommandReq(RADIOLIB_LORAWAN_MAC_LINK_CHECK);
        node.sendMacCommandReq(RADIOLIB_LORAWAN_MAC_DEVICE_TIME);
        state = node.sendReceive(uplinkPayload, sizeof(uplinkPayload), fPort, downlinkPayload, &downlinkSize, true, &uplinkDetails, &downlinkDetails);
    } else {
        state = node.sendReceive(uplinkPayload, sizeof(uplinkPayload), fPort, downlinkPayload, &downlinkSize, false, &uplinkDetails, &downlinkDetails);
    }
    debug(state < RADIOLIB_ERR_NONE, F("Error in sendReceive"), state, false);

    // Check if a downlink was received
    // (state 0 = no downlink, state 1/2 = downlink in window Rx1/Rx2)
    if (state > 0) {
        Serial.println(F("Received a downlink"));
        // Did we get a downlink with data for us
        
        Serial.println(F("<MAC commands only>"));
      

        // print RSSI (Received Signal Strength Indicator)
        Serial.print(F("[LoRaWAN] RSSI:\t\t"));
        Serial.print(radio.getRSSI());
        Serial.println(F(" dBm"));

        // print SNR (Signal-to-Noise Ratio)
        Serial.print(F("[LoRaWAN] SNR:\t\t"));
        Serial.print(radio.getSNR());
        Serial.println(F(" dB"));

        // print extra information about the event
        Serial.println(F("[LoRaWAN] Event information:"));
        Serial.print(F("[LoRaWAN] Confirmed:\t"));
        Serial.println(downlinkDetails.confirmed);
        Serial.print(F("[LoRaWAN] Confirming:\t"));
        Serial.println(downlinkDetails.confirming);
        Serial.print(F("[LoRaWAN] Datarate:\t"));
        Serial.println(downlinkDetails.datarate);
        Serial.print(F("[LoRaWAN] Frequency:\t"));
        Serial.print(downlinkDetails.freq, 3);
        Serial.println(F(" MHz"));
        Serial.print(F("[LoRaWAN] Frame count:\t"));
        Serial.println(downlinkDetails.fCnt);
        Serial.print(F("[LoRaWAN] Port:\t\t"));
        Serial.println(downlinkDetails.fPort);
        Serial.print(F("[LoRaWAN] Time-on-air: \t"));
        Serial.print(node.getLastToA());
        Serial.println(F(" ms"));
        Serial.print(F("[LoRaWAN] Rx window: \t"));
        Serial.println(state);

        uint8_t margin = 0;
        uint8_t gwCnt = 0;
        if (node.getMacLinkCheckAns(&margin, &gwCnt) == RADIOLIB_ERR_NONE) {
            Serial.print(F("[LoRaWAN] LinkCheck margin:\t"));
            Serial.println(margin);
            Serial.print(F("[LoRaWAN] LinkCheck count:\t"));
            Serial.println(gwCnt);
        }

        uint32_t networkTime = 0;
        uint8_t fracSecond = 0;
        if (node.getMacDeviceTimeAns(&networkTime, &fracSecond, true) == RADIOLIB_ERR_NONE) {
            Serial.print(F("[LoRaWAN] DeviceTime Unix:\t"));
            Serial.println(networkTime);
            Serial.print(F("[LoRaWAN] DeviceTime second:\t1/"));
            Serial.println(fracSecond);
        }

    } else {
        Serial.println(F("[LoRaWAN] No downlink received"));
    }

    // wait before sending another packet as per set in uplinkIntervalSeconds variable
    uint32_t minimumDelay = uplinkIntervalSeconds * 1000UL;
    uint32_t interval = node.timeUntilUplink();     
    uint32_t delayMs = max(interval, minimumDelay); // cannot send faster than duty cycle allows

    Serial.print(F("[LoRaWAN] Next uplink in "));
    Serial.print(delayMs / 1000);
    Serial.println(F(" seconds\n"));

    delay(delayMs);
}
