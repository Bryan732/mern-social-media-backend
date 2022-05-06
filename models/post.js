import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    content: String,
    creator: String,
    username: String,
    profile: String,
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    comments: [
        {
            user: String,
            user_id: String,
            user_profile: String,
            comment: String,
        }
    ],
    createdAt: {
        type: Date,
        default: new Date()
    },
});

export default mongoose.model('Post', postSchema);