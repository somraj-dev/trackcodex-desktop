-- CreateTable
CREATE TABLE "RepositoryDomainScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secureCodingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fixSpeedScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskManagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepositoryDomainScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceDomainScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "professionalReliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deliveryDisciplineScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "appliedSecurityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceDomainScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OssDomainScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "engineeringDepthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "securityLeadershipScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ossImpactScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OssDomainScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRadarState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "axisName" TEXT NOT NULL,
    "axisScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRadarState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernanceRule" (
    "id" TEXT NOT NULL,
    "axisName" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadarHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "axisName" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RadarHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryDomainScore_userId_key" ON "RepositoryDomainScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceDomainScore_userId_key" ON "MarketplaceDomainScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OssDomainScore_userId_key" ON "OssDomainScore"("userId");

-- CreateIndex
CREATE INDEX "UserRadarState_userId_idx" ON "UserRadarState"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRadarState_userId_axisName_key" ON "UserRadarState"("userId", "axisName");

-- CreateIndex
CREATE INDEX "GovernanceRule_axisName_idx" ON "GovernanceRule"("axisName");

-- CreateIndex
CREATE INDEX "GovernanceRule_active_idx" ON "GovernanceRule"("active");

-- CreateIndex
CREATE INDEX "RadarHistory_userId_idx" ON "RadarHistory"("userId");

-- CreateIndex
CREATE INDEX "RadarHistory_userId_axisName_idx" ON "RadarHistory"("userId", "axisName");
