import { LayoutDashboard, MessageSquareWarning, Briefcase, Search, GraduationCap, BarChart3, LogOut, Shield, Calendar, BookOpen, Users, Megaphone, Bus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useRole } from "@/contexts/RoleContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { role } = useRole();
  const navigate = useNavigate();

  const items = [
    { 
      title: "Dashboard", 
      url: "/dashboard", 
      icon: LayoutDashboard, 
      roles: ["student", "professor", "club", "admin"] 
    },
    { 
      title: "Academics", 
      url: "/dashboard/academics", 
      icon: GraduationCap, 
      roles: ["student", "professor"]
    },
    { 
      title: "Events", 
      url: "/dashboard/events", 
      icon: Calendar, 
      roles: ["club", "student", "admin"]
    },
    { 
      title: "Announcements", 
      url: "/dashboard/announcements", 
      icon: Megaphone, 
      roles: ["club", "admin", "student"]
    },
    { 
      title: "Grievances", 
      url: "/dashboard/grievances", 
      icon: MessageSquareWarning, 
      roles: ["student", "admin"] 
    },
    { 
      title: "Internships", 
      url: "/dashboard/internships", 
      icon: Briefcase, 
      roles: ["student", "admin"] 
    },
    { 
      title: "Lost & Found", 
      url: "/dashboard/lost-found", 
      icon: Search, 
      roles: ["student", "admin"] 
    },
    { 
      title: "Bus Buddy", 
      url: "/dashboard/bus-buddy", 
      icon: Bus, 
      roles: ["student"]
    },
    { 
      title: "Research", 
      url: "/dashboard/research", 
      icon: BookOpen, 
      roles: ["professor", "student"]
    },
    { 
      title: "Analytics", 
      url: "/dashboard/analytics", 
      icon: BarChart3, 
      roles: ["admin"]
    },
    { 
      title: "Users", 
      url: "/dashboard/users", 
      icon: Users, 
      roles: ["admin"]
    },
  ];

  const visibleItems = items.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Using YOUR tailwind config colors
  const roleColors = {
    student: "from-brand-primary-500 to-brand-primary-600",     // Teal
    professor: "from-brand-accent-500 to-brand-accent-600",     // Indigo
    club: "from-brand-secondary-500 to-brand-secondary-600",    // Coral
    admin: "from-red-600 to-red-700",                           // Red
  };

  const roleBadgeColors = {
    student: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    professor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    club: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    admin: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  const roleDescriptions = {
    student: "Student Portal",
    professor: "Professor Dashboard",
    club: "Club Organizer",
    admin: "Full Platform Control",
  };

  return (
    <Sidebar className="border-r border-border bg-white dark:bg-gray-950">
      {/* Header with Logo */}
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Logo - Teal gradient */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary-500 to-brand-primary-700 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Campus Buddy
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              Unified Campus Platform
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        {/* User Role Display */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Current Session
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4 py-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div 
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${roleColors[role as keyof typeof roleColors] || roleColors.student} flex items-center justify-center text-white font-bold text-base shadow-sm`}
              >
                {role?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {role || 'Student'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                  <p className="text-xs font-medium text-brand-success">Active Now</p>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard"} 
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all duration-200 group"
                      activeClassName="bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white shadow-md hover:from-brand-primary-600 hover:to-brand-primary-700 dark:from-brand-primary-500 dark:to-brand-primary-600"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="flex-1">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role Badge */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-4">
            <div className={`p-3 rounded-lg ${roleBadgeColors[role as keyof typeof roleBadgeColors] || roleBadgeColors.student} border border-current/10`}>
              <p className="text-xs font-semibold uppercase tracking-wide">
                {role || 'Student'} Access
              </p>
              <p className="text-xs opacity-75 mt-0.5">
                {roleDescriptions[role as keyof typeof roleDescriptions] || 'Student Portal'}
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200 group"
        >
          <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;