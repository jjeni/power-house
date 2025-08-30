import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTypeColor(type: string): string {
  switch (type) {
    case "idea":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "tool":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "update":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    default:
      return "bg-primary/20 text-primary border-primary/30";
  }
};

export function formatDate(date: any): any {
  if (!date) return "";

  if (date?.toDate) {
    date = date.toDate();
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

