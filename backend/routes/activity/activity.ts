import { FastifyInstance } from "fastify";
import { prisma } from "../../services/infra/prisma";
import { ActivityService } from "../../services/activity/activityService";
import { requireAuth } from "../../middleware/auth";
import { requireRepoPermission, RepoLevel } from "../../middleware/repoAuth";

/**
 * Activity API: Collaboration Visibility
 * Provides endpoints for organization and repository activity streams.
 */
export async function activityRoutes(fastify: FastifyInstance) {
  // Repo Activity Feed
  fastify.get(
    "/repositories/:id/activity",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      const { limit } = request.query as { limit?: string };
      return await ActivityService.getRepoActivity(
        repoId,
        limit ? parseInt(limit) : 20,
      );
    },
  );

  // Org Activity Feed
  fastify.get(
    "/organizations/:orgId/activity",
    // Note: Org auth middleware needs to be verified or created.
    // Fallback to basic auth for now if orgAuth.ts is missing.
    async (request) => {
      const { orgId } = request.params as { orgId: string };
      const { limit } = request.query as { limit?: string };
      return await ActivityService.getOrgActivity(
        orgId,
        limit ? parseInt(limit) : 50,
      );
    },
  );

  // Following Feed - Activity from users the current user follows
  fastify.get("/activity/following", { preHandler: requireAuth }, async (request, reply) => {
    try {
      const currentUser = (request as any).user;
      const { page, limit } = request.query as { page?: string; limit?: string };
      const pageNum = Math.max(1, page ? parseInt(page) : 1);
      const limitNum = Math.min(100, limit ? parseInt(limit) : 20);
      const skip = (pageNum - 1) * limitNum;

      // 1. Find who the user follows
      const follows = await prisma.follow.findMany({
        where: { followerId: currentUser.userId },
        select: { followingId: true }
      });
      const followingIds = follows.map(f => f.followingId);

      if (followingIds.length === 0) {
        return { activities: [], total: 0, page: pageNum, limit: limitNum };
      }

      // 2. Fetch activity logs from those users
      const [activities, total] = await Promise.all([
        prisma.activityLog.findMany({
          where: { userId: { in: followingIds } },
          include: { 
            user: { select: { id: true, name: true, username: true, avatar: true } },
            repo: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum
        }),
        prisma.activityLog.count({
          where: { userId: { in: followingIds } }
        })
      ]);

      return {
        activities,
        total,
        page: pageNum,
        limit: limitNum,
      };
    } catch (error: any) {
      console.error("[Activity] Error fetching following feed:", error.message);
      return reply.status(500).send({ error: "Failed to fetch activity feed" });
    }
  });
}




