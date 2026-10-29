import { cn } from "@/lib/cn";

/**
 * Bounceback mark under the Quarkfin brand.
 * Tactile geometric badge: offset brutalist ink frame with dynamic upward rebound vector.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-control border-[1.5px] border-[#121211] bg-[#FFFFFF] shadow-[2px_2px_0px_#121211] transition-transform",
        className
      )}
      aria-label="Bounceback by Quarkfin"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-5 text-[#121211]"
        aria-hidden="true"
      >
        {/* Kinetic upward bounce arrow / springboard */}
        <path
          d="M4 18L10 12L14 16L20 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 7H20V13"
          stroke="#D94E28"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
