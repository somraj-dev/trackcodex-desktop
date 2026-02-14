-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "accessPassword" TEXT,
ADD COLUMN     "repoUrl" TEXT,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'public';
