-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "phase" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "actors_name_idx" ON "actors"("name");

-- CreateIndex
CREATE INDEX "characters_name_idx" ON "characters"("name");

-- CreateIndex
CREATE INDEX "daily_challenges_date_idx" ON "daily_challenges"("date");

-- CreateIndex
CREATE INDEX "movies_title_idx" ON "movies"("title");
