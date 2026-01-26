import { useTheme } from "../context/ThemeContext";

export function Skeleton({ className = "" }) {
  const { theme } = useTheme();
  return (
    <div
      className={`animate-pulse rounded-lg ${
        theme === "light" ? "bg-gray-300" : "bg-white/10"
      } ${className}`}
    />
  );
}

/* ---------- PRESETS ---------- */

export function ProductCardSkeleton() {
  const { theme } = useTheme();
  return (
    <div className={`rounded-2xl border p-4 space-y-4 ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-card border-white/10"
    }`}>
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

export function CartItemSkeleton() {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center justify-between rounded-2xl border p-4 ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-card border-white/10"
    }`}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}

export function OrderSkeleton() {
  const { theme } = useTheme();
  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-card border-white/10"
    }`}>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}

export function PageSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

// 🔹 Product Card Skeleton
export function ProductSkeleton() {
  const { theme } = useTheme();
  return (
    <div className={`rounded-2xl border p-4 animate-pulse ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-card border-white/10"
    }`}>
      <div className={`aspect-square rounded-xl mb-4 ${
        theme === "light" ? "bg-gray-300" : "bg-white/10"
      }`} />
      <div className={`h-4 rounded w-3/4 mb-2 ${
        theme === "light" ? "bg-gray-300" : "bg-white/10"
      }`} />
      <div className={`h-3 rounded w-full mb-4 ${
        theme === "light" ? "bg-gray-300" : "bg-white/10"
      }`} />
      <div className={`h-4 rounded w-1/3 ${
        theme === "light" ? "bg-gray-300" : "bg-white/10"
      }`} />
    </div>
  );
}

// 🔹 Category Card Skeleton
export function CategorySkeleton() {
  const { theme } = useTheme();
  return (
    <div className={`rounded-2xl border p-6 animate-pulse ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-card border-white/10"
    }`}>
      <div className={`h-5 rounded w-2/3 mb-3 ${
        theme === "light" ? "bg-gray-300" : "bg-white/10"
      }`} />
      <div className={`h-4 rounded w-1/2 ${
        theme === "light" ? "bg-gray-300" : "bg-white/10"
      }`} />
    </div>
  );
}
