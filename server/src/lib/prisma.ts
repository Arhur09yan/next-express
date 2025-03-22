// import { PrismaClient } from "@prisma/client";

// // Create a singleton instance of PrismaClient
// const prisma: any = new PrismaClient({
//   log:
//     process.env.NODE_ENV === "development"
//       ? ["query", "error", "warn"]
//       : ["error"],
// });

// // Handle connection errors
// prisma.$on("error", (e: any) => {
//   console.error("Prisma Client error:", e);
// });

// export default prisma;

import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
