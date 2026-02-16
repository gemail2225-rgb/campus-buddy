import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Users,
  Megaphone,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Music,
  Code,
  Trophy,
  Star,
  Bell,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Upload,
  Link2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import components
import { StatCard } from "@/components/StatCard";
import { EventCard } from "@/components/EventCard";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { UserAvatar, UserInfo } from "@/components/UserAvatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

// Import API functions
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  addComment,
  type Event,
  type Announcement
} from "@/api/clubApi";

// Mock data for club dashboard (will be replaced by API data)
const clubStats = {
  members: 45,
  eventsOrganized: 12,
  upcomingEvents: 3,
  announcements: 8,
  avgAttendance: 78
};

// Keep mock data for members and registrations until backend endpoints are ready
const clubMembers = [
  { id: 1, name: "Arjun Singh", role: "club", position: "Coordinator", avatar: "AS", email: "arjun@campus.edu", status: "online" as const, isVerified: true },
  { id: 2, name: "Priya Patel", role: "club", position: "Co-Coordinator", avatar: "PP", email: "priya@campus.edu", status: "online" as const },
  { id: 3, name: "Rahul Sharma", role: "club", position: "Technical Lead", avatar: "RS", email: "rahul@campus.edu", status: "away" as const },
  { id: 4, name: "Neha Gupta", role: "club", position: "Design Lead", avatar: "NG", email: "neha@campus.edu", status: "offline" as const },
  { id: 5, name: "Vikram Mehta", role: "club", position: "PR Head", avatar: "VM", email: "vikram@campus.edu", status: "online" as const },
];

const eventRegistrations = [
  { id: 1, name: "Rahul Sharma", rollNo: "CS21001", event: "Hackathon 2026", registeredOn: "2026-03-01", status: "Confirmed" },
  { id: 2, name: "Priya Patel", rollNo: "CS21002", event: "Hackathon 2026", registeredOn: "2026-03-02", status: "Confirmed" },
  { id: 3, name: "Amit Kumar", rollNo: "CS21003", event: "Robotics Workshop", registeredOn: "2026-03-03", status: "Pending" },
  { id: 4, name: "Neha Gupta", rollNo: "CS21004", event: "Cultural Night", registeredOn: "2026-03-04", status: "Confirmed" },
  { id: 5, name: "Arjun Singh", rollNo: "CS21005", event: "Hackathon 2026", registeredOn: "2026-03-01", status: "Confirmed" },
];

const ClubDashboard = () => {
  const { role } = useRole();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<number | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showEditEventDialog, setShowEditEventDialog] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    id: "",
    title: "",
    type: "Technical",
    date: "",
    time: "",
    venue: "",
    description: "",
    maxParticipants: "100",
    deadline: ""
  });

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    id: "",
    title: "",
    content: "",
    type: "General",
    priority: "Medium",
    pinned: false
  });

  // State for data from API
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [eventsData, announcementsData] = await Promise.all([
          fetchEvents(),
          fetchAnnouncements()
        ]);
        setEvents(eventsData);
        setAnnouncements(announcementsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [toast]);

  // Redirect if not club
  if (role !== "club") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-[#f59e0b] mb-4" />
            <h2 className="text-2xl font-bold mb-2">Club Dashboard</h2>
            <p className="text-muted-foreground">
              This dashboard is only available for club organizers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateEvent = async () => {
    try {
      setError(null);
      if (!eventForm.title.trim()) {
        setError("Event title is required");
        return;
      }
      if (!eventForm.date) {
        setError("Event date is required");
        return;
      }
      if (!eventForm.venue.trim()) {
        setError("Venue is required");
        return;
      }

      setIsLoading(true);
      const newEvent = await createEvent({
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.venue,
        max: parseInt(eventForm.maxParticipants) || 100,
        registerBy: eventForm.deadline,
        type: eventForm.type,
      });
      
      setEvents(prev => [newEvent, ...prev]);
      setShowEventDialog(false);
      setEventForm({ id: "", title: "", type: "Technical", date: "", time: "", venue: "", description: "", maxParticipants: "100", deadline: "" });
      
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  interface EventFormData {
    id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    venue: string;
    description: string;
    maxParticipants: string;
    deadline: string;
  }

  const handleEditEvent = (event: Event) => {
    setEventForm({
      id: event._id,
      title: event.title,
      type: event.type,
      date: event.date.slice(0, 10),
      time: event.time || "",
      venue: event.location,
      description: event.description || "",
      maxParticipants: event.max?.toString() || "100",
      deadline: event.registerBy?.slice(0, 10) || ""
    });
    setShowEditEventDialog(true);
  };

  const handleUpdateEvent = async () => {
    try {
      setError(null);
      if (!eventForm.title.trim()) {
        setError("Event title is required");
        return;
      }
      if (!eventForm.date) {
        setError("Event date is required");
        return;
      }
      if (!eventForm.venue.trim()) {
        setError("Venue is required");
        return;
      }

      setIsLoading(true);
      const updatedEvent = await updateEvent(eventForm.id, {
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.venue,
        max: parseInt(eventForm.maxParticipants) || 100,
        registerBy: eventForm.deadline,
        type: eventForm.type,
      });
      
      setEvents(prev => prev.map(e => e._id === updatedEvent._id ? updatedEvent : e));
      setShowEditEventDialog(false);
      setEventForm({ id: "", title: "", type: "Technical", date: "", time: "", venue: "", description: "", maxParticipants: "100", deadline: "" });
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      setIsLoading(true);
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      setError(null);
      if (!announcementForm.title.trim()) {
        setError("Announcement title is required");
        return;
      }
      if (!announcementForm.content.trim()) {
        setError("Announcement content is required");
        return;
      }

      setIsLoading(true);
      const newAnnouncement = await createAnnouncement({
        title: announcementForm.title,
        content: announcementForm.content,
        pinned: announcementForm.pinned,
        priority: announcementForm.priority as 'Low' | 'Medium' | 'High',
      });
      
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setShowAnnouncementDialog(false);
      setAnnouncementForm({ id: "", title: "", content: "", type: "General", priority: "Medium", pinned: false });
      
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create announcement");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create announcement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  interface AnnouncementFormData {
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    pinned: boolean;
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementForm({
      id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      type: "General", // or map from backend if available
      priority: announcement.priority,
      pinned: announcement.pinned
    });
    setShowAnnouncementDialog(true);
  };

  const handleUpdateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) return;

    try {
      setIsLoading(true);
      const updated = await updateAnnouncement(announcementForm.id, {
        title: announcementForm.title,
        content: announcementForm.content,
        pinned: announcementForm.pinned,
        priority: announcementForm.priority as 'Low' | 'Medium' | 'High',
      });
      
      setAnnouncements(prev => prev.map(a => a._id === updated._id ? updated : a));
      setShowAnnouncementDialog(false);
      setAnnouncementForm({ id: "", title: "", content: "", type: "General", priority: "Medium", pinned: false });
      
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update announcement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      setIsLoading(true);
      await deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete announcement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinAnnouncement = (id: string) => {
    // Not implemented in backend yet
  };

  const handleViewRegistrations = (eventId: string) => {
    setSelectedEvent(eventId as any); // need to keep mock for now
    setShowRegistrationsModal(true);
  };

  const handleViewMembers = () => {
    setShowMembersModal(true);
  };

  const handleAddMember = () => {
    // TODO: Implement add member functionality
  };

  const handleRemoveMember = (id: number) => {
    if (confirm("Are you sure you want to remove this member?")) {
      // keep mock for now
    }
  };

  const handleUpdateMemberRole = (id: number) => {
    // TODO: Implement update member role functionality
  };

  // Compute stats from real data
  const computedStats = {
    members: clubStats.members, // still mock
    eventsOrganized: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
    announcements: announcements.length,
    avgAttendance: clubStats.avgAttendance, // mock
  };

  if (isLoading && events.length === 0 && announcements.length === 0) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programming Club Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, Arjun Singh
          </p>
        </div>
        <Button 
          className="bg-brand-primary hover:bg-brand-primary/85 text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all"
          onClick={() => {
            setEventForm({ 
              id: "", 
              title: "", 
              type: "Technical", 
              date: "", 
              time: "", 
              venue: "", 
              description: "", 
              maxParticipants: "100", 
              deadline: "" 
            });
            setShowEventDialog(true);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Club Banner */}
      <Card className="bg-gradient-to-r from-brand-primary to-brand-primary/70 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Programming Club</h2>
              <p className="opacity-90">Est. 2020 • {computedStats.members} Active Members • {computedStats.eventsOrganized} Events Organized</p>
            </div>
            <Button variant="secondary" className="bg-white text-brand-primary hover:bg-gray-100">
              <Edit className="h-4 w-4 mr-2" />
              Edit Club
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Members"
          value={computedStats.members}
          color="emerald"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 5, direction: "up", label: "this month" }}
        />
        <StatCard
          title="Events"
          value={computedStats.eventsOrganized}
          color="blue"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          title="Upcoming"
          value={computedStats.upcomingEvents}
          color="green"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Announcements"
          value={computedStats.announcements}
          color="orange"
          icon={<Megaphone className="h-5 w-5" />}
        />
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#f59e0b]" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.filter(e => new Date(e.date) > new Date()).slice(0, 2).map((event) => (
                    <div key={event._id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className={cn(
                        "p-2 rounded-lg",
                        event.type === "Technical" ? "bg-blue-100 dark:bg-blue-900/20" :
                        event.type === "Cultural" ? "bg-amber-100 dark:bg-amber-900/20" :
                        "bg-emerald-100 dark:bg-emerald-900/20"
                      )}>
                        <span className="text-xl">{event.type === "Technical" ? "💻" : event.type === "Cultural" ? "🎭" : "🔧"}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{event.registeredCount}/{event.max}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="w-full text-brand-primary hover:text-brand-primary/80" onClick={() => setActiveTab("events")}>
                    View All Events →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-brand-primary" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.slice(0, 2).map((announcement) => (
                    <div key={announcement._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{announcement.title}</h4>
                          {announcement.pinned && <Star className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="w-full text-brand-primary hover:text-brand-primary/80" onClick={() => setActiveTab("announcements")}>
                    View All Announcements →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Members Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-accent" />
                  Core Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clubMembers.slice(0, 3).map((member) => (
                    <UserInfo
                      key={member.id}
                      user={member}
                      showEmail={false}
                    />
                  ))}
                  <Button variant="link" className="w-full text-brand-primary hover:text-brand-primary/80" onClick={handleViewMembers}>
                    Manage Team →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#f59e0b]" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-[#f59e0b]">156</p>
                    <p className="text-xs text-muted-foreground">Event Registrations</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-[#1E40AF]">89%</p>
                    <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-[#059669]">12</p>
                    <p className="text-xs text-muted-foreground">Workshops Done</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">₹50k</p>
                    <p className="text-xs text-muted-foreground">Prize Money</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-brand-primary/10 to-transparent rounded-lg border-2 border-brand-primary/20">
            <div>
              <h2 className="text-2xl font-bold">All Events</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage your club's events</p>
            </div>
            <Button 
              className="bg-brand-primary hover:bg-brand-primary/85 text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                setEventForm({ 
                  id: "", 
                  title: "", 
                  type: "Technical", 
                  date: "", 
                  time: "", 
                  venue: "", 
                  description: "", 
                  maxParticipants: "100", 
                  deadline: "" 
                });
                setShowEventDialog(true);
              }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event._id} className="border-l-4 border-l-brand-primary hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge variant="outline" className="bg-brand-primary/10 text-brand-primary">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="font-medium">{event.time}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Venue</p>
                          <p className="font-medium">{event.location}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-medium">{new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">Registrations</span>
                          <span className="text-xs font-bold">{event.registeredCount}/{event.max}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-primary transition-all"
                            style={{ width: `${(event.registeredCount / event.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewRegistrations(event._id)}
                      >
                        View Registrations
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Announcements</h2>
            <Button 
              className="bg-brand-primary hover:bg-brand-primary/85 text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                setAnnouncementForm({ id: "", title: "", content: "", type: "General", priority: "Medium", pinned: false });
                setShowAnnouncementDialog(true);
              }}
            >
              <Plus className="h-5 w-5 mr-2" />
              New Announcement
            </Button>
          </div>

          <div className="grid gap-4">
            {announcements.map((ann) => (
              <Card key={ann._id} className={ann.pinned ? "border-l-4 border-l-yellow-500" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{ann.title}</h3>
                        {ann.pinned && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        <Badge variant="outline" className="ml-auto text-xs">
                          {ann.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{ann.content}</p>
                      <p className="text-xs text-muted-foreground">Posted on {new Date(ann.createdAt).toLocaleDateString()} by {ann.club?.name || 'Club'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAnnouncement(ann)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(ann._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Club Members</h2>
            <Button 
              variant="outline"
              onClick={handleAddMember}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clubMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <UserInfo user={member} showEmail={true} />
                      </TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === "online" ? "default" : "secondary"} 
                               className={member.status === "online" ? "bg-green-500" : ""}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>Jan 2026</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateMemberRole(member.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Add a new event for your club</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title *</Label>
              <Input 
                id="event-title"
                placeholder="e.g., Hackathon 2026"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select value={eventForm.type} onValueChange={(v) => setEventForm({...eventForm, type: v})}>
                  <SelectTrigger id="event-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-venue">Venue *</Label>
                <Input 
                  id="event-venue"
                  placeholder="e.g., CS Auditorium"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea 
                id="event-description"
                placeholder="Event description..."
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date *</Label>
                <Input 
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <Input 
                  id="event-time"
                  placeholder="e.g., 10:00 AM - 6:00 PM"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-participants">Max Participants</Label>
                <Input 
                  id="max-participants"
                  type="number"
                  placeholder="100"
                  value={eventForm.maxParticipants}
                  onChange={(e) => setEventForm({...eventForm, maxParticipants: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration-deadline">Registration Deadline</Label>
                <Input 
                  id="registration-deadline"
                  type="date"
                  value={eventForm.deadline}
                  onChange={(e) => setEventForm({...eventForm, deadline: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} className="bg-brand-primary hover:bg-brand-primary/85 text-white font-bold">Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditEventDialog} onOpenChange={setShowEditEventDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-event-title">Event Title *</Label>
              <Input 
                id="edit-event-title"
                placeholder="e.g., Hackathon 2026"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-type">Event Type</Label>
                <Select value={eventForm.type} onValueChange={(v) => setEventForm({...eventForm, type: v})}>
                  <SelectTrigger id="edit-event-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-venue">Venue *</Label>
                <Input 
                  id="edit-event-venue"
                  placeholder="e.g., CS Auditorium"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-event-description">Description</Label>
              <Textarea 
                id="edit-event-description"
                placeholder="Event description..."
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-date">Date *</Label>
                <Input 
                  id="edit-event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-time">Time</Label>
                <Input 
                  id="edit-event-time"
                  placeholder="e.g., 10:00 AM - 6:00 PM"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditEventDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateEvent} className="bg-brand-primary hover:bg-brand-primary/85 text-white font-bold">Update Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>Post a new announcement for members</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input 
                id="announcement-title"
                placeholder="e.g., Meeting Tomorrow"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcement-content">Content</Label>
              <Textarea 
                id="announcement-content"
                placeholder="Announcement details..."
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="announcement-type">Type</Label>
                <Select value={announcementForm.type} onValueChange={(v) => setAnnouncementForm({...announcementForm, type: v})}>
                  <SelectTrigger id="announcement-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Important">Important</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcement-priority">Priority</Label>
                <Select value={announcementForm.priority} onValueChange={(v) => setAnnouncementForm({...announcementForm, priority: v})}>
                  <SelectTrigger id="announcement-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="pinned"
                checked={announcementForm.pinned}
                onChange={(e) => setAnnouncementForm({...announcementForm, pinned: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="pinned">Pin this announcement</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateAnnouncement} className="bg-brand-primary hover:bg-brand-primary/90">Post Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Registrations Modal */}
      <Dialog open={showRegistrationsModal} onOpenChange={setShowRegistrationsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Event Registrations</DialogTitle>
            <DialogDescription>
              {events.find(e => e._id === selectedEvent)?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Registered On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell>{reg.name}</TableCell>
                    <TableCell>{reg.rollNo}</TableCell>
                    <TableCell>{reg.registeredOn}</TableCell>
                    <TableCell>
                      <Badge variant={reg.status === "Confirmed" ? "default" : "secondary"}
                             className={reg.status === "Confirmed" ? "bg-green-500" : ""}>
                        {reg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Members Modal */}
      <Dialog open={showMembersModal} onOpenChange={setShowMembersModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Club Members</DialogTitle>
            <DialogDescription>Manage all club members</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <UserInfo user={member} showEmail={false} />
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === "online" ? "default" : "secondary"} 
                             className={member.status === "online" ? "bg-green-500" : ""}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Remove</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClubDashboard;