import express from 'express';

import { getAllDevices, updateDeviceRoom, updateDeviceBlock, getDeviceLatestData } from '../../controllers/devices/devices.controller.js';

const router = express.Router();

router.route('/').get(getAllDevices);
router.route('/:dev_eui/').put(updateDeviceRoom);
router.route('/latest/:room_number/').get(getDeviceLatestData);
router.route('/addBlock/:dev_eui/').put(updateDeviceBlock);

export default router;
