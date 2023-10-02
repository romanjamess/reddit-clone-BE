import express from "express";
import { prisma } from "../server.js";

export const subredditRouter = express.Router();

subredditRouter.post(`/`, async (req, res) => {
    try {
        const { name } = req.body;
        const subreddit = await prisma.subreddit.create({
            data: {
                name,
                userId: req.user.id,
            }
        });
     
        res.send({
            success: true,
            subreddit
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
              
        });
    } 
});

subredditRouter.delete("/:subredditId", async (req, res) => {
  try {
      const { subredditId} = req.params;
      const sub = await prisma.subreddit.findUnique({
          where: {
              id: subredditId,
              userId: req.user.id,
          },
      });

      if (!sub) {
          return res.send({ success: false, error: "Subreddit not found" });
      }
      const deletedSub = await prisma.subreddit.delete({
          where: {
              id: subredditId,
          },
      });
      res.send({ success: true, deletedSub });

  } catch (error) {
      res.send({ success: false, error: error.message });
  }

});


subredditRouter.get("/", async (req, res) => {
    try {
      const subreddits = await prisma.subreddit.findMany();
  
      res.json({ success: true, subreddits});
    } catch (error) {
      res.send({
        success: false,
        error: error.message,
      });
    }
  });
  