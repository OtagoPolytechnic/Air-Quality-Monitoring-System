import { STATUS_CODES } from '../../utils/statusCodes/statusCode.js';
import { PrismaClient } from '@prisma/client';
import { emitter } from '../../app.js';

const prisma = new PrismaClient();
// webhook will get the payload from the co2 sensors and return the data along with the statuscode and message
export const handleWebhook = async (req, res) => {
  try {
    console.log('=== Webhook handler started ===');
    const payload = req.body;
    // Remove later
    console.log('Received payload:', payload);

    if (!payload || Object.keys(payload).length === 0) {
      console.log('ERROR: Empty payload received');
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        statusCode: res.statusCode,
        message: 'Empty payload received',
      });
    }

    console.log('Checking for device ID:', payload.end_device_ids?.device_id);
    // Call the db and check if the device already exists
    const checkDeviceId = await prisma.device.findUnique({
      where: { deviceId: payload.end_device_ids.device_id },
    });

    // If the device does not exist, creates it
    if (!checkDeviceId) {
      console.log('Device not found, creating new device with ID:', payload.end_device_ids.device_id);
      await prisma.device.create({
        data: {
          deviceId: payload.end_device_ids.device_id,
          dev_eui: payload.end_device_ids.dev_eui,
        },
      });
      console.log('New device created successfully');
    } else {
      console.log('Device already exists in database');
    }

    // Grab the receivedString containing co2 and temp and split to get the values
    const receivedStringValues = payload.uplink_message.decoded_payload.receivedString;
    console.log('Raw received string:', receivedStringValues);

    // I've done some weird regex before, but this is just painful to look at
    const [value1, value2] = receivedStringValues
      .split(':')
      .map((value) => value.replace(/\\x[0-9A-Fa-f]{2}/g, '').replace(/\x00/g, ''));

    console.log('Parsed values - CO2:', value1, 'Temperature:', value2);

    const sensorData = await prisma.sensorData.create({
      data: {
        deviceId: payload.end_device_ids.device_id,
        dev_eui: payload.end_device_ids.dev_eui,
        co2: value1,
        temperature: value2,
      },
    });
    console.log('Sensor data created in database:', sensorData);

/*     await prisma.device.update({
      where: { deviceId: payload.end_device_ids.device_id },
      data: {
        updatedAt: new Date(),
        sensorData: {
          connect: {
            sensorData
          },
        },
      },
    }); */

    // Emit the data to the websocket
    emitter.emit('webhook', { message: 'New data received', timestamp: Date.now() });
    console.log('Data emitted to websocket', sensorData);
    console.log('=== Webhook handler completed successfully ===');

    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      message: 'Sensor data received, data added to the database',
      data: sensorData,
    });
  } catch (error) {
    console.error('=== ERROR in webhook handler ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.statusCode,
      message: 'Internal server error occurred while processing the webhook request',
    });
  }
};
