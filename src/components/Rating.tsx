import { Star } from "lucide-react";

export function RatingPill({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="inline-flex items-center gap-0.5 rounded bg-success px-1.5 py-0.5 font-semibold text-primary-foreground">
        {rating.toFixed(1)}
        <Star className="h-2.5 w-2.5 fill-current" />
      </span>
      {count !== undefined && (
        <span className="text-muted-foreground">({count.toLocaleString("en-IN")})</span>
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
          className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? "fill-gold text-gold" : "text-border"}`}
        />
      ))}
    </span>
  );
}
