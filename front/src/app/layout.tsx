import type React from "react";

import { QueryProvider } from "@/provider/query-provider";
import { Inter } from "next/font/google";

import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Title",
  description:
    "A full-stack application built with Next.js, TypeScript, and Shadcn/UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <ToastContainer autoClose={2000} />
        </QueryProvider>
      </body>
    </html>
  );
}
