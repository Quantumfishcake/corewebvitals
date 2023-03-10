/*
  Warnings:

  - You are about to drop the `Scores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Scores";

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL,
    "categorypage" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "smartpages" TEXT[]
);

-- CreateTable
CREATE TABLE "Score" (
    "scoreId" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "score_type" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("scoreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
