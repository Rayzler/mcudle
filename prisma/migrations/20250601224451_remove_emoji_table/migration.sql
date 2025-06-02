/*
  Warnings:

  - You are about to drop the column `emoji_id` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the `emojis` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `emoji_character_id` to the `daily_challenges` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_emoji_id_fkey";

-- DropForeignKey
ALTER TABLE "daily_challenges" DROP CONSTRAINT "daily_challenges_emoji_id_fkey";

-- DropIndex
DROP INDEX "characters_emoji_id_key";

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "emoji_id",
ADD COLUMN     "emojis" TEXT;

-- AlterTable
ALTER TABLE "daily_challenges" ADD COLUMN     "emoji_character_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "emojis";

-- AddForeignKey
ALTER TABLE "daily_challenges" ADD CONSTRAINT "daily_challenges_emoji_character_id_fkey" FOREIGN KEY ("emoji_character_id") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
