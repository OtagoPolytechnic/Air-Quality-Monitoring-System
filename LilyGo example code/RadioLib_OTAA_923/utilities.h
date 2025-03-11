/**
 * @file      utilities.h
 * @author    Lewis He (lewishe@outlook.com)
 * @license   MIT
 * @copyright Copyright (c) 2024  ShenZhen XinYuan Electronic Technology Co., Ltd
 * @date      2024-05-12
 * @last-update 2024-08-07
 */

 // This file contains all pin numbers for LilyGo T3-1.6V
#pragma once

#define T3_V1_6_SX1276

#define UNUSED_PIN (0)

#if defined(T3_V1_6_SX1276)

#ifndef USING_SX1276
#define USING_SX1276
#endif

#define I2C_SDA          21
#define I2C_SCL          22
#define OLED_RST         UNUSED_PIN

#define RADIO_SCLK_PIN   5
#define RADIO_MISO_PIN   19
#define RADIO_MOSI_PIN   27
#define RADIO_CS_PIN     18
#define RADIO_DIO0_PIN   26
#define RADIO_RST_PIN    23
#define RADIO_DIO1_PIN   33
// SX1276/78
#define RADIO_DIO2_PIN   32
// SX1262 (not used for SX1276)
#define RADIO_BUSY_PIN   32

#define SDCARD_MOSI      15
#define SDCARD_MISO      2
#define SDCARD_SCLK      14
#define SDCARD_CS        13

#define BOARD_LED        25
#define LED_ON           HIGH

#define ADC_PIN          35

#define HAS_SDCARD
#define HAS_DISPLAY

#define BOARD_VARIANT_NAME "T3 V1.6"

#endif
