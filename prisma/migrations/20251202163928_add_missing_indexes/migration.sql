-- CreateIndex
CREATE INDEX "daily_challenges_classic_character_id_idx" ON "daily_challenges"("classic_character_id");

-- CreateIndex
CREATE INDEX "daily_challenges_poster_character_id_idx" ON "daily_challenges"("poster_character_id");

-- CreateIndex
CREATE INDEX "daily_challenges_poster_movie_id_idx" ON "daily_challenges"("poster_movie_id");

-- CreateIndex
CREATE INDEX "daily_challenges_emoji_character_id_idx" ON "daily_challenges"("emoji_character_id");

-- CreateIndex
CREATE INDEX "daily_challenges_quote_id_idx" ON "daily_challenges"("quote_id");

-- CreateIndex
CREATE INDEX "daily_challenges_item_id_idx" ON "daily_challenges"("item_id");

-- CreateIndex
CREATE INDEX "items_character_id_idx" ON "items"("character_id");

-- CreateIndex
CREATE INDEX "quotes_character_id_idx" ON "quotes"("character_id");
