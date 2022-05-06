import express from 'express';

import { signup, signin, getUserInfo } from '../controllers/user.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/:id', getUserInfo);

export default router;