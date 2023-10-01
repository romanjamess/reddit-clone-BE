import express from "express";
import { prisma } from "../server.js";

export const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: true,
                subreddit: true,
                upvotes: true,
                downvotes: true,
                children: true
            },
        });
      
        res.json({ success: true, posts});
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


postRouter.post("/", async (req, res) => {
    try {
        const { title, text, subredditId } = req.body;
        const post = await prisma.post.create({
            data: {
                title,
                text,
                userId: req.user.id,
                subredditId
            }
        });
        res.send({
            success: true,
            post,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

postRouter.put("/:postId", async (req, res) => {
    try {
        const { title, text, } = req.body;
        const { postId } = req.params;

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
                userId: req.user.id,
            },
        });

        if (!post) {
            return res.send({ success: false, error: "Post not found" });
        }

        const updatedPost = await prisma.post.update({
            where: {
                id: postId,
                userId: req.user.id,
            },
            data: {
                title,
                text,
            },

        });
        res.send({ success: true, updatedPost });

    } catch (error) {
        res.send({ success: false, error: error.message });
    }

});

postRouter.delete("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
                userId: req.user.id,
            },
        });

        if (!post) {
            return res.send({ success: false, error: "Post not found" });
        }
        const deletedPost = await prisma.post.delete({
            where: {
                id: postId,
            },
        });
        res.send({ success: true, deletedPost });

    } catch (error) {
        res.send({ success: false, error: error.message });
    }

});
