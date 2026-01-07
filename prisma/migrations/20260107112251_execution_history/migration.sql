-- AlterTable
ALTER TABLE "Execution" ALTER COLUMN "error" DROP NOT NULL,
ALTER COLUMN "errorStack" DROP NOT NULL,
ADD CONSTRAINT "Execution_pkey" PRIMARY KEY ("id");
