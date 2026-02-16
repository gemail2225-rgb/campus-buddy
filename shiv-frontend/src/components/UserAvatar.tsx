import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  User,
  Star,
  Crown,
  Award,
  CheckCircle,
  Clock
} from "lucide-react";

interface UserAvatarProps {
  user: {
    name: string;
    role?: "student" | "professor" | "club" | "admin" | string;
    avatar?: string;
    email?: string;
    status?: "online" | "offline" | "away" | "busy";
    isVerified?: boolean;
    isPremium?: boolean;
    badge?: string;
  };
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  showRole?: boolean;
  showTooltip?: boolean;
  variant?: "default" | "bordered" | "gradient";
  className?: string;
  onClick?: () => void;
}

const sizeVariants = {
  xs: {
    avatar: "h-6 w-6",
    text: "text-[8px]",
    icon: "h-2 w-2",
    badge: "h-3 w-3 text-[6px]"
  },
  sm: {
    avatar: "h-8 w-8",
    text: "text-xs",
    icon: "h-3 w-3",
    badge: "h-4 w-4 text-[8px]"
  },
  md: {
    avatar: "h-10 w-10",
    text: "text-sm",
    icon: "h-4 w-4",
    badge: "h-5 w-5 text-xs"
  },
  lg: {
    avatar: "h-12 w-12",
    text: "text-base",
    icon: "h-5 w-5",
    badge: "h-6 w-6 text-sm"
  },
  xl: {
    avatar: "h-16 w-16",
    text: "text-lg",
    icon: "h-6 w-6",
    badge: "h-7 w-7 text-base"
  }
};

const roleConfig = {
  student: {
    icon: GraduationCap,
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    label: "Student"
  },
  professor: {
    icon: BookOpen,
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    label: "Professor"
  },
  club: {
    icon: Users,
    color: "bg-amber-500",
    textColor: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    label: "Club"
  },
  admin: {
    icon: Shield,
    color: "bg-red-500",
    textColor: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    label: "Admin"
  }
};

const statusConfig = {
  online: {
    color: "bg-green-500",
    pulse: true,
    label: "Online"
  },
  offline: {
    color: "bg-gray-400",
    pulse: false,
    label: "Offline"
  },
  away: {
    color: "bg-yellow-500",
    pulse: false,
    label: "Away"
  },
  busy: {
    color: "bg-red-500",
    pulse: false,
    label: "Busy"
  }
};

export const UserAvatar = ({
  user,
  size = "md",
  showStatus = false,
  showRole = false,
  showTooltip = true,
  variant = "default",
  className,
  onClick
}: UserAvatarProps) => {
  const sizes = sizeVariants[size];
  const roleInfo = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.student;
  const RoleIcon = roleInfo.icon;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBorderClass = () => {
    switch (variant) {
      case "bordered":
        return `border-2 ${roleInfo.borderColor}`;
      case "gradient":
        return "border-2 border-transparent bg-gradient-to-r from-amber-500 to-orange-500 p-[2px]";
      default:
        return "";
    }
  };

  const getAvatarContent = () => (
    <div className="relative inline-block">
      {variant === "gradient" ? (
        <div className={cn("rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-[2px]")}>
          <Avatar className={cn("h-full w-full border-2 border-white dark:border-gray-900", sizes.avatar)}>
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className={cn(roleInfo.bgColor, roleInfo.textColor, sizes.text)}>
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      ) : (
        <Avatar className={cn(sizes.avatar, getBorderClass(), className)} onClick={onClick}>
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name} />
          ) : (
            <AvatarFallback className={cn(roleInfo.bgColor, roleInfo.textColor, sizes.text)}>
              {getInitials(user.name)}
            </AvatarFallback>
          )}
        </Avatar>
      )}

      {/* Status Indicator */}
      {showStatus && user.status && (
        <span className="absolute bottom-0 right-0 block">
          <span className={cn(
            "relative flex h-2.5 w-2.5",
            sizes.icon === "h-2 w-2" && "h-2 w-2",
            sizes.icon === "h-3 w-3" && "h-2.5 w-2.5",
            sizes.icon === "h-4 w-4" && "h-3 w-3",
            sizes.icon === "h-5 w-5" && "h-3.5 w-3.5",
            sizes.icon === "h-6 w-6" && "h-4 w-4"
          )}>
            <span className={cn(
              "absolute inline-flex h-full w-full rounded-full",
              statusConfig[user.status].color,
              statusConfig[user.status].pulse && "animate-ping opacity-75"
            )} />
            <span className={cn(
              "relative inline-flex rounded-full h-full w-full",
              statusConfig[user.status].color
            )} />
          </span>
        </span>
      )}

      {/* Verification Badge */}
      {user.isVerified && (
        <span className="absolute -top-1 -right-1">
          <Badge variant="default" className={cn(
            "rounded-full p-0 bg-blue-500",
            sizes.badge
          )}>
            <CheckCircle className={cn("text-white", sizes.icon)} />
          </Badge>
        </span>
      )}

      {/* Premium Badge */}
      {user.isPremium && (
        <span className="absolute -top-1 -left-1">
          <Badge variant="default" className={cn(
            "rounded-full p-0 bg-yellow-500",
            sizes.badge
          )}>
            <Star className={cn("text-white", sizes.icon)} />
          </Badge>
        </span>
      )}

      {/* Custom Badge */}
      {user.badge && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <Badge variant="secondary" className="text-[8px] h-4 px-1 whitespace-nowrap">
            {user.badge}
          </Badge>
        </span>
      )}
    </div>
  );

  const getTooltipContent = () => (
    <div className="space-y-1">
      <p className="font-semibold">{user.name}</p>
      {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
      <div className="flex items-center gap-1 pt-1">
        <RoleIcon className="h-3 w-3" />
        <span className="text-xs capitalize">{user.role}</span>
        {user.status && (
          <>
            <span className="text-xs text-muted-foreground mx-1">•</span>
            <span className="text-xs capitalize">{statusConfig[user.status].label}</span>
          </>
        )}
      </div>
    </div>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            {getAvatarContent()}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="p-2">
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return getAvatarContent();
};

// Role Badge Component
interface RoleBadgeProps {
  role: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const RoleBadge = ({ role, size = "sm", showIcon = true, className }: RoleBadgeProps) => {
  const roleInfo = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
  const RoleIcon = roleInfo.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        roleInfo.bgColor,
        roleInfo.textColor,
        "border-none",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <RoleIcon className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
      {roleInfo.label}
    </Badge>
  );
};

// User Info Component (for lists)
interface UserInfoProps {
  user: UserAvatarProps['user'];
  showEmail?: boolean;
  showRole?: boolean;
  className?: string;
}

export const UserInfo = ({ user, showEmail = false, showRole = true, className }: UserInfoProps) => {
  const roleInfo = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.student;
  const RoleIcon = roleInfo.icon;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <UserAvatar user={user} size="sm" showStatus />
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{user.name}</p>
          {user.isVerified && (
            <CheckCircle className="h-3 w-3 text-blue-500" />
          )}
        </div>
        {showEmail && (
          <p className="text-xs text-muted-foreground">{user.email}</p>
        )}
        {showRole && (
          <div className="flex items-center gap-1 mt-0.5">
            <RoleIcon className={cn("h-3 w-3", roleInfo.textColor)} />
            <span className={cn("text-xs capitalize", roleInfo.textColor)}>
              {user.role}
            </span>
            {user.status && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs capitalize text-muted-foreground">
                  {statusConfig[user.status].label}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;