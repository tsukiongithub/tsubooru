/*
  Warnings:

  - You are about to drop the column `tag__id` on the `Blacklisted_Tag` table. All the data in the column will be lost.
  - Added the required column `tag_id` to the `Blacklisted_Tag` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blacklisted_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag_id" INTEGER NOT NULL
);
INSERT INTO "new_Blacklisted_Tag" ("id") SELECT "id" FROM "Blacklisted_Tag";
DROP TABLE "Blacklisted_Tag";
ALTER TABLE "new_Blacklisted_Tag" RENAME TO "Blacklisted_Tag";
CREATE UNIQUE INDEX "Blacklisted_Tag_tag_id_key" ON "Blacklisted_Tag"("tag_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
