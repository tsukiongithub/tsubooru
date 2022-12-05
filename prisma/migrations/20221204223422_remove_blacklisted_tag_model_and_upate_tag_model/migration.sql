/*
  Warnings:

  - You are about to drop the `blacklisted_tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "blacklisted_tags_tag_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "blacklisted_tags";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_tag" ("count", "id") SELECT "count", "id" FROM "tag";
DROP TABLE "tag";
ALTER TABLE "new_tag" RENAME TO "tag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
