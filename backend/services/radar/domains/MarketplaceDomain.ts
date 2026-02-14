/**
 * Marketplace Domain — Layer 1
 *
 * Inputs:  Job success rate, delivery time adherence, client rating,
 *          security compliance, disputes
 * Outputs: professional_reliability_score, delivery_discipline_score, applied_security_score
 *
 * All scores normalized 0-100.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MarketplaceDomain {
    /**
     * Recalculate all marketplace scores for a user.
     * Called after job completion, review submission, or dispute resolution.
     */
    async recalculate(userId: string): Promise<MarketplaceScores> {
        const scores = {
            professionalReliabilityScore: await this.calcReliabilityScore(userId),
            deliveryDisciplineScore: await this.calcDeliveryScore(userId),
            appliedSecurityScore: await this.calcAppliedSecurityScore(userId),
        };

        await prisma.marketplaceDomainScore.upsert({
            where: { userId },
            create: { userId, ...scores },
            update: scores,
        });

        return scores;
    }

    /**
     * Professional Reliability Score (0-100)
     * Combines job success rate + client rating.
     */
    private async calcReliabilityScore(userId: string): Promise<number> {
        // Get completed and abandoned jobs
        const [completed, total, reviews] = await Promise.all([
            prisma.jobApplication.count({
                where: { userId, status: "COMPLETED" },
            }),
            prisma.jobApplication.count({
                where: { userId, status: { in: ["COMPLETED", "ABANDONED", "REJECTED"] } },
            }),
            prisma.jobReview.findMany({
                where: { revieweeId: userId },
                select: { rating: true },
            }),
        ]);

        // Job success rate (0-100)
        const successRate = total > 0 ? (completed / total) * 100 : 50;

        // Average client rating (1-5 → 0-100)
        const avgRating =
            reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 20
                : 50;

        // Weighted blend: 60% success rate, 40% rating
        return this.clamp(0.6 * successRate + 0.4 * avgRating);
    }

    /**
     * Delivery Discipline Score (0-100)
     * On-time delivery percentage.
     */
    private async calcDeliveryScore(userId: string): Promise<number> {
        const applications = await prisma.jobApplication.findMany({
            where: { userId, status: "COMPLETED" },
            include: { job: true },
        });

        if (applications.length === 0) return 50;

        let onTime = 0;
        for (const app of applications) {
            // Check if completed before job deadline (if deadline exists)
            if (app.job.deadline) {
                const deadline = new Date(app.job.deadline).getTime();
                const completed = app.updatedAt.getTime();
                if (completed <= deadline) onTime++;
            } else {
                // No deadline = on time by default
                onTime++;
            }
        }

        return this.clamp((onTime / applications.length) * 100);
    }

    /**
     * Applied Security Score (0-100)
     * Security compliance on delivered jobs — pulls from repo security domain.
     */
    private async calcAppliedSecurityScore(userId: string): Promise<number> {
        // Check user's repository security scores
        const repoScores = await prisma.repositoryDomainScore.findUnique({
            where: { userId },
        });

        if (!repoScores) return 50; // Neutral if no repo data

        // Blend secure coding (70%) + risk management (30%)
        return this.clamp(
            0.7 * repoScores.secureCodingScore +
            0.3 * repoScores.riskManagementScore
        );
    }

    private clamp(v: number): number {
        return Math.min(100, Math.max(0, v));
    }

    async getScores(userId: string) {
        return prisma.marketplaceDomainScore.findUnique({ where: { userId } });
    }
}

export interface MarketplaceScores {
    professionalReliabilityScore: number;
    deliveryDisciplineScore: number;
    appliedSecurityScore: number;
}

export const marketplaceDomain = new MarketplaceDomain();
