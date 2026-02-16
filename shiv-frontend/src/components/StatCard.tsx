import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    direction?: "up" | "down" | "neutral";
  };
  progress?: {
    value: number;
    max: number;
    color?: string;
  };
  footer?: React.ReactNode;
  variant?: "default" | "gradient" | "outline" | "compact";
  color?: "blue" | "green" | "purple" | "orange" | "red" | "emerald" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const colorVariants = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    gradient: "from-blue-500 to-blue-600",
    light: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400"
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    gradient: "from-green-500 to-green-600",
    light: "bg-green-100 dark:bg-green-900/30",
    icon: "text-green-600 dark:text-green-400"
  },
  purple: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    gradient: "from-amber-500 to-amber-600",
    light: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400"
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    gradient: "from-orange-500 to-orange-600",
    light: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400"
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    gradient: "from-red-500 to-red-600",
    light: "bg-red-100 dark:bg-red-900/30",
    icon: "text-red-600 dark:text-red-400"
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    gradient: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400"
  },
  default: {
    bg: "bg-gray-50 dark:bg-gray-800/50",
    text: "text-gray-900 dark:text-gray-100",
    border: "border-gray-200 dark:border-gray-700",
    gradient: "from-gray-500 to-gray-600",
    light: "bg-gray-100 dark:bg-gray-800",
    icon: "text-gray-600 dark:text-gray-400"
  }
};

const sizeVariants = {
  sm: {
    card: "p-3",
    title: "text-xs",
    value: "text-xl",
    icon: "h-4 w-4",
    description: "text-[10px]"
  },
  md: {
    card: "p-4",
    title: "text-sm",
    value: "text-2xl",
    icon: "h-5 w-5",
    description: "text-xs"
  },
  lg: {
    card: "p-6",
    title: "text-base",
    value: "text-3xl",
    icon: "h-6 w-6",
    description: "text-sm"
  }
};

export const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  progress,
  footer,
  variant = "default",
  color = "default",
  size = "md",
  className,
  onClick
}: StatCardProps) => {
  const colors = colorVariants[color];
  const sizes = sizeVariants[size];

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    switch (trend.direction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  if (variant === "gradient") {
    return (
      <Card 
        className={cn(
          "relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
          className
        )}
        onClick={onClick}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br", colors.gradient, "opacity-90")} />
        <CardContent className={cn("relative z-10", sizes.card)}>
          <div className="flex items-center justify-between">
            <p className={cn("font-medium text-white/90", sizes.title)}>{title}</p>
            {icon && <div className="text-white/80">{icon}</div>}
          </div>
          <div className="mt-2">
            <div className={cn("font-bold text-white", sizes.value)}>{value}</div>
            {description && (
              <p className={cn("text-white/70 mt-1", sizes.description)}>{description}</p>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-white/80">
              {getTrendIcon()}
              <span className="text-xs">{trend.value}% {trend.label || ""}</span>
            </div>
          )}
          {footer && <div className="mt-3 text-white/80">{footer}</div>}
        </CardContent>
      </Card>
    );
  }

  if (variant === "outline") {
    return (
      <Card 
        className={cn(
          "border-2 transition-all duration-300 hover:shadow-md",
          colors.border,
          className
        )}
        onClick={onClick}
      >
        <CardContent className={sizes.card}>
          <div className="flex items-center justify-between">
            <p className={cn("font-medium text-muted-foreground", sizes.title)}>{title}</p>
            {icon && <div className={cn(colors.icon)}>{icon}</div>}
          </div>
          <div className={cn("font-bold mt-2", colors.text, sizes.value)}>{value}</div>
          {description && (
            <p className={cn("text-muted-foreground mt-1", sizes.description)}>{description}</p>
          )}
          {trend && (
            <div className={cn("flex items-center gap-1 mt-2", getTrendColor())}>
              {getTrendIcon()}
              <span className="text-xs">{trend.value}% {trend.label || ""}</span>
            </div>
          )}
          {progress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round((progress.value / progress.max) * 100)}%</span>
              </div>
              <Progress 
                value={(progress.value / progress.max) * 100} 
                className={cn("h-1.5", progress.color)} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card 
        className={cn("cursor-pointer transition-all hover:shadow-md", className)}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={cn("p-2 rounded-lg", colors.light)}>
                {icon}
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">{title}</p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        colors.bg,
        className
      )}
      onClick={onClick}
    >
      <CardContent className={sizes.card}>
        <div className="flex items-center justify-between">
          <p className={cn("font-medium text-muted-foreground", sizes.title)}>{title}</p>
          {icon && <div className={cn(colors.icon)}>{icon}</div>}
        </div>
        
        <div className="mt-2 space-y-1">
          <div className={cn("font-bold", colors.text, sizes.value)}>{value}</div>
          
          {description && (
            <p className={cn("text-muted-foreground", sizes.description)}>{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center gap-0.5", getTrendColor())}>
                {getTrendIcon()}
                <span className="text-xs font-medium">{trend.value}%</span>
              </div>
              {trend.label && (
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              )}
            </div>
          )}

          {progress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{progress.value}/{progress.max}</span>
                <span>{Math.round((progress.value / progress.max) * 100)}%</span>
              </div>
              <Progress 
                value={(progress.value / progress.max) * 100} 
                className="h-1.5"
              />
            </div>
          )}
        </div>

        {footer && (
          <div className="mt-3 pt-2 border-t border-border">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;