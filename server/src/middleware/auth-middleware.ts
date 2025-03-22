// import type { Request, Response, NextFunction } from "express"
// import jwt from "jsonwebtoken"
// import { prisma } from "../server"

// interface JwtPayload {
//   userId: string
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string
//       }
//     }
//   }
// }

// export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Get token from header
//     const authHeader = req.headers.authorization

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized - No token provided" })
//     }

//     const token = authHeader.split(" ")[1]

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized - Invalid token format" })
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

//     // Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//     })

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized - User not found" })
//     }

//     // Add user to request
//     req.user = { id: user.id }

//     next()
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ message: "Unauthorized - Invalid token" })
//     }

//     next(error)
//   }
// }
