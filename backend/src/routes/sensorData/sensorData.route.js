import express from 'express';

import {
  getRecentSensorData,
  getHistorySensorData,
  getAllSensorDeviceData,
  deleteDeviceSensorData
} from '../../controllers/sensorData/sensorData.controller.js';

const router = express.Router();

router.route('/latest/:dev_eui/').get(getRecentSensorData);
router.route('/:dev_eui').get(getAllSensorDeviceData);
router.route('/history/:dev_eui/').get(getHistorySensorData);
router.route('/deleteData/:dev_eui/').get(deleteDeviceSensorData);

export default router;
