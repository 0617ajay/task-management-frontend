// src/hooks/useTasks.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useToast } from "@/components/ToasterProvider";

type TaskQueryOptions = {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
};

export function useTasks(opt: TaskQueryOptions) {
  const queryClient = useQueryClient();
  const toast = useToast();

  // --------------------------
  // Fetcher
  // --------------------------
  const fetchTasks = async ({ queryKey }: any) => {
    const [_key, { page, limit, status, q }] = queryKey;

    const params: any = { page, limit };
    if (status) params.status = status;
    if (q) params.search = q;

    const res = await api.get("/tasks", { params });
    return res.data.data;
  };

  // --------------------------
  // Query
  // --------------------------
  const query = useQuery({
    queryKey: ["tasks", { 
      page: opt.page || 1,
      limit: opt.limit || 10,
      status: opt.status,
      q: opt.q
    }],
    queryFn: fetchTasks,
    placeholderData: (prev) => prev,  // replaces keepPreviousData
  });

  // --------------------------
  // Toggle Mutation
  // --------------------------
  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/tasks/${id}/toggle`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Status updated");
    },

    onError: () => toast.error("Failed to update status"),
  });

  // --------------------------
  // Delete Mutation
  // --------------------------
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Deleted");
    },

    onError: () => toast.error("Delete failed"),
  });

  // --------------------------
  // Return API
  // --------------------------
  return {
    ...query,
    toggleTask: (id: string) => toggleMutation.mutate(id),
    deleteTask: (id: string) => deleteMutation.mutate(id),
    refetch: query.refetch,
  };
}
