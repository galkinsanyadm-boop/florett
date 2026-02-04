import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/reviews - список отзывов
router.get('/', async (req, res) => {
  try {
    const { approved } = req.query;

    const where = approved === 'true' ? { isApproved: true } : {};

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/reviews - создать отзыв (публичный, требует модерации)
router.post('/', async (req, res) => {
  try {
    const { author, text, rating } = req.body;

    if (!author || !text || !rating) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    const review = await prisma.review.create({
      data: {
        author,
        text,
        rating: Math.min(5, Math.max(1, rating)),
        date: new Date().toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        isApproved: false
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PATCH /api/reviews/:id/approve - модерация отзыва (admin)
router.patch('/:id/approve', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { approved } = req.body;

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: approved }
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/reviews/:id - обновить отзыв (admin)
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { author, text, rating, date, highlight, isApproved } = req.body;

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { author, text, rating, date, highlight, isApproved }
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/reviews/:id - удалить отзыв (admin)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.review.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
