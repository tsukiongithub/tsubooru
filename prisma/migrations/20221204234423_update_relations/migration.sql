/*
  Warnings:

  - A unique constraint covering the columns `[tag_name]` on the table `Blacklisted_Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blacklisted_Tag_tag_name_key" ON "Blacklisted_Tag"("tag_name");
