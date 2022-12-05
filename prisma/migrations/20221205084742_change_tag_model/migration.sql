/*
  Warnings:

  - You are about to drop the column `tag_name` on the `Blacklisted_Tag` table. All the data in the column will be lost.
  - Added the required column `tag__id` to the `Blacklisted_Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tag_name_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blacklisted_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag__id" INTEGER NOT NULL
);
INSERT INTO "new_Blacklisted_Tag" ("id") SELECT "id" FROM "Blacklisted_Tag";
DROP TABLE "Blacklisted_Tag";
ALTER TABLE "new_Blacklisted_Tag" RENAME TO "Blacklisted_Tag";
CREATE UNIQUE INDEX "Blacklisted_Tag_tag__id_key" ON "Blacklisted_Tag"("tag__id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
