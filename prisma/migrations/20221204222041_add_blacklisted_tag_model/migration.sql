-- CreateTable
CREATE TABLE "blacklisted_tags" (
    "tag_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklisted_tags_tag_id_key" ON "blacklisted_tags"("tag_id");
