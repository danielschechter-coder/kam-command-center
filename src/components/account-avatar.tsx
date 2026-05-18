import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AccountAvatar({
  initials,
  color,
  size = "md",
  className,
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  return (
    <Avatar className={cn(sizeClass, className)}>
      <AvatarFallback className={cn(color)}>{initials}</AvatarFallback>
    </Avatar>
  );
}
