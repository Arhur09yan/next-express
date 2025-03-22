"use client";

import { PostForm } from "@/components/post.form";
import { Skeleton } from "@/components/ui/skeleton";
import { usePost } from "@/lib/hooks/use.posts";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, isError } = usePost(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
            <div className="space-y-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
            <div className="p-4 rounded-md bg-red-50 text-red-500">
              Failed to load post. Please try again later.
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center flex-col">
      <main className="flex-1 container py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
          <PostForm post={post} isEditing />
        </div>
      </main>
    </div>
  );
}
