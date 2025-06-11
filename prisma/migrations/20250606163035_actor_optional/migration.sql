-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_actor_id_fkey";

-- AlterTable
ALTER TABLE "characters" ALTER COLUMN "actor_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
