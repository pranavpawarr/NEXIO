"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  FileText,
  Loader2,
  Clock,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["home-data"],
    queryFn: async () => {
      const res = await fetch("/api/home");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return (
      <div className="flex-1 h-full p-8 overflow-y-auto bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#1F1F1F] dark:to-[#161616]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-5 w-[200px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#1F1F1F] dark:to-[#161616]">
      <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              {getGreeting()}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your workspace today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <FileText className="w-8 h-8 mb-3 opacity-90" />
            <p className="text-sm font-medium opacity-90 mb-1">
              Total Documents
            </p>
            <p className="text-3xl font-bold">{data?.documents.length || 0}</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <CheckCircle2 className="w-8 h-8 mb-3 opacity-90" />
            <p className="text-sm font-medium opacity-90 mb-1">Pending Tasks</p>
            <p className="text-3xl font-bold">{data?.tasks.length || 0}</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
            <p className="text-sm font-medium opacity-90 mb-1">This Week</p>
            <p className="text-3xl font-bold">
              {data?.documents.length + data?.tasks.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">Recently Visited</h2>
              </div>
              <Link href="/documents">
                <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  View all →
                </span>
              </Link>
            </div>

            <div className="space-y-2">
              {data?.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    No documents yet. Create your first one!
                  </p>
                </div>
              ) : (
                data?.documents.map((doc: any) => (
                  <Link key={doc.id} href={`/documents/${doc.id}`}>
                    <div className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                          <FileText className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <span className="truncate font-medium text-sm">
                          {doc.title}
                        </span>
                      </div>
                      <Calendar className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold">Task Queue</h2>
              </div>
              <Link href="/tasks">
                <span className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                  View all →
                </span>
              </Link>
            </div>

            <div className="space-y-3">
              {data?.tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    All caught up! No pending tasks.
                  </p>
                </div>
              ) : (
                data?.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="group flex items-start gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
                  >
                    <div className="mt-0.5">
                      <Circle className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1 line-clamp-2">
                        {task.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                          {task.priority}
                        </span>
                        {task.locationName && (
                          <span className="flex items-center gap-1">
                            <span>•</span>
                            <span>{task.locationName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            QUICK ACTIONS
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/documents">
              <button className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                + New Document
              </button>
            </Link>
            <Link href="/tasks">
              <button className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                + New Task
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
