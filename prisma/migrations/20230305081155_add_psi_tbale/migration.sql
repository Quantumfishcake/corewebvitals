-- CreateTable
CREATE TABLE "Psi_Score" (
    "scoreId" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "score_type" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "field_fcp" INTEGER NOT NULL,
    "field_fid" INTEGER NOT NULL,
    "field_cls" INTEGER NOT NULL,
    "field_lcp" INTEGER NOT NULL,
    "field_inp" INTEGER NOT NULL,
    "field_ttfb" INTEGER NOT NULL,
    "lighthouse_score" INTEGER NOT NULL,
    "lighthouse_fcp" INTEGER NOT NULL,
    "lighthouse_si" INTEGER NOT NULL,
    "lighthouse_tti" INTEGER NOT NULL,
    "lighthouse_tbt" INTEGER NOT NULL,
    "lighthouse_cls" INTEGER NOT NULL,
    "lighthouse_lcp" INTEGER NOT NULL,

    CONSTRAINT "Psi_Score_pkey" PRIMARY KEY ("scoreId")
);

-- AddForeignKey
ALTER TABLE "Psi_Score" ADD CONSTRAINT "Psi_Score_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
