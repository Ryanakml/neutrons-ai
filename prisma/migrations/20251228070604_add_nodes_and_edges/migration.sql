-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "edges" JSONB DEFAULT '[]',
ADD COLUMN     "nodes" JSONB DEFAULT '[]';
