import { PrismaClient } from '@prisma/client';
import blocksData from './data/seed/seedBlocks.json' with { type: 'json' };
import devicesData from './data/seed/seedDevices.json' with { type: 'json' };
import sensorData from './data/seed/seedSensorData.json' with { type: 'json' };

const prisma = new PrismaClient();

async function main() {
  // Check environment
  const env = process.env.NODE_ENV || 'development';
  if (env !== 'development') {
    console.error(`Seeding aborted: NODE_ENV is set to '${env}'.`);
    process.exit(1);
  }

  console.log(`Running seed script in '${env}' environment.`);

  // Clear existing data
  await prisma.sensorData.deleteMany();
  await prisma.device.deleteMany();
  await prisma.block.deleteMany();

  // Insert blocks
  console.log('Inserting blocks...');
  for (const block of blocksData.data) {
    await prisma.block.create({
      data: {
        id: block.id,
        blockName: block.blockName
      }
    });
  }

  // Insert devices
  console.log('Inserting devices...');
  for (const device of devicesData.data) {
    await prisma.device.create({
      data: {
        id: device.id,
        room_number: device.room_number || 'Unassigned',
        deviceId: device.deviceId,
        dev_eui: device.dev_eui,
        createdAt: new Date(device.createdAt || Date.now()),
        blockId: device.blockId || null
      }
    });
  }

  // Insert sensor data
  console.log('Inserting sensor data...');
  for (const data of sensorData.data) {
    await prisma.sensorData.create({
      data: {
        co2: data.co2,
        temperature: data.temperature,
        deviceId: data.deviceId,
        dev_eui: data.dev_eui
      }
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
