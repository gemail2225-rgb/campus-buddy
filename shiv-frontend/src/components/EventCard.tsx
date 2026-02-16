import { Calendar, MapPin, Clock, Users, Tag, Edit, Trash2, Share2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    club: string;
    type: "Technical" | "Cultural" | "Workshop" | "Seminar" | "Sports" | "Other";
    date: string;
    time: string;
    venue: string;
    description: string;
    registered: number;
    maxParticipants?: number;
    deadline?: string;
    image?: string;
    status?: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
    isRegistered?: boolean;
    isOrganizer?: boolean;
  };
  onRegister?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onShare?: (id: string | number) => void;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

const typeColors = {
  Technical: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    icon: "🎯"
  },
  Cultural: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    icon: "🎨"
  },
  Workshop: {
    bg: "bg-emerald-100 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "🔧"
  },
  Seminar: {
    bg: "bg-orange-100 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    icon: "📢"
  },
  Sports: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    icon: "⚽"
  },
  Other: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    icon: "📌"
  }
};

const statusColors = {
  Upcoming: "bg-blue-500",
  Ongoing: "bg-green-500",
  Completed: "bg-gray-500",
  Cancelled: "bg-red-500"
};

export const EventCard = ({
  event,
  onRegister,
  onEdit,
  onDelete,
  onShare,
  className,
  variant = "default"
}: EventCardProps) => {
  const colors = typeColors[event.type] || typeColors.Other;
  const registrationProgress = event.maxParticipants 
    ? (event.registered / event.maxParticipants) * 100 
    : 0;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (variant === "compact") {
    return (
      <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-2xl", colors.bg)}>
              {colors.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold truncate">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.club}</p>
                </div>
                {event.status && (
                  <div className={cn("w-2 h-2 rounded-full", statusColors[event.status])} />
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className={cn("group relative overflow-hidden", className)}>
        <div className={cn("absolute inset-0 opacity-10", colors.bg)} />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-3xl", colors.bg)}>
                {colors.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className={colors.text}>{event.club}</p>
              </div>
            </div>
            <Badge variant={event.status === "Upcoming" ? "default" : "secondary"}>
              {event.status || "Upcoming"}
            </Badge>
          </div>

          <p className="text-muted-foreground mb-4">{event.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-primary" />
              <span className="text-sm">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-accent" />
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-secondary" />
              <span className="text-sm">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{event.registered} registered</span>
            </div>
          </div>

          {event.maxParticipants && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Capacity</span>
                <span>{event.registered}/{event.maxParticipants}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all", colors.text.replace('text', 'bg'))}
                  style={{ width: `${registrationProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4 pt-4 border-t">
            {!event.isOrganizer && (
              <Button 
                onClick={() => onRegister?.(event.id)}
                disabled={event.isRegistered}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/85 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {event.isRegistered ? "Registered ✓" : "Register Now"}
              </Button>
            )}
            {event.isOrganizer && (
              <>
                <Button variant="outline" onClick={() => onEdit?.(event.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => onDelete?.(event.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => onShare?.(event.id)}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className={cn("p-3 rounded-lg", colors.bg)}>
              <span className="text-2xl">{colors.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className={cn("text-sm font-medium", colors.text)}>{event.club}</p>
            </div>
          </div>
          <Badge variant="outline" className={colors.bg}>
            {event.type}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-brand-primary" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-brand-secondary" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{event.registered} registered</span>
            {event.maxParticipants && (
              <span className="text-xs text-muted-foreground">
                (max {event.maxParticipants})
              </span>
            )}
          </div>
          {event.deadline && (
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-brand-accent" />
              <span>Register by: {event.deadline}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-brand-secondary text-white">
              {getInitials(event.club)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground flex-1">
            Organized by {event.club}
          </span>
          
          {!event.isOrganizer && !event.isRegistered && (
            <Button 
              size="sm"
              className="bg-brand-primary hover:bg-brand-primary/85 text-white font-bold shadow-md hover:shadow-lg transition-all"
              onClick={() => onRegister?.(event.id)}
            >
              Register
            </Button>
          )}
          {event.isRegistered && (
            <Badge variant="default" className="bg-brand-accent">
              Registered
            </Badge>
          )}
          {event.isOrganizer && (
            <Button variant="ghost" size="sm" onClick={() => onEdit?.(event.id)}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;