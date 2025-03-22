"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";

import DeleteModal from "@/components/delete.modal";
import { Input } from "@/components/ui/input";
import { NumericPagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import useDebounce from "@/lib/hooks/use.debounce";
import { useDeletePost, usePosts } from "@/lib/hooks/use.posts";

import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const handleSuccess = () => {
    toast.success("This is a success message!");
  };
  const { data, isLoading, refetch } = usePosts(
    page,
    pageSize,
    debouncedSearch
  );
  const deletePost = useDeletePost(setDeleteId, refetch);

  const handleDelete = async () => {
    if (deleteId) {
      await deletePost.mutateAsync(deleteId);
    }
  };

  const { totalPages = 1 } = data?.meta || {};

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  

  return (
    <div className="flex justify-center mx-auto min-h-screen w-full">
      <main className="flex-1 container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/dashboard/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        <div className="p-2 flex justify-end">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="mb-4 p-2 border w-2xs"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-9 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-40">
                    No posts found. Create your first post!
                  </TableCell>
                </TableRow>
              ) : (
                data?.posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="font-medium">
                      {post.content}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/edit/${post.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="p-4 w-full flex justify-end">
              <NumericPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
        {!!deleteId && (
          <DeleteModal
            deleteId={deleteId}
            setDeleteId={setDeleteId}
            deletePost={deletePost}
            handleDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
