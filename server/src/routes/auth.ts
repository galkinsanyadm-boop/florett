import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// Простой пароль для админки (в продакшене использовать env переменную)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('florett2024', 10);

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Пароль обязателен' });
    }

    const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = generateToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
