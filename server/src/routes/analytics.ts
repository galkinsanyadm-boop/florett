import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics/summary - общая статистика
router.get('/summary', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Заказы сегодня
    const ordersToday = await prisma.order.count({
      where: {
        createdAt: { gte: today }
      }
    });

    // Выручка за месяц
    const monthOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: monthStart },
        status: { not: 'cancelled' }
      },
      select: { totalPrice: true }
    });
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    // Отзывы на модерации
    const pendingReviews = await prisma.review.count({
      where: { isApproved: false }
    });

    // Новые заказы
    const newOrders = await prisma.order.count({
      where: { status: 'new' }
    });

    // Всего заказов
    const totalOrders = await prisma.order.count();

    // Всего букетов
    const totalBouquets = await prisma.bouquet.count();

    res.json({
      ordersToday,
      monthRevenue,
      pendingReviews,
      newOrders,
      totalOrders,
      totalBouquets
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/analytics/revenue - выручка по дням
router.get('/revenue', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { days = 30 } = req.query;
    const daysCount = Math.min(Number(days), 90);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'cancelled' }
      },
      select: {
        totalPrice: true,
        createdAt: true
      }
    });

    // Группируем по дням
    const revenueByDay = new Map<string, number>();

    for (let i = 0; i < daysCount; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      revenueByDay.set(key, 0);
    }

    orders.forEach(order => {
      const key = order.createdAt.toISOString().split('T')[0];
      const current = revenueByDay.get(key) || 0;
      revenueByDay.set(key, current + order.totalPrice);
    });

    const result = Array.from(revenueByDay.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/analytics/popular-bouquets - топ продаж
router.get('/popular-bouquets', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { limit = 5 } = req.query;

    const orderItems = await prisma.orderItem.groupBy({
      by: ['bouquetId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: Number(limit)
    });

    const bouquetIds = orderItems.map(i => i.bouquetId);
    const bouquets = await prisma.bouquet.findMany({
      where: { id: { in: bouquetIds } }
    });

    const bouquetMap = new Map(bouquets.map(b => [b.id, b]));

    const result = orderItems.map(item => {
      const bouquet = bouquetMap.get(item.bouquetId);
      return {
        bouquetId: item.bouquetId,
        name: bouquet?.name || 'Неизвестный',
        totalSold: item._sum.quantity || 0,
        image: bouquet ? JSON.parse(bouquet.images)[0] : null
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
