import { useRole } from "@/contexts/RoleContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MessageSquareWarning, 
  Briefcase, 
  Search, 
  GraduationCap, 
  Users, 
  CheckCircle, 
  PieChart,
  Clock,
  Calendar,
  Bell,
  Star
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import new components
import { StatCard } from "@/components/StatCard";

// UPGRADED Activity Item
const ActivityItem = ({ 
  icon: Icon, 
  title, 
  time, 
  status,
  onClick 
}: { 
  icon: React.ElementType; 
  title: string; 
  time: string; 
  status?: 'pending' | 'resolved' | 'new';
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group"
  >
    <div className={cn(
      "p-2 rounded-lg transition-colors",
      status === 'pending' && "bg-yellow-100 dark:bg-yellow-900/20 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/30",
      status === 'resolved' && "bg-emerald-100 dark:bg-emerald-900/20 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/30",
      status === 'new' && "bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30",
      !status && "bg-gray-100 dark:bg-gray-800"
    )}>
      <Icon className={cn(
        "h-4 w-4",
        status === 'pending' && "text-yellow-700 dark:text-yellow-400",
        status === 'resolved' && "text-emerald-600 dark:text-emerald-400",
        status === 'new' && "text-blue-600 dark:text-blue-400",
        !status && "text-gray-600 dark:text-gray-400"
      )} strokeWidth={2.5} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {title}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
        {time}
      </p>
    </div>
    {status === 'new' && (
      <Badge className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-semibold">New</Badge>
    )}
  </button>
);

// UPGRADED Welcome Header
const WelcomeHeader = ({ role }: { role: string }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getRoleTitle = () => {
    switch(role) {
      case 'student': return 'Student';
      case 'professor': return 'Professor';
      case 'club': return 'Club Organizer';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          {getGreeting()}, {getRoleTitle()}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
          Here's your campus activity overview
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="px-3 py-1.5 font-medium border-gray-300 dark:border-gray-700">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </Badge>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { role } = useRole();
  const navigate = useNavigate();

  const recentActivities = [
    { icon: MessageSquareWarning, title: "Mess food quality issue – Block C", time: "2 hours ago", status: 'new' as const },
    { icon: Briefcase, title: "Research Internship – IIT Bombay AI Lab", time: "5 hours ago", status: 'pending' as const },
    { icon: Search, title: "Found: Blue JanSport backpack near Library", time: "1 day ago", status: 'resolved' as const },
  ];

  const handleActivityClick = (title: string) => {
    if (title.includes("Mess") || title.includes("quality")) {
      navigate("/dashboard/grievances");
    } else if (title.includes("Internship") || title.includes("Research")) {
      navigate("/dashboard/internships");
    } else if (title.includes("Found") || title.includes("backpack")) {
      navigate("/dashboard/lost-found");
    }
  };

  return (
    <div className="space-y-8 p-8">
      <WelcomeHeader role={role} />

      {/* Stats Cards Grid - Using StatCard component */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {role === "student" && (
          <>
            <StatCard
              title="Active Grievances"
              value={3}
              color="blue"
              icon={<MessageSquareWarning className="h-5 w-5" />}
              trend={{ value: 12, direction: "up", label: "vs last month" }}
            />
            <StatCard
              title="New Opportunities"
              value={12}
              color="green"
              icon={<Briefcase className="h-5 w-5" />}
              trend={{ value: 8, direction: "up", label: "this week" }}
            />
            <StatCard
              title="Lost & Found Posts"
              value={2}
              color="orange"
              icon={<Search className="h-5 w-5" />}
            />
            <StatCard
              title="Current CGPA"
              value="8.7"
              color="green"
              icon={<GraduationCap className="h-5 w-5" />}
              trend={{ value: 3.5, direction: "up", label: "improvement" }}
            />
          </>
        )}
        
        {role === "professor" && (
          <>
            <StatCard
              title="Pending Review"
              value={8}
              color="blue"
              icon={<MessageSquareWarning className="h-5 w-5" />}
              trend={{ value: 5, direction: "down", label: "vs last week" }}
            />
            <StatCard
              title="Resolved Today"
              value={15}
              color="green"
              icon={<CheckCircle className="h-5 w-5" />}
              trend={{ value: 20, direction: "up", label: "increase" }}
            />
            <StatCard
              title="Avg Response Time"
              value="4.2h"
              color="green"
              icon={<Clock className="h-5 w-5" />}
              trend={{ value: 15, direction: "down", label: "faster" }}
            />
            <StatCard
              title="Active Categories"
              value={7}
              color="orange"
              icon={<PieChart className="h-5 w-5" />}
            />
          </>
        )}
        
        {role === "club" && (
          <>
            <StatCard
              title="Event Registrations"
              value={156}
              color="blue"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 24, direction: "up", label: "this month" }}
            />
            <StatCard
              title="Upcoming Events"
              value={4}
              color="green"
              icon={<Calendar className="h-5 w-5" />}
            />
            <StatCard
              title="Announcements"
              value={8}
              color="orange"
              icon={<MessageSquareWarning className="h-5 w-5" />}
            />
            <StatCard
              title="Member Growth"
              value="+12"
              color="green"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 15, direction: "up", label: "this sem" }}
            />
          </>
        )}
        
        {role === "admin" && (
          <>
            <StatCard
              title="Total Students"
              value="1,847"
              color="blue"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 2.4, direction: "up", label: "this week" }}
            />
            <StatCard
              title="Total Grievances"
              value={156}
              color="orange"
              icon={<MessageSquareWarning className="h-5 w-5" />}
              trend={{ value: 8, direction: "down", label: "decrease" }}
            />
            <StatCard
              title="Resolution Rate"
              value="87%"
              color="green"
              icon={<CheckCircle className="h-5 w-5" />}
              trend={{ value: 5, direction: "up", label: "improvement" }}
            />
            <StatCard
              title="Lost Items Returned"
              value={43}
              color="green"
              icon={<Search className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      {/* Full Width Layout - No Quick Actions */}
      <div className="grid gap-6">
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Bell className="h-5 w-5 text-[#1E40AF]" strokeWidth={2.5} />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-1">
                  Latest updates from your campus
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-[#1E40AF] hover:text-[#1E3A8A] font-semibold">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <ActivityItem 
                  key={index} 
                  {...activity} 
                  onClick={() => handleActivityClick(activity.title)}
                />
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                💡 Hostel grievances increased 12% this week
              </p>
            </div>
          </CardContent>
        </Card>

        {role === "student" && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                <Star className="h-5 w-5 text-yellow-500" strokeWidth={2.5} />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Summer Internship Applications
                    </span>
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">3 days</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Hostel Grievance Response
                    </span>
                    <Badge variant="destructive" className="font-semibold">1 day</Badge>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;