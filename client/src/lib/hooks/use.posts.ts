import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

export type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId?: string | null;
};

export type PostsResponse = {
  posts: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function usePosts(page = 1, limit = 10, search = "") {
  return useQuery<PostsResponse>({
    queryKey: ["posts", page, limit, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("page", page.toString());
      searchParams.set("limit", limit.toString());
      if (search) searchParams.set("search", search);

      try {
        const response = await axios.get(`${API_URL}/posts`, {
          params: searchParams,
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch posts");
      }
    },
  });
}

export function usePost(id: string) {
  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/${id}`);
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch post");
      }
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      published: boolean;
    }) => {
      try {
        const response = await axios.post(`${API_URL}/posts`, data, {
          headers: { "Content-Type": "application/json" },
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { title: string; content: string; published: boolean };
    }) => {
      try {
        const response = await axios.put(`${API_URL}/posts/${id}`, data, {
          headers: { "Content-Type": "application/json" },
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
      toast.success("Post updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeletePost(
  setDeleteId: (id: string | null) => void,
  refetch: () => void
) {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.delete(`${API_URL}/posts/${id}`);
        if (response.status === 204) return;
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      setDeleteId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
