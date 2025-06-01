/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text]` on the table `quotes` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `characters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('dead', 'alive', 'unknown');

-- AlterTable
ALTER TABLE "actors" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "items_name_key" ON "items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_text_key" ON "quotes"("text");
