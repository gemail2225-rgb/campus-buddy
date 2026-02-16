import { Briefcase, Calendar, GraduationCap, Clock, Users, Tag, Edit, Trash2, BookOpen, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ResearchCardProps {
  research: {
    id: string | number;
    title: string;
    professor: string;
    department: string;
    description: string;
    duration: string;
    stipend: string;
    deadline: string;
    requirements: string[];
    applicants?: number;
    maxApplicants?: number;
    status: "Open" | "Deadline Soon" | "Closed" | "Filled";
    postedBy: "professor" | "current";
    type?: "ML/AI" | "Quantum" | "Robotics" | "NLP" | "Computer Vision" | "Other";
    field?: string;
  };
  onApply?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onViewApplicants?: (id: string | number) => void;
  className?: string;
  variant?: "default" | "compact" | "professor";
  isApplied?: boolean;
}

const typeColors = {
  "ML/AI": {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    icon: "🤖"
  },
  "Quantum": {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    icon: "⚛️"
  },
  "Robotics": {
    bg: "bg-emerald-100 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "🔧"
  },
  "NLP": {
    bg: "bg-orange-100 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    icon: "📝"
  },
  "Computer Vision": {
    bg: "bg-orange-100 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    icon: "👁️"
  },
  "Other": {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    icon: "🔬"
  }
};

const statusColors = {
  "Open": "bg-green-500",
  "Deadline Soon": "bg-orange-500",
  "Closed": "bg-gray-500",
  "Filled": "bg-blue-500"
};

export const ResearchCard = ({
  research,
  onApply,
  onEdit,
  onDelete,
  onViewApplicants,
  className,
  variant = "default",
  isApplied = false
}: ResearchCardProps) => {
  const colors = typeColors[research.type || "Other"] || typeColors.Other;
  const isDeadlineSoon = research.status === "Deadline Soon";
  const isClosed = research.status === "Closed" || research.status === "Filled";
  const applicantsPercentage = research.maxApplicants 
    ? ((research.applicants || 0) / research.maxApplicants) * 100 
    : 0;

  const getProfessorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (variant === "compact") {
    return (
      <Card className={cn("group hover:shadow-md transition-all duration-300", className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl", colors.bg)}>
              {colors.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm truncate">{research.title}</h4>
                  <p className="text-xs text-muted-foreground">{research.professor}</p>
                </div>
                <div className={cn("w-2 h-2 rounded-full", statusColors[research.status])} />
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Briefcase className="h-3 w-3" />
                <span>{research.stipend}</span>
                <span className="mx-1">•</span>
                <Calendar className="h-3 w-3" />
                <span>{research.deadline}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "professor") {
    return (
      <Card className={cn("border-l-4 border-l-[#059669] group hover:shadow-lg transition-all", className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className={cn("p-3 rounded-lg", colors.bg)}>
                <span className="text-2xl">{colors.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{research.title}</h3>
                <p className="text-sm text-[#059669] font-medium">{research.department}</p>
              </div>
            </div>
            <Badge variant={isDeadlineSoon ? "destructive" : "default"}>
              {research.status}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{research.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium mt-1">{research.duration}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stipend</p>
              <p className="text-sm font-medium mt-1 text-[#059669]">{research.stipend}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className="text-sm font-medium mt-1">{research.deadline}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Applicants</p>
              <p className="text-sm font-medium mt-1">{research.applicants || 0}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium mb-2">Requirements:</p>
            <div className="flex flex-wrap gap-1">
              {research.requirements.map((req, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {req}
                </Badge>
              ))}
            </div>
          </div>

          {research.maxApplicants && (
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs">
                <span>Applications</span>
                <span>{research.applicants || 0}/{research.maxApplicants}</span>
              </div>
              <Progress value={applicantsPercentage} className="h-1.5" />
            </div>
          )}

          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => onEdit?.(research.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete?.(research.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={() => onViewApplicants?.(research.id)}
            >
              <Users className="h-4 w-4 mr-2" />
              View {research.applicants || 0} Applicants
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant (Student view)
  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className={cn("p-3 rounded-lg", colors.bg)}>
              <span className="text-2xl">{colors.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{research.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[8px] bg-[#059669] text-white">
                    {getProfessorInitials(research.professor)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-[#059669] font-medium">{research.professor}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{research.department}</p>
            </div>
          </div>
          <Badge variant={isDeadlineSoon ? "destructive" : "default"}>
            {research.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {research.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#1E40AF]" />
            <span className="text-sm">{research.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#059669]" />
            <span className="text-sm font-medium text-[#059669]">{research.stipend}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#f59e0b]" />
            <span className="text-sm">Due: {research.deadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{research.applicants || 0} applicants</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-medium mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {research.requirements.map((req, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
          </div>
        </div>

        {research.maxApplicants && (
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xs">
              <span>Applications received</span>
              <span>{research.applicants || 0}/{research.maxApplicants}</span>
            </div>
            <Progress value={applicantsPercentage} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>Posted by Professor</span>
          </div>
          
          {!isClosed && (
            <Button 
              className="ml-auto bg-[#059669] hover:bg-[#047857]"
              size="sm"
              onClick={() => onApply?.(research.id)}
              disabled={isApplied}
            >
              {isApplied ? "Applied ✓" : "Apply Now"}
            </Button>
          )}
          {isClosed && (
            <Badge variant="outline" className="ml-auto">
              {research.status}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchCard;