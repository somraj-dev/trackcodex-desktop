import { prisma } from "../infra/prisma";
import os from "os";

export const globalStatsService = {
  /**
   * Get system-wide overview stats and activity flux
   */
  async getSystemOverview() {
    const [workspaceCount, repoCount, aiTaskCount, userCount] = await Promise.all([
      prisma.workspace.count(),
      prisma.repository.count(),
      prisma.aITask.count(),
      prisma.user.count(),
    ]);

    // Simple hardware telemetry
    const hardware = {
      cpuUsage: Math.round(os.loadavg()[0] * 10), // Simplified
      memoryUsage: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
      status: "SYNCED",
      label: os.loadavg()[0] > 1.5 ? "L5 Under Load" : "L5 Active"
    };

    // Global Activity Flux (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [commits, aiTasks, recentAITasks] = await Promise.all([
      prisma.activityLog.groupBy({
        by: ["createdAt"],
        where: {
          action: "commit",
          createdAt: { gte: sevenDaysAgo }
        },
        _count: { id: true }
      }),
      prisma.aITask.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: { gte: sevenDaysAgo }
        },
        _count: { id: true }
      }),
      prisma.aITask.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          repo: { select: { name: true } }
        }
      })
    ]);

    // Aggregate by day
    const dayMap: Record<string, { name: string, commits: number, ai: number }> = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split("T")[0];
        dayMap[dateStr] = { name: days[d.getDay()], commits: 0, ai: 0 };
    }

    commits.forEach((c) => {
        const date = new Date(c.createdAt).toISOString().split("T")[0];
        if (dayMap[date]) dayMap[date].commits += c._count.id;
    });

    aiTasks.forEach((t) => {
        const date = new Date(t.createdAt).toISOString().split("T")[0];
        if (dayMap[date]) dayMap[date].ai += t._count.id;
    });

    return {
      counts: {
        workspaces: workspaceCount,
        repos: repoCount,
        aiTasks: aiTaskCount,
        users: userCount
      },
      hardware,
      activityFlux: Object.values(dayMap),
      recentAITasks: recentAITasks.map(t => ({
        id: t.id,
        taskName: t.taskName,
        repoName: t.repo?.name,
        timestamp: t.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: t.status
      }))
    };
  }
};
