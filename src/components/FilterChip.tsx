import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export const FilterChip = ({ label, active, onClick, className }: FilterChipProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-primary text-primary hover:bg-accent",
        className
      )}
    >
      {label}
    </button>
  );
};