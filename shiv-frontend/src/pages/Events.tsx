import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  X,
  Eye,
  UserCheck,
  Shield,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Import components
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { StatCard } from "@/components/StatCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// API imports
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type Event,
} from "@/api/clubApi"; // clubApi already has Event type and fetch for all roles

// Mock registrations data (will be replaced when backend supports registrations)
const mockRegistrations = [
  { id: 1, eventId: "1", name: "Rahul Sharma", rollNo: "CS21001", email: "rahul@campus.edu", registeredOn: "2026-03-01", status: "Confirmed" },
  { id: 2, eventId: "1", name: "Priya Patel", rollNo: "CS21002", email: "priya@campus.edu", registeredOn: "2026-03-02", status: "Confirmed" },
  { id: 3, eventId: "1", name: "Amit Kumar", rollNo: "CS21003", email: "amit@campus.edu", registeredOn: "2026-03-03", status: "Pending" },
  { id: 4, eventId: "2", name: "Neha Gupta", rollNo: "CS21004", email: "neha@campus.edu", registeredOn: "2026-03-04", status: "Confirmed" },
  { id: 5, eventId: "1", name: "Arjun Singh", rollNo: "CS21005", email: "arjun@campus.edu", registeredOn: "2026-03-01", status: "Confirmed" },
];

const Events = () => {
  const { role } = useRole();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [registeredIds, setRegisteredIds] = useState<string[]>([]); // mock student registrations
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showRegistrationsDialog, setShowRegistrationsDialog] = useState(false);
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<string | null>(null);
  
  // State for events from API
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load registered events from localStorage on mount
  useEffect(() => {
    const savedRegistrations = localStorage.getItem("eventRegistrations");
    if (savedRegistrations) {
      try {
        setRegisteredIds(JSON.parse(savedRegistrations));
      } catch (err) {
        console.error("Failed to load registrations from localStorage", err);
      }
    }
  }, []);

  // Save registered events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("eventRegistrations", JSON.stringify(registeredIds));
  }, [registeredIds]);

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

  // Fetch events on mount and when role changes
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userCredentials = user ? { id: user.id, role: user.role } : undefined;
        const data = await fetchEvents(userCredentials);
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [user, toast]);

  // Filter events based on search
  useEffect(() => {
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  // Mock registration handlers (will be replaced with real API)
  const handleRegister = async (id: string) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to register",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.msg || "Failed to register",
          variant: "destructive",
        });
        return;
      }

      setRegisteredIds([...registeredIds, id]);
      toast({
        title: "Success",
        description: "Registered for event successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async (id: string) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to unregister",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${id}/unregister`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.msg || "Failed to unregister",
          variant: "destructive",
        });
        return;
      }

      setRegisteredIds(registeredIds.filter(rid => rid !== id));
      toast({
        title: "Unregistered",
        description: "You have been unregistered from the event",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to unregister from event",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  interface FilterOptions {
    categories?: string[];
    statuses?: string[];
    venue?: string;
    dateRange?: { from: string; to: string };
  }

  const handleFilterApply = (filters: FilterOptions) => {
    // Implement filter logic if needed
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.venue) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const userCredentials = user ? { id: user.id, role: user.role } : undefined;
      const newEvent = await createEvent({
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.venue,
        max: parseInt(eventForm.maxParticipants) || 100,
        registerBy: eventForm.deadline,
        type: eventForm.type,
      }, userCredentials);
      setEvents(prev => [newEvent, ...prev]);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      setShowEventDialog(false);
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
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setShowEventDialog(true); // reuse same dialog but in edit mode
  };

  const handleUpdateEvent = async () => {
    if (!eventForm.id) return;
    try {
      setIsLoading(true);
      const userCredentials = user ? { id: user.id, role: user.role } : undefined;
      const updated = await updateEvent(eventForm.id, {
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.venue,
        max: parseInt(eventForm.maxParticipants) || 100,
        registerBy: eventForm.deadline,
        type: eventForm.type,
      }, userCredentials);
      setEvents(prev => prev.map(e => e._id === updated._id ? updated : e));
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      setShowEventDialog(false);
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
    } catch (err) {
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
      const userCredentials = user ? { id: user.id, role: user.role } : undefined;
      await deleteEvent(id, userCredentials);
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

  const handleViewRegistrations = (eventId: string) => {
    setSelectedEventForRegistrations(eventId);
    setShowRegistrationsDialog(true);
  };

  const handleApproveEvent = (eventId: string) => {
    // Mock admin approval
    toast({
      title: "Approved",
      description: `Event ${eventId} approved (mock)`,
    });
  };

  const handleRejectEvent = (eventId: string) => {
    if (confirm("Are you sure you want to reject this event?")) {
      toast({
        title: "Rejected",
        description: `Event ${eventId} rejected (mock)`,
      });
    }
  };

  const registeredEvents = events.filter(e => registeredIds.includes(e._id));

  // Get page title and description based on role
  const getPageInfo = () => {
    switch (role) {
      case "student":
        return {
          title: "Events",
          description: "Discover and register for campus events"
        };
      case "professor":
        return {
          title: "Campus Events",
          description: "View and monitor campus events"
        };
      case "club":
        return {
          title: "Events",
          description: "Manage your club events"
        };
      case "admin":
        return {
          title: "Events Management",
          description: "Oversee and manage all campus events"
        };
      default:
        return {
          title: "Events",
          description: "Campus events"
        };
    }
  };

  const pageInfo = getPageInfo();

  // Render event card based on role
  const renderEventCard = (event: Event) => {
    const isRegistered = registeredIds.includes(event._id);

    return (
      <Card key={event._id} className="border-l-4 border-l-brand-primary hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-primary/10">
                  <span className="text-2xl">
                    {event.type === "Technical" ? "💻" : event.type === "Cultural" ? "🎭" : "🔧"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-blue-600 mt-1">{event.club?.name || "Club"}</p>
                </div>
              </div>
              <Badge className="bg-blue-500">{event.type}</Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">{event.description}</p>

            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event.registeredCount}/{event.max} registered</span>
              </div>
              {event.registerBy && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Register by: {new Date(event.registerBy).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-primary transition-all"
                  style={{ width: `${(event.registeredCount / (event.max || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons Based on Role */}
            <div className="pt-3 border-t flex gap-2">
              {role === "student" && (
                <>
                  {isRegistered ? (
                    <Button 
                      variant="outline" 
                      className="flex-1 border-green-500 text-green-600"
                      disabled
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Registered
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 bg-brand-primary hover:bg-brand-primary/85 text-white"
                      onClick={() => handleRegister(event._id)}
                    >
                      Register
                    </Button>
                  )}
                </>
              )}

              {role === "professor" && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewRegistrations(event._id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              )}

              {role === "club" && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewRegistrations(event._id)}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Registrations ({event.registeredCount})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}

              {role === "admin" && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewRegistrations(event._id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View ({event.registeredCount})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleApproveEvent(event._id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>

            {/* Organizer Info */}
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Organized by {event.club?.name || "Club"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading && events.length === 0) {
    return <div className="p-6 text-center">Loading events...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageInfo.title}</h1>
          <p className="text-muted-foreground mt-2">{pageInfo.description}</p>
        </div>
        
        {role === "club" && (
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
        )}
      </div>

      {/* Admin Stats - Only for Admin */}
      {role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Events</div>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Registrations</div>
              <div className="text-2xl font-bold">{events.reduce((sum, e) => sum + e.registeredCount, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Pending Approval</div>
              <div className="text-2xl font-bold text-orange-600">2</div> {/* Mock */}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">This Month</div>
              <div className="text-2xl font-bold">
                {events.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          placeholder="Search events..."
          onSearch={handleSearch}
          onFilter={handleFilterApply}
          filters={{
            categories: ["Technical", "Cultural", "Workshop", "Seminar"],
            statuses: ["Upcoming", "Ongoing", "Completed"],
          }}
        />
      </div>

      {/* Tabs - Different for each role */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">
            {role === "admin" ? "All Events" : "Upcoming Events"}
          </TabsTrigger>
          <TabsTrigger value="registered">
            {role === "student" ? "My Registrations" : 
             role === "club" ? "My Events" : 
             role === "admin" ? "Pending Approval" : "History"}
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEvents.map((event) => renderEventCard(event))}
            </div>
          )}
        </TabsContent>

        {/* Registered/My Events Tab */}
        <TabsContent value="registered">
          {role === "student" && registeredIds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Registered Events</h3>
                <p className="text-muted-foreground">
                  Browse upcoming events and register to see them here
                </p>
              </CardContent>
            </Card>
          ) : role === "student" ? (
            <div className="grid gap-6 md:grid-cols-2">
              {registeredEvents.map((event) => (
                <Card key={event._id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{event.club?.name}</p>
                        </div>
                        <Badge className="bg-green-500">Registered</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleUnregister(event._id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Unregister
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : role === "admin" ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Events Pending Approval</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">AI/ML Workshop</h4>
                        <p className="text-sm text-muted-foreground">Submitted by Data Science Club</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : role === "club" ? (
            // For club, show only their events
            <div className="grid gap-6 md:grid-cols-2">
              {events.filter(e => e.club?._id === "current-club-id") // filter would need actual club ID
                .map((event) => renderEventCard(event))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEvents.map((event) => renderEventCard(event))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{eventForm.id ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              {eventForm.id ? "Update event details" : "Add a new event for your club"}
            </DialogDescription>
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
            <Button 
              onClick={eventForm.id ? handleUpdateEvent : handleCreateEvent} 
              className="bg-brand-primary hover:bg-brand-primary/85 text-white font-bold"
              disabled={!eventForm.title || !eventForm.date || !eventForm.venue || isLoading}
            >
              {isLoading ? "Saving..." : eventForm.id ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Registrations Dialog */}
      <Dialog open={showRegistrationsDialog} onOpenChange={setShowRegistrationsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Registrations</DialogTitle>
            <DialogDescription>
              {selectedEventForRegistrations && events.find(e => e._id === selectedEventForRegistrations)?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Total Registrations</p>
                <p className="text-2xl font-bold">
                  {mockRegistrations.filter(r => r.eventId === selectedEventForRegistrations).length}
                </p>
              </div>
              <Button variant="outline">
                Export CSV
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRegistrations
                  .filter(r => r.eventId === selectedEventForRegistrations)
                  .map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>{reg.rollNo}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.registeredOn}</TableCell>
                      <TableCell>
                        <Badge variant={reg.status === "Confirmed" ? "default" : "secondary"}
                               className={reg.status === "Confirmed" ? "bg-green-500" : ""}>
                          {reg.status}
                        </Badge>
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

export default Events;