import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

const AppLayout = () => {
  const { theme } = useTheme();
  
  // Apply theme class to html element for shadcn/ui
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;