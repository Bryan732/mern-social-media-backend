import Post from '../models/post.js';
import mongoose from 'mongoose';

export const getAllPosts = async (req, res) => {
    try {
        Post.find().then((post) => res.status(201).json(post));

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.find({ creator: id });

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    };
};

export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new Post({ ...post, createdAt: new Date().toISOString() });

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const editPost = async (req, res) => {
    const { id } = req.params;
    const { newContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Post not found');

    try {
        const updatedPost = await Post.findByIdAndUpdate(id, { $set: { content: newContent } }, { new: true });

        res.status(201).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    };
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Post not found');

    await Post.findByIdAndRemove(id);

    res.json({ message: 'Post deleted successfully' });
}

export const likePost = async (req, res) => {
    const { likeId } = req.body;
    const { id } = req.params;

    if (!likeId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Post not found');

    const post = await Post.findById(id);

    const index = post.likes.findIndex((id) => id === String(likeId));

    if (index === -1) {
        // like the post
        post.likes.push(likeId);
    } else {
        // dislike the post
        post.likes = post.likes.filter((id) => id !== String(likeId));
    };

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export const commentPost = async (req, res) => {
    const value = req.body;
    const { id } = req.params;

    const post = await Post.findById(id);

    post.comments.push({ user: value.user, user_id: value.user_id, user_profile: value.user_profile, comment: value.comment });

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { commentId, newComment } = req.body;

    //if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Post not found');

    try {
        const updatedComment = await Post.updateOne({ _id: id, 'comments._id': commentId }, { $set: { 'comments.$.comment': newComment } }, { new: true });

        res.status(201).json(updatedComment);
    } catch (err) {
        res.status(404).json({ message: err.message });
    };
    console.log(id, commentId, newComment);
};

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const { commentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Post not found');

    await Post.findByIdAndUpdate(id, { $pull: { comments: { _id: commentId } } }, { new: true });

    res.json({ message: 'Deleted comment' });
};