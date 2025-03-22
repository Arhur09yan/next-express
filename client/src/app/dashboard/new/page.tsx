"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/components/post.form";

export default function NewPostPage() {
  return (
    <div className="flex min-h-screen w-full items-center flex-col">
      <main className="flex-1 container py-14">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Post </h1>
          <PostForm />
        </div>
      </main>
    </div>
  );
}
