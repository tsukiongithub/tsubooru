/*
  Warnings:

  - Added the required column `type` to the `tag` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_tag" ("blacklisted", "count", "id", "name") SELECT "blacklisted", "count", "id", "name" FROM "tag";
DROP TABLE "tag";
ALTER TABLE "new_tag" RENAME TO "tag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
