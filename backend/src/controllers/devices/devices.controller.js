import { PrismaClient } from '@prisma/client';
import { STATUS_CODES } from '../../utils/statusCodes/statusCode.js';
import { PAGINATION_DEFAULTS } from '../../utils/constants/globalConstants.js';

const prisma = new PrismaClient();

const getDevice = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    const dev_eui = req.params.dev_eui;

    const amount = req.query.amount || PAGINATION_DEFAULTS.amount;
    const page = req.query.page || PAGINATION_DEFAULTS.page;

    // pagination is a let for getDevice, cannot be const when payload is not passed through params
    let hasNextPage;

    const queryDevice = {
      where: { dev_eui: String(dev_eui) },
    };

    // if user wants to view payload data, will allow payload data from device to be sorted/paginated
    if (req.query.sensorData === 'true') {
      queryDevice.include = {
        sensorData: {
          orderBy: {
            [sortBy]: sortOrder,
          },
          take: Number(amount),
          skip: Number(page - 1) * Number(amount),
        },
      };
    }

    const device = await prisma.device.findFirst(queryDevice);

    if (!device || device.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: `Device ${dev_eui} not found on the server`,
      });
    }

    // If payload is not passed through, using const for nextPage will error out as device.payloads does not exist
    if (req.query.sensorData) {
      hasNextPage = device.sensorData.length === Number(amount);
    }

    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      data: device,
      nextPage: hasNextPage ? Number(page) + 1 : null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.status,
      message: error.message,
    });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

    const amount = req.query.amount || PAGINATION_DEFAULTS.amount;
    const page = req.query.page || PAGINATION_DEFAULTS.page;

    const devices = await prisma.device.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        block: {
          select: {
            blockName: true,
          },
        },
      },
      take: Number(amount),
      skip: Number(page - 1) * Number(amount),
    });

    if (!devices || devices.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: `No devices found on the server`,
      });
    }

    const hasNextPage = devices.length === Number(amount);

    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      data: devices,
      nextPage: hasNextPage ? Number(page) + 1 : null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.status,
      message: error.message,
    });
  }
};

const updateDeviceRoom = async (req, res) => {
  try {
    const dev_eui = req.params.dev_eui;

    const { room_number } = req.body;

    const getDevice = await prisma.device.findFirst({
      where: { dev_eui: String(dev_eui) },
    });

    if (!getDevice || getDevice.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: `Device ${dev_eui} not found in the database`,
      });
    }

    const findExistingRoomNumber = await prisma.device.findUnique({
      where: { room_number: String(room_number) },
    });

    if (findExistingRoomNumber) {
      return res.status(STATUS_CODES.CONFLICT).json({
        statusCode: res.statusCode,
        message: `Device with room number ${room_number} already exists in the database`,
      });
    }

    const updatedRoomNumber = await prisma.device.update({
      where: { dev_eui: String(dev_eui) },
      data: { room_number },
    });

    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      message: `Room number updated successfully`,
      data: updatedRoomNumber,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.statusCode,
      message: error.message,
    });
  }
};

const updateDeviceBlock = async (req, res) => {
  try {
    const dev_eui = req.params.dev_eui;

    const { blockName } = req.body;

    const getDevice = await prisma.device.findFirst({
      where: { dev_eui: String(dev_eui) },
    });

    if (!getDevice || getDevice.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: `Device ${dev_eui} not found in the database`,
      });
    }

    if (blockName === 'Unassigned') {
      const removeBlock = await prisma.device.update({
        where: { dev_eui: String(dev_eui) },
        data: { block: { disconnect: true } },
      });

      return res.status(STATUS_CODES.OK).json({
        statusCode: res.statusCode,
        message: `Device Block removed successfully`,
        data: removeBlock,
      });
    } else {
      const updatedBlockName = await prisma.device.update({
        where: { dev_eui: String(dev_eui) },
        data: { block: { connect: { blockName } } },
      });

      console.log(updatedBlockName);

      return res.status(STATUS_CODES.OK).json({
        statusCode: res.statusCode,
        message: `Device Block updated successfully`,
        data: updatedBlockName,
      });
    }
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.statusCode,
      message: error.message,
    });
  }
};

const getDeviceLatestData = async (req, res) => {
  try {
    const room_number = req.params.room_number;
    const device = await prisma.device.findFirst({
      where: { room_number: String(room_number) },
      include: {
        sensorData: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!device || device.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: res.statusCode,
        message: `Device with room number ${room_number} not found on the server`,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      statusCode: res.statusCode,
      data: device,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      statusCode: res.status,
      message: error.message,
    });
  }
};

export { getDevice, getAllDevices, updateDeviceRoom, updateDeviceBlock, getDeviceLatestData };
