import { PrismaClient } from '@prisma/client';
import { STATUS_CODES } from '../../utils/statusCodes/statusCode.js';
import { PAGINATION_DEFAULTS } from '../../utils/constants/globalConstants.js';
const prisma = new PrismaClient();

const getAllSensorDeviceData = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    const amount = req.query.amount || PAGINATION_DEFAULTS.amount;
    const page = req.query.page || PAGINATION_DEFAULTS.page;

    const dev_eui = req.params.dev_eui;

    const allSensorData = await prisma.sensorData.findMany({
      where: { dev_eui: String(dev_eui) },
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: Number(amount),
      skip: Number(page - 1) * Number(amount),
    });

    if (!allSensorData || allSensorData.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: 'No payload data available',
      });
    }

    const hasNextPage = allSensorData.length === Number(amount);

    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      data: allSensorData,
      nextPage: hasNextPage ? Number(page) + 1 : null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.statusCode,
      message: error.message,
    });
  }
};

// Get latest payload insert from room
const getRecentSensorData = async (req, res) => {
  try {
    // Get the dev_eui from the url params
    const dev_eui = req.params.dev_eui;

    // find the first payload data, sorted by creation date, descending order
    const recentSensorData = await prisma.sensorData.findFirst({
      where: { dev_eui: String(dev_eui) },
      include: {
        device: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // If there is no payload return nothing found
    if (!recentSensorData || recentSensorData.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: 'No payload found for the device',
      });
    }

    // Return the payload data
    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      data: recentSensorData,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.statusCode,
      message: error.message,
    });
  }
};

const getHistorySensorData = async (req, res) => {
  try {
    // Get dev_eui from the URL parameters
    const dev_eui = req.params.dev_eui;

    // Gets dates that user wants to query
    const beforeDateString = req.query.beforeDate;
    const afterDateString = req.query.afterDate;

    // Convert date strings to Date objects
    const beforeDate = new Date(beforeDateString);
    const afterDate = new Date(afterDateString);

    // Converts after Date to the next day
    afterDate.getDate() + 1;
    afterDate.setDate(afterDate.getDate() + 1);

    const historySensorData = await prisma.sensorData.findMany({
      where: {
        dev_eui: String(dev_eui),
        createdAt: {
          gte: beforeDate, // Start of date range
          lte: afterDate, // End of date range
        },
      },
      include: {
        device: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!historySensorData || historySensorData.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: 'No payload found for the device',
      });
    }

    // Return the payload data
    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      data: historySensorData,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.statusCode,
      message: error.message,
    });
  }
};

// Delete sensor data for a given device
const deleteDeviceSensorData = async (req, res) => {
  try {
    const dev_eui = req.params.dev_eui;

    const allSensorData = await prisma.sensorData.findMany({
      where: { dev_eui: String(dev_eui) },
    });

    if (!allSensorData || allSensorData.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: 'No sensor data available',
      });
    }

    await prisma.sensorData.deleteMany({
      where: { dev_eui: String(dev_eui) },
    });

    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.statusCode,
      message: error.message,
    });
  }
}

export { getRecentSensorData, getAllSensorDeviceData, getHistorySensorData, deleteDeviceSensorData };
