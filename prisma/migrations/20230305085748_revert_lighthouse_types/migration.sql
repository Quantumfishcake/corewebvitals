/*
  Warnings:

  - You are about to alter the column `lighthouse_si` on the `Psi_Score` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `lighthouse_tbt` on the `Psi_Score` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Psi_Score" ALTER COLUMN "lighthouse_si" SET DATA TYPE INTEGER,
ALTER COLUMN "lighthouse_tbt" SET DATA TYPE INTEGER;
