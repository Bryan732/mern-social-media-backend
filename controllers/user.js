import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signup = async (req, res) => {
    const { username, email, password, color } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) return res.status(400).json({ message: 'Username is taken.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({ username, email, password: hashedPassword, profile_style: color });

        const token = jwt.sign({ username: result.username, id: result._id, profile_style: result.profile_style }, 'test', { expiresIn: '1h' });

        res.status(200).json({ result, token });

    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (!existingUser) return res.status(404).json({ message: 'Wrong username or password.' });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: 'Wrong username or password.' });

        const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, 'test', { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });

    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

export const getUserInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select(['-password']);

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    };
};