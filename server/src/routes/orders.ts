import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/orders - список заказов (admin)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, from, to } = req.query;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from as string);
      if (to) where.createdAt.lte = new Date(to as string);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            bouquet: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Преобразуем данные букетов
    const result = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        bouquet: item.bouquet ? {
          ...item.bouquet,
          composition: JSON.parse(item.bouquet.composition),
          images: JSON.parse(item.bouquet.images)
        } : null
      }))
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/orders/:id - детали заказа (admin)
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            bouquet: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json({
      ...order,
      items: order.items.map(item => ({
        ...item,
        bouquet: item.bouquet ? {
          ...item.bouquet,
          composition: JSON.parse(item.bouquet.composition),
          images: JSON.parse(item.bouquet.images)
        } : null
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/orders - создать заказ (публичный)
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      comment,
      items
    } = req.body;

    if (!customerName || !customerPhone || !deliveryAddress || !deliveryDate || !deliveryTime || !items?.length) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    // Получаем цены букетов
    const bouquetIds = items.map((i: any) => i.bouquetId);
    const bouquets = await prisma.bouquet.findMany({
      where: { id: { in: bouquetIds } }
    });

    const bouquetMap = new Map(bouquets.map(b => [b.id, b]));

    // Считаем общую сумму
    let totalPrice = 0;
    const orderItems = items.map((item: any) => {
      const bouquet = bouquetMap.get(item.bouquetId);
      if (!bouquet) throw new Error(`Букет ${item.bouquetId} не найден`);

      const priceAtOrder = bouquet.price;
      totalPrice += priceAtOrder * item.quantity;

      return {
        bouquetId: item.bouquetId,
        quantity: item.quantity,
        priceAtOrder
      };
    });

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        deliveryDate,
        deliveryTime,
        comment,
        totalPrice,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PATCH /api/orders/:id/status - изменить статус (admin)
router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['new', 'confirmed', 'in_progress', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Недопустимый статус' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
