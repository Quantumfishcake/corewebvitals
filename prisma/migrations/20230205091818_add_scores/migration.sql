-- CreateTable
CREATE TABLE "Scores" (
    "id" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "score_type" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scores_pkey" PRIMARY KEY ("id")
);
