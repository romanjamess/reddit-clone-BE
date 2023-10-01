import express from "express";
import { prisma } from "../server.js";

export const likeRouter = express.Router();

likeRouter.post("/upvotes/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        console.log("postId", postId)
        const existingUpvote = await prisma.upvote.findUnique({
             where: {
                postId_userId: {
                    userId: req.user.id,
                    postId,
                }
             }
        });
        if (!existingUpvote) {
            const upVote = await prisma.upvote.create({
                data: {
                    postId,
                    userId: req.user.id
                }
            });
            res.send({ success: true, upVote });
        }else {
            res.send({ success: false, message: "Upvote already exists" });
        }
    } catch (error) {
        res.send({ success: false, error: error.message });
    }
});

likeRouter.delete('/upvotes/:postId', async (req, res) => {
    try {
        const { postId } = req.params; 

        const existingUpvote = await prisma.upvote.findUnique({
            where: {
                postId_userId: {
                    userId: req.user.id,
                    postId,
                },
            },
        });
        if (existingUpvote) {
            const deletedUpvote = await prisma.upvote.delete({
                where: {
                    id: existingUpvote.id,
                },
            });
            res.json({ success: true, upvote: deletedUpvote });
        } else {
            res.json({ success: false, message: 'Upvote does not exist' });
        }
    } catch (error) {
        console.error('Error in DELETE /downvotes/:postId:', error);
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Downvote a post by postId
likeRouter.post('/downvotes/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const existingDownvote = await prisma.downvote.findUnique({
            where: {
                postId_userId: {
                    userId: req.user.id,
                    postId,
                },
            },
        });
        if (!existingDownvote) {
            const newDownvote = await prisma.downvote.create({
                data: { postId, userId: req.user.id },
            })
            res.json({ success: true, downvote: newDownvote });
        } else {
            res.json({ success: false, message: 'Downvote already exists' });
        }
    } catch (error) {
        console.error('Error in POST /downvotes/:postId:', error);
        res.json({
            success: false,
            error: error.message,
        });
    }
});

// Remove a downvote by postId
likeRouter.delete('/downvotes/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const existingDownvote = await prisma.downvote.findUnique({
            where: {
                postId_userId: {
                    userId: req.user.id,
                    postId,
                },
            },
        });
        if (existingDownvote) {
            const deletedDownvote = await prisma.downvote.delete({
                where: {
                    id: existingDownvote.id,
                },
            });
            res.json({ success: true, downvote: deletedDownvote });
        } else {
            res.json({ success: false, message: 'Downvote does not exist' });
        }
    } catch (error) {
        console.error('Error in DELETE /downvotes/:postId:', error);
        res.json({
            success: false,
            error: error.message,
        });
    }
});