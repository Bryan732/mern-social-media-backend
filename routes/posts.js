import express from 'express';

import { getAllPosts, getUserPosts, createPost, likePost, deletePost, commentPost, updateComment, deleteComment, editPost } from '../controllers/post.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getUserPosts);

router.post('/', auth, createPost);
router.post('/comment/:id', auth, commentPost);

router.patch('/likePost/:id', auth, likePost);
router.patch('/deleteComment/:id', auth, deleteComment);
router.patch('/edit/:id', auth, editPost);
router.patch('/editComment/:id', auth, updateComment);

router.delete('/delete/:id', auth, deletePost);

export default router;