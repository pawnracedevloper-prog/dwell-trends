import { Star } from "lucide-react";

export function RatingPill({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary border border-rose-deep/25 px-2.5 py-0.5 text-[11px] font-black text-rose-deep shadow-xs">
        {rating.toFixed(1)}
        <Star className="h-2.5 w-2.5 fill-rose-deep text-rose-deep" />
      </span>
      {count !== undefined && (
        <span className="text-[11px] font-medium text-muted-foreground">
          ({count.toLocaleString("en-IN")})
        </span>
      )}
    </span>
  );
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 transition-colors ${
            i <= Math.round(rating)
              ? "fill-rose-deep text-rose-deep"
              : "text-border fill-border/30"
          }`}
        />
      ))}
    </span>
  );
}