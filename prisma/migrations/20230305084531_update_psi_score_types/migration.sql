-- AlterTable
ALTER TABLE "Psi_Score" ALTER COLUMN "field_fcp" DROP NOT NULL,
ALTER COLUMN "field_fid" DROP NOT NULL,
ALTER COLUMN "field_cls" DROP NOT NULL,
ALTER COLUMN "field_lcp" DROP NOT NULL,
ALTER COLUMN "field_inp" DROP NOT NULL,
ALTER COLUMN "field_ttfb" DROP NOT NULL,
ALTER COLUMN "lighthouse_fcp" DROP NOT NULL,
ALTER COLUMN "lighthouse_si" DROP NOT NULL,
ALTER COLUMN "lighthouse_si" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "lighthouse_tti" DROP NOT NULL,
ALTER COLUMN "lighthouse_tbt" DROP NOT NULL,
ALTER COLUMN "lighthouse_cls" DROP NOT NULL,
ALTER COLUMN "lighthouse_cls" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "lighthouse_lcp" DROP NOT NULL;
