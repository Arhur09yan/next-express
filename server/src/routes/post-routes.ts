import express from "express";

import { prisma } from "../server";

const router = express.Router();

// Get all posts with pagination and search
router.get("/", async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    res.json({
      posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get a single post by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Create a new post (requires authentication)
router.post("/", async (req, res, next) => {
  try {
    const { title, content, published } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        published,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// Delete a post (requires authentication)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
