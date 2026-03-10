-- CreateTable
CREATE TABLE "UserExtension" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "extensionId" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserExtension_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserExtension_userId_idx" ON "UserExtension"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserExtension_userId_extensionId_key" ON "UserExtension"("userId", "extensionId");

-- AddForeignKey
ALTER TABLE "UserExtension" ADD CONSTRAINT "UserExtension_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
