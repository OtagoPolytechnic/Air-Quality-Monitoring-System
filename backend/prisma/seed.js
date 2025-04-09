import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
 
const prisma = new PrismaClient();
 
const main = async () => {
  try {
    // Load JSON files
    const seedDevices = JSON.parse(await fs.readFile('./prisma/data/seed/seedDevices.json', 'utf8'));
    const seedSensorData = JSON.parse(await fs.readFile('./prisma/data/seed/seedSensorData.json', 'utf8'));
    const seedBlocks = JSON.parse(await fs.readFile('./prisma/data/seed/seedBlocks.json', 'utf8'));
 
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
        console.log(blockId);
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