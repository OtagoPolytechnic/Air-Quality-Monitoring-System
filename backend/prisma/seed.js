import { PrismaClient } from '@prisma/client';
import seedDevices from './seedDevices.json' assert { type: 'json' };
import seedSensorData from './seedSensorData.json' assert { type: 'json' };
import seedBlocks from './seedBlocks.json' assert { type: 'json' };

const prisma = new PrismaClient();

const main = async () => {
  const isDevEnv = process.env.NODE_ENV === 'development';
  const isLocalDb = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');
  
  if (!isDevEnv || !isLocalDb) {
    console.warn('Seeding aborted: Not in a safe development environment.');
    process.exit(1);
  }
  
  try {

    const existingBlock = await prisma.block.findFirst();
    if (existingBlock) {
      console.log('Clearing existing data...');
      await prisma.sensorData.deleteMany();
      await prisma.device.deleteMany();
      await prisma.block.deleteMany();
      console.log('Old data deleted.');
    }

    // Seed blocks
    for (let i = 0; i < seedBlocks.data.length; i++) {
      const blockSeed = seedBlocks.data[i];
      const existingBlocks = await prisma.block.findFirst({
        where: {
          OR: [
            {
              blockName: seedBlocks.data[i].blockName,
            },
          ],
        },
      });

      if (!existingBlocks) {
        const { blockName } = blockSeed;
        await prisma.block.create({
          data: {
            blockName,
          },
        });
        console.log(`Block ${blockName} seeded`);
      }
    }

    // Seed devices
    for (let i = 0; i < seedDevices.data.length; i++) {
      const deviceSeed = seedDevices.data[i];
      const existingDevices = await prisma.device.findFirst({
        where: {
          OR: [
            {
              dev_eui: seedDevices.data[i].dev_eui,
            },
            {
              deviceId: seedDevices.data[i].deviceId,
            },
          ],
        },
      });

      if (!existingDevices) {
        const { room_number, deviceId, dev_eui, blockId } = deviceSeed;
        await prisma.device.create({
          data: {
            room_number,
            deviceId,
            dev_eui,
            blockId,
          },
        });

        console.log(`Device ${deviceId} seeded`);
      }
    }

    // Seed sensor data
    for (let i = 0; i < seedSensorData.data.length; i++) {
      const sensorSeed = seedSensorData.data[i];
      const { co2, temperature, deviceId, dev_eui } = sensorSeed;
      await prisma.sensorData.create({
        data: {
          co2,
          temperature,
          deviceId,
          dev_eui,
        },
      });
      console.log(`Sensor Data ${deviceId} seeded`);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
