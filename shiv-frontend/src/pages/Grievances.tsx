import { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { initialGrievances } from "@/data/mockData";
import { Grievance, GrievanceCategory, GrievanceStatus, GrievancePriority } from "@/types/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquareWarning, 
  Plus, 
  Filter, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  Send,
  Flame,
  AlertTriangle,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import new components
import { SearchBar } from "@/components/SearchBar";
import { StatCard } from "@/components/StatCard";
import { UserAvatar } from "@/components/UserAvatar";

// Extended interface
interface ExtendedGrievance extends Grievance {
  priority: GrievancePriority;
}

const PriorityBadge = ({ priority }: { priority: GrievancePriority }) => {
  const styles = {
    High: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900",
    Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
    Low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
  };

  const icons = {
    High: Flame,
    Medium: AlertTriangle,
    Low: Circle
  };

  const Icon = icons[priority];

  return (
    <Badge variant="outline" className={cn("font-semibold text-xs border", styles[priority])}>
      <Icon className="h-3 w-3 mr-1" />
      {priority}
    </Badge>
  );
};

const CategoryIcon = ({ category }: { category: GrievanceCategory }) => {
  const colors = {
    Hostel: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/30",
    Academics: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/30",
    Mess: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950/30",
    Infrastructure: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/30",
    Club: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/30"
  };

  return (
    <div className={cn("px-2.5 py-1 rounded-md text-xs font-semibold", colors[category])}>
      {category}
    </div>
  );
};

const Grievances = () => {
  const { role } = useRole();
  const [grievances, setGrievances] = useState<ExtendedGrievance[]>(
    initialGrievances.map((g, i) => ({
      ...g,
      priority: (i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low") as GrievancePriority,
      category: g.category as GrievanceCategory
    }))
  );
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GrievanceCategory>("Hostel");
  const [priority, setPriority] = useState<GrievancePriority>("Medium");
  const [selectedGrievance, setSelectedGrievance] = useState<ExtendedGrievance | null>(null);
  const [comment, setComment] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | GrievanceStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newGrievance: ExtendedGrievance = {
      id: `g${Date.now()}`,
      title,
      description,
      category,
      priority,
      status: "Pending",
      lastUpdated: new Date().toISOString().split("T")[0],
      createdBy: "current-user",
      updates: [
        { 
          id: `u${Date.now()}`, 
          text: "Grievance submitted and awaiting review", 
          timestamp: new Date().toLocaleString(), 
          by: "Student" 
        }
      ],
    };
    setGrievances((prev) => [newGrievance, ...prev]);
    setTitle("");
    setDescription("");
    setCategory("Hostel");
    setPriority("Medium");
    setOpen(false);
  };

  const handleStatusChange = (id: string, status: GrievanceStatus) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status,
              lastUpdated: new Date().toISOString().split("T")[0],
              updates: [
                ...g.updates, 
                { 
                  id: `u${Date.now()}`, 
                  text: `Status updated to ${status}${status === "Resolved" ? " - Issue has been addressed" : ""}`, 
                  timestamp: new Date().toLocaleString(), 
                  by: role === "professor" ? "Professor" : role === "club" ? "Club" : "Authority"
                }
              ],
            }
          : g
      )
    );
    if (selectedGrievance?.id === id) {
      setSelectedGrievance((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleAddComment = (id: string) => {
    if (!comment.trim()) return;
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              lastUpdated: new Date().toISOString().split("T")[0],
              updates: [
                ...g.updates, 
                { 
                  id: `u${Date.now()}`, 
                  text: comment, 
                  timestamp: new Date().toLocaleString(), 
                  by: role === "professor" ? "Professor" : role === "club" ? "Club" : role === "admin" ? "Admin" : "Authority"
                }
              ],
            }
          : g
      )
    );
    setComment("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredGrievances = grievances
    .filter(g => filterStatus === "All" ? true : g.status === filterStatus)
    .filter(g => 
      searchQuery === "" ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === "Pending").length,
    inReview: grievances.filter(g => g.status === "In Review" || g.status === "In Progress").length,
    resolved: grievances.filter(g => g.status === "Resolved").length,
  };

  // Check if user can manage grievances (professor, club, admin, authority)
  const canManage = role === "professor" || role === "club" || role === "admin" || role === "student";

  return (
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1E40AF] to-blue-500">
              <MessageSquareWarning className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Grievances
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {role === "student" 
              ? "Submit and track your campus grievances" 
              : role === "professor"
              ? "Review and respond to academic grievances"
              : role === "club"
              ? "Manage club-related grievances"
              : "Manage and resolve campus grievances"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {role === "student" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Grievance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Submit New Grievance</DialogTitle>
                  <DialogDescription className="text-sm font-medium">
                    Describe your issue and we'll work to resolve it quickly
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Title
                    </label>
                    <Input 
                      placeholder="e.g., Mess food quality issue – Block C" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Description
                    </label>
                    <Textarea 
                      placeholder="Provide details about the issue..." 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[100px] font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white">
                        Category
                      </label>
                      <Select value={category} onValueChange={(v) => setCategory(v as GrievanceCategory)}>
                        <SelectTrigger className="font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hostel">Hostel</SelectItem>
                          <SelectItem value="Academics">Academics</SelectItem>
                          <SelectItem value="Mess">Mess</SelectItem>
                          <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="Club">Club</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white">
                        Priority
                      </label>
                      <Select value={priority} onValueChange={(v) => setPriority(v as GrievancePriority)}>
                        <SelectTrigger className="font-medium">
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
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-[#1E40AF] hover:bg-[#1E3A8A] font-semibold"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Grievance
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards - Using StatCard */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total"
          value={stats.total}
          color="default"
          icon={<MessageSquareWarning className="h-5 w-5" />}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="orange"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="In Review"
          value={stats.inReview}
          color="blue"
          icon={<AlertCircle className="h-5 w-5" />}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          color="green"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search grievances by title, description, or category..."
        onSearch={handleSearch}
        showFilters={true}
        filters={{
          categories: ["Hostel", "Academics", "Mess", "Infrastructure", "Club"],
          statuses: ["Pending", "In Review", "Resolved"],
        }}
      />

      {/* Filter Section */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
              All Grievances
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <SelectTrigger className="w-[140px] h-9 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={canManage && selectedGrievance ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card className="border-gray-200 dark:border-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-gray-900 dark:text-white">Title</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-white">Category</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-white">Priority</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-white">Updated</TableHead>
                  {canManage && <TableHead className="font-bold text-gray-900 dark:text-white">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrievances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canManage ? 6 : 5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-12 w-12 text-[#059669] mb-2" />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">You're all clear! 🎉</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          No {filterStatus === "All" ? "" : filterStatus.toLowerCase()} grievances at the moment.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGrievances.map((g) => (
                    <TableRow 
                      key={g.id} 
                      className={cn(
                        "cursor-pointer transition-colors",
                        canManage && selectedGrievance?.id === g.id && "bg-blue-50 dark:bg-blue-950/20"
                      )}
                      onClick={() => canManage && setSelectedGrievance(g)}
                    >
                      <TableCell className="font-semibold text-gray-900 dark:text-white">
                        {g.title}
                      </TableCell>
                      <TableCell>
                        <CategoryIcon category={g.category} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={g.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={g.status} />
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {g.lastUpdated}
                      </TableCell>
                      {canManage && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select 
                            value={g.status} 
                            onValueChange={(v) => handleStatusChange(g.id, v as GrievanceStatus)}
                          >
                            <SelectTrigger className="w-[130px] h-9 font-medium">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Review">In Review</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {canManage && selectedGrievance && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <div className="space-y-3">
                <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
                  {selectedGrievance.title}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryIcon category={selectedGrievance.category} />
                  <PriorityBadge priority={selectedGrievance.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {selectedGrievance.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Timeline
                </h4>
                <div className="space-y-3 border-l-2 border-[#1E40AF] pl-4">
                  {grievances.find((g) => g.id === selectedGrievance.id)?.updates.map((u) => (
                    <div key={u.id} className="text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">{u.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                        {u.timestamp} · {u.by}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Add Comment
                </h4>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your response..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    className="font-medium"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handleAddComment(selectedGrievance.id)}
                    className="bg-[#1E40AF] hover:bg-[#1E3A8A] font-semibold"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Grievances;