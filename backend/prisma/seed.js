import { PrismaClient } from '@prisma/client';
import seedDevices from './seedDevices.json' assert { type: 'json' };
import seedSensorData from './seedSensorData.json' assert { type: 'json' };
import seedBlocks from './seedBlocks.json' assert { type: 'json' };

const prisma = new PrismaClient();

const main = async () => {
  const isDevEnv = process.env.NODE_ENV === 'development';
  const isLocalDb =
    process.env.DATABASE_URL?.includes('localhost') ||
    process.env.DATABASE_URL?.includes('127.0.0.1');

  if (!isDevEnv || !isLocalDb) {
    console.warn('Seeding aborted: Not in a safe development environment.');
    process.exit(1);
  }

  try {
    // Seed blocks
    for (const blockSeed of seedBlocks.data) {
      const existingBlock = await prisma.block.findFirst({
        where: { blockName: blockSeed.blockName },
      });

      if (!existingBlock) {
        await prisma.block.create({
          data: { blockName: blockSeed.blockName },
        });
        console.log(`Block ${blockSeed.blockName} seeded`);
      }
    }

    // Seed devices
    for (const deviceSeed of seedDevices.data) {
      const existingDevice = await prisma.device.findFirst({
        where: {
          OR: [
            { dev_eui: deviceSeed.dev_eui },
            { deviceId: deviceSeed.deviceId },
          ],
        },
      });

      if (!existingDevice) {
        const parentBlock = await prisma.block.findFirst({
          where: { blockName: deviceSeed.blockName },
        });

        if (!parentBlock) {
          console.warn(`Skipping device ${deviceSeed.deviceId} - block not found`);
          continue;
        }

        await prisma.device.create({
          data: {
            room_number: deviceSeed.room_number,
            deviceId: deviceSeed.deviceId,
            dev_eui: deviceSeed.dev_eui,
            blockId: parentBlock.id,
          },
        });

        console.log(`Device ${deviceSeed.deviceId} seeded`);
      }
    }

    // Seed sensor data
    for (const sensorSeed of seedSensorData.data) {
      const existingSensor = await prisma.sensorData.findFirst({
        where: {
          deviceId: sensorSeed.deviceId,
          createdAt: new Date(sensorSeed.createdAt),
        },
      });

      if (!existingSensor) {
        await prisma.sensorData.create({
          data: {
            co2: sensorSeed.co2,
            temperature: sensorSeed.temperature,
            deviceId: sensorSeed.deviceId,
            dev_eui: sensorSeed.dev_eui,
            createdAt: new Date(sensorSeed.createdAt),
          },
        });
        console.log(`Sensor data for ${sensorSeed.deviceId} at ${sensorSeed.createdAt} seeded`);
      }
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
