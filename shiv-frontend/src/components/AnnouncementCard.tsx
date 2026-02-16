import { Calendar, Bell, Pin, MessageCircle, Eye, Share2, Edit, Trash2, Megaphone, AlertCircle, Info, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  announcement: {
    id: string | number;
    title: string;
    content: string;
    club: string;
    type: "Recruitment" | "Event" | "Important" | "Meeting" | "General" | "Achievement";
    date: string;
    pinned?: boolean;
    postedBy: string;
    comments?: number;
    views?: number;
    image?: string;
    priority?: "High" | "Medium" | "Low";
    expiryDate?: string;
  };
  onPin?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onShare?: (id: string | number) => void;
  onComment?: (id: string | number) => void;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  isOrganizer?: boolean;
}

const typeColors = {
  Recruitment: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    icon: "👥"
  },
  Event: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    icon: "🎉"
  },
  Important: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    icon: "⚠️"
  },
  Meeting: {
    bg: "bg-emerald-100 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "📅"
  },
  General: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    icon: "📢"
  },
  Achievement: {
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: "🏆"
  }
};

const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500"
};

export const AnnouncementCard = ({
  announcement,
  onPin,
  onEdit,
  onDelete,
  onShare,
  onComment,
  className,
  variant = "default",
  isOrganizer = false
}: AnnouncementCardProps) => {
  const colors = typeColors[announcement.type] || typeColors.General;
  const isExpired = announcement.expiryDate && new Date(announcement.expiryDate) < new Date();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (variant === "compact") {
    return (
      <Card className={cn("group hover:shadow-md transition-all", className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl", colors.bg)}>
              {colors.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm truncate">{announcement.title}</h4>
                  <p className="text-xs text-muted-foreground">{announcement.club}</p>
                </div>
                {announcement.pinned && (
                  <Pin className="h-3 w-3 text-[#1E40AF]" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{announcement.date}</span>
                {announcement.views && (
                  <>
                    <span className="mx-1">•</span>
                    <Eye className="h-3 w-3" />
                    <span>{announcement.views}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className={cn(
        "group hover:shadow-lg transition-all",
        announcement.pinned && "border-l-4 border-l-[#1E40AF]",
        isExpired && "opacity-60",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn("p-4 rounded-xl", colors.bg)}>
              <span className="text-3xl">{colors.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold">{announcement.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className={cn("text-sm font-medium", colors.text)}>{announcement.club}</p>
                    <Badge variant="outline" className={colors.bg}>
                      {announcement.type}
                    </Badge>
                    {announcement.priority && (
                      <div className="flex items-center gap-1">
                        <div className={cn("w-2 h-2 rounded-full", priorityColors[announcement.priority])} />
                        <span className="text-xs text-muted-foreground">{announcement.priority} Priority</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {announcement.pinned && (
                    <Badge variant="default" className="bg-[#1E40AF]">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                  {isExpired && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground whitespace-pre-wrap mb-6">
                {announcement.content}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{announcement.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{announcement.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{announcement.comments || 0} comments</span>
                  </div>
                </div>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-[#f59e0b] text-white">
                    {getInitials(announcement.postedBy)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => onComment?.(announcement.id)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comment
                </Button>
                <Button variant="outline" size="sm" onClick={() => onShare?.(announcement.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {isOrganizer && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => onPin?.(announcement.id)}>
                      <Pin className="h-4 w-4 mr-2" />
                      {announcement.pinned ? "Unpin" : "Pin"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit?.(announcement.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete?.(announcement.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn(
      "group hover:shadow-md transition-all",
      announcement.pinned && "border-l-4 border-l-[#1E40AF]",
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", colors.bg)}>
            <span className="text-xl">{colors.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{announcement.title}</h3>
                <p className={cn("text-xs font-medium", colors.text)}>{announcement.club}</p>
              </div>
              <div className="flex items-center gap-2">
                {announcement.pinned && (
                  <Pin className="h-3 w-3 text-[#1E40AF]" />
                )}
                {announcement.priority === "High" && (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {announcement.content}
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{announcement.date}</span>
                </div>
                {announcement.comments !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{announcement.comments}</span>
                  </div>
                )}
                {announcement.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{announcement.views}</span>
                  </div>
                )}
              </div>
              
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[8px] bg-[#f59e0b] text-white">
                  {getInitials(announcement.postedBy)}
                </AvatarFallback>
              </Avatar>
            </div>

            {isOrganizer && (
              <div className="flex gap-1 mt-3 pt-2 border-t">
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(announcement.id)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete?.(announcement.id)}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;