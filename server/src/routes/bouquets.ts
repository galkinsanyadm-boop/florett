import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/bouquets - список букетов (публичный)
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;

    const where = active === 'true' ? { isActive: true } : {};

    const bouquets = await prisma.bouquet.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Преобразуем JSON строки в массивы
    const result = bouquets.map(b => ({
      ...b,
      composition: JSON.parse(b.composition),
      images: JSON.parse(b.images)
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching bouquets:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/bouquets/:id - один букет
router.get('/:id', async (req, res) => {
  try {
    const bouquet = await prisma.bouquet.findUnique({
      where: { id: req.params.id }
    });

    if (!bouquet) {
      return res.status(404).json({ error: 'Букет не найден' });
    }

    res.json({
      ...bouquet,
      composition: JSON.parse(bouquet.composition),
      images: JSON.parse(bouquet.images)
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/bouquets - создать букет (admin)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, price, category, description, composition, images, size, isActive } = req.body;

    const bouquet = await prisma.bouquet.create({
      data: {
        name,
        price,
        category,
        description,
        composition: JSON.stringify(composition),
        images: JSON.stringify(images),
        size,
        isActive: isActive ?? true
      }
    });

    res.status(201).json({
      ...bouquet,
      composition: JSON.parse(bouquet.composition),
      images: JSON.parse(bouquet.images)
    });
  } catch (error) {
    console.error('Error creating bouquet:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/bouquets/:id - обновить букет (admin)
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, price, category, description, composition, images, size, isActive } = req.body;

    const bouquet = await prisma.bouquet.update({
      where: { id: req.params.id },
      data: {
        name,
        price,
        category,
        description,
        composition: JSON.stringify(composition),
        images: JSON.stringify(images),
        size,
        isActive
      }
    });

    res.json({
      ...bouquet,
      composition: JSON.parse(bouquet.composition),
      images: JSON.parse(bouquet.images)
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/bouquets/:id - удалить букет (admin)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.bouquet.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
