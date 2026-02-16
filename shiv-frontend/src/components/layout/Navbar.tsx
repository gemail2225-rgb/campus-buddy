import { Bell, Moon, Sun, Laptop } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { notifications } from "@/data/mockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { role } = useRole(); // Keep only role for display, remove setRole
  const { theme, setTheme } = useTheme();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Campus Buddy
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Badge - Display only, no dropdown */}
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize hidden md:block">
          {role}
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative rounded-md p-2 hover:bg-accent transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b px-4 py-3 font-semibold">Notifications</div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className={`border-b px-4 py-3 text-sm last:border-0 transition-colors ${!n.read ? "bg-accent/50" : ""}`}>
                    <p>{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.timestamp}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-md">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : theme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Laptop className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
              <Sun className="h-4 w-4" />
              <span>Light</span>
              {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
              <Moon className="h-4 w-4" />
              <span>Dark</span>
              {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
              <Laptop className="h-4 w-4" />
              <span>System</span>
              {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile role indicator */}
        <div className="md:hidden px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
          {role}
        </div>
      </div>
    </header>
  );
};

export default Navbar;