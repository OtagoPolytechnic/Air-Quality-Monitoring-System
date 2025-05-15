-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "blockName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "room_number" TEXT,
    "deviceId" TEXT NOT NULL,
    "dev_eui" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockId" INTEGER,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorData" (
    "id" SERIAL NOT NULL,
    "co2" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT NOT NULL,
    "dev_eui" TEXT NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockName_key" ON "Block"("blockName");

-- CreateIndex
CREATE UNIQUE INDEX "Device_room_number_key" ON "Device"("room_number");

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceId_key" ON "Device"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_dev_eui_key" ON "Device"("dev_eui");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX IF EXISTS "Device_room_number_key";

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "room_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "room_number" SET DEFAULT 'Unassigned';

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "room_number" SET NOT NULL;
