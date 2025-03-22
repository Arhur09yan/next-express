// import express from "express"
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import { authenticate } from "../middleware/auth-middleware"
// import { prisma } from "../server"

// const router = express.Router()

// // Register a new user
// router.post("/register", async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" })
//     }

//     // Check if user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     })

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" })
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10)

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//       },
//     })

//     // Generate tokens
//     const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "15m" })

//     const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" })

//     // Save refresh token to database
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken },
//     })

//     res.status(201).json({
//       user,
//       tokens: {
//         accessToken,
//         refreshToken,
//       },
//     })
//   } catch (error) {
//     next(error)
//   }
// })

// // Login
// router.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" })
//     }

//     // Find user
//     const user = await prisma.user.findUnique({
//       where: { email },
//     })

//     if (!user || !user.password) {
//       return res.status(401).json({ message: "Invalid credentials" })
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password)

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" })
//     }

//     // Generate tokens
//     const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "15m" })

//     const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" })

//     // Save refresh token to database
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken },
//     })

//     res.json({
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//       tokens: {
//         accessToken,
//         refreshToken,
//       },
//     })
//   } catch (error) {
//     next(error)
//   }
// })

// // Refresh token
// router.post("/refresh-token", async (req, res, next) => {
//   try {
//     const { refreshToken } = req.body

//     if (!refreshToken) {
//       return res.status(400).json({ message: "Refresh token is required" })
//     }

//     // Verify refresh token
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string }

//     // Find user with this refresh token
//     const user = await prisma.user.findFirst({
//       where: {
//         id: decoded.userId,
//         refreshToken,
//       },
//     })

//     if (!user) {
//       return res.status(401).json({ message: "Invalid refresh token" })
//     }

//     // Generate new tokens
//     const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "15m" })

//     const newRefreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" })

//     // Save new refresh token to database
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken: newRefreshToken },
//     })

//     res.json({
//       tokens: {
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//       },
//     })
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ message: "Invalid refresh token" })
//     }

//     next(error)
//   }
// })

// // Logout
// router.post("/logout", authenticate, async (req, res, next) => {
//   try {
//     // Clear refresh token in database
//     await prisma.user.update({
//       where: { id: req.user!.id },
//       data: { refreshToken: null },
//     })

//     res.status(204).send()
//   } catch (error) {
//     next(error)
//   }
// })

// // Get current user
// router.get("/me", authenticate, async (req, res, next) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.user!.id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//       },
//     })

//     if (!user) {
//       return res.status(404).json({ message: "User not found" })
//     }

//     res.json(user)
//   } catch (error) {
//     next(error)
//   }
// })

// export default router
