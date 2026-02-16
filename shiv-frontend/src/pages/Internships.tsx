import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Building2, 
  Calendar, 
  Briefcase, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle2,
  ExternalLink,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Sparkles,
  GraduationCap,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

// API
import { fetchResearchInternships, ResearchInternship } from "@/api/studentApi";

// Import new components
import { SearchBar } from "@/components/SearchBar";
import { StatCard } from "@/components/StatCard";

const Internships = () => {
  const { role } = useRole();
  const { toast } = useToast();
  const [internships, setInternships] = useState<any[]>([]); // will combine mock and real
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    company: "", 
    type: "Remote", 
    deadline: "",
    location: "",
    duration: "",
    stipend: "",
    description: "",
    postedBy: "Company" as "Company" | "Professor" | "Club",
    professor: "",
    club: ""
  });
  const [filterType, setFilterType] = useState<"All" | "Remote" | "On-site" | "Hybrid">("All");
  const [filterPostedBy, setFilterPostedBy] = useState<"All" | "Company" | "Professor" | "Club">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  // Fetch research internships from backend
  useEffect(() => {
    const loadInternships = async () => {
      if (role !== "student") return;
      setIsLoading(true);
      try {
        const research = await fetchResearchInternships();
        // Convert to common format
        const formatted = research.map(r => ({
          id: r._id,
          title: r.title,
          company: r.professor?.name || "Research",
          type: "Remote", // placeholder
          deadline: new Date(r.deadline).toLocaleDateString(),
          status: new Date(r.deadline) > new Date() ? "Open" : "Closed",
          postedBy: "Professor" as const,
          professor: r.professor?.name,
          location: "Campus",
          duration: r.duration,
          stipend: r.stipend,
          description: r.description,
          tags: ["Research", ...r.requiredSkills],
          applied: false
        }));
        setInternships(formatted);
      } catch (err) {
        toast({ title: "Error", description: "Failed to load internships", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadInternships();
  }, [role, toast]);

  const toggleApplied = (id: string) => {
    setAppliedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    toast({ title: "Applied", description: "Application submitted (mock)" });
  };

  const handleAdd = () => {
    if (!form.title.trim() || !form.company.trim()) return;
    const newInternship: any = {
      id: `i${Date.now()}`,
      title: form.title,
      company: form.company,
      type: form.type,
      deadline: form.deadline,
      status: "Open",
      postedBy: form.postedBy,
      professor: form.professor || undefined,
      club: form.club || undefined,
      location: form.location || undefined,
      duration: form.duration || undefined,
      stipend: form.stipend || undefined,
      description: form.description || undefined,
      tags: ["New", "Paid"],
      applied: false
    };
    setInternships((prev) => [newInternship, ...prev]);
    setForm({ title: "", company: "", type: "Remote", deadline: "", location: "", duration: "", stipend: "", description: "", postedBy: "Company", professor: "", club: "" });
    setOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredInternships = internships
    .filter(i => filterType === "All" ? true : i.type === filterType)
    .filter(i => filterPostedBy === "All" ? true : i.postedBy === filterPostedBy)
    .filter(i => 
      searchQuery === "" ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: internships.length,
    applied: appliedIds.length,
    remote: internships.filter(i => i.type === "Remote").length,
    active: internships.filter(i => i.status === "Open").length,
    professorPosted: internships.filter(i => i.postedBy === "Professor").length,
    clubPosted: internships.filter(i => i.postedBy === "Club").length,
  };

  const getPostedByIcon = (postedBy: string) => {
    switch(postedBy) {
      case "Professor": return <GraduationCap className="h-3 w-3" />;
      case "Club": return <Users className="h-3 w-3" />;
      default: return <Building2 className="h-3 w-3" />;
    }
  };

  const getPostedByColor = (postedBy: string) => {
    switch(postedBy) {
      case "Professor": return "text-[#059669] bg-emerald-100 dark:bg-emerald-950/30";
      case "Club": return "text-[#f59e0b] bg-amber-100 dark:bg-amber-950/30";
      default: return "text-[#1E40AF] bg-blue-100 dark:bg-blue-950/30";
    }
  };

  if (isLoading) return <div className="p-8">Loading internships...</div>;

  return (
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]">
              <Briefcase className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Internships
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {role === "student" 
              ? "Explore and apply for exciting internship opportunities" 
              : role === "professor"
              ? "Post and manage research internships for students"
              : role === "club"
              ? "Post club opportunities and teaching positions"
              : "Manage internship postings across campus"}
          </p>
        </div>
        
        {(role === "admin" || role === "professor" || role === "club") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className={cn(
                "text-white font-semibold shadow-sm",
                role === "professor" ? "bg-[#059669] hover:bg-[#047857]" :
                role === "club" ? "bg-[#f59e0b] hover:bg-[#d97706]" :
                "bg-[#1E40AF] hover:bg-[#1E3A8A]"
              )}>
                <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
                {role === "professor" ? "Post Research" : role === "club" ? "Post Opportunity" : "Post Internship"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {role === "professor" ? "Post Research Internship" : 
                   role === "club" ? "Post Club Opportunity" : 
                   "Post New Internship"}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  {role === "professor" ? "Share research opportunities with students" :
                   role === "club" ? "Post teaching or club positions" :
                   "Add a new internship opportunity for students"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[500px] overflow-y-auto">
                {/* Form fields – same as before */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Position Title
                  </label>
                  <Input 
                    placeholder={role === "professor" ? "e.g., ML Research Assistant" : 
                               role === "club" ? "e.g., Coding Club TA" : 
                               "e.g., Frontend Developer Intern"} 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    {role === "professor" ? "Professor/Department" : 
                     role === "club" ? "Club Name" : 
                     "Company Name"}
                  </label>
                  <Input 
                    placeholder={role === "professor" ? "Dr. Anjali Verma - CSE" : 
                               role === "club" ? "Programming Club" : 
                               "Google India"} 
                    value={form.company} 
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Description
                  </label>
                  <Textarea 
                    placeholder="Brief description of the role and responsibilities..." 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="min-h-[80px] font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Work Type
                    </label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger className="font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Location
                    </label>
                    <Input 
                      placeholder="City, Country" 
                      value={form.location} 
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Duration
                    </label>
                    <Input 
                      placeholder="e.g., 3 months" 
                      value={form.duration} 
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Stipend
                    </label>
                    <Input 
                      placeholder="e.g., ₹30k/month" 
                      value={form.stipend} 
                      onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                      className="font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Application Deadline
                  </label>
                  <Input 
                    type="date" 
                    value={form.deadline} 
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="font-medium"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAdd}
                  className={cn(
                    "font-semibold",
                    role === "professor" ? "bg-[#059669] hover:bg-[#047857]" :
                    role === "club" ? "bg-[#f59e0b] hover:bg-[#d97706]" :
                    "bg-[#1E40AF] hover:bg-[#1E3A8A]"
                  )}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Post Opportunity
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Opportunities"
          value={stats.total}
          color="default"
          icon={<Briefcase className="h-5 w-5" />}
        />
        {role === "student" && (
          <StatCard
            title="Applications"
            value={stats.applied}
            color="green"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        )}
        {role === "professor" && (
          <StatCard
            title="Research Posts"
            value={stats.professorPosted}
            color="green"
            icon={<GraduationCap className="h-5 w-5" />}
          />
        )}
        {role === "club" && (
          <StatCard
            title="Club Posts"
            value={stats.clubPosted}
            color="orange"
            icon={<Users className="h-5 w-5" />}
          />
        )}
        <StatCard
          title="Remote Options"
          value={stats.remote}
          color="blue"
          icon={<MapPin className="h-5 w-5" />}
        />
        <StatCard
          title="Active Postings"
          value={stats.active}
          color="blue"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search internships by title, company, or description..."
        onSearch={handleSearch}
        onFilter={() => {}}
        filters={{
          categories: ["Company", "Professor", "Club"],
          statuses: ["Open", "Deadline Soon"],
        }}
      />

      {/* Filter Section */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
              Available Opportunities
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                <SelectTrigger className="w-[140px] h-9 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPostedBy} onValueChange={(v) => setFilterPostedBy(v as any)}>
                <SelectTrigger className="w-[140px] h-9 font-medium">
                  <SelectValue placeholder="Posted By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sources</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Club">Club</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Internship Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInternships.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-gray-900 dark:text-white">No internships found</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                  Try adjusting your filters
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredInternships.map((internship) => (
            <Card 
              key={internship.id} 
              className={cn(
                "group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800",
                appliedIds.includes(internship.id) && "ring-2 ring-[#059669] border-[#059669]"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#1E40AF] transition-colors">
                      {internship.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {internship.postedBy === "Professor" ? (
                        <GraduationCap className="h-4 w-4" strokeWidth={2.5} />
                      ) : internship.postedBy === "Club" ? (
                        <Users className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <Building2 className="h-4 w-4" strokeWidth={2.5} />
                      )}
                      {internship.company}
                    </div>
                  </div>
                  <StatusBadge status={internship.status} />
                </div>
                {internship.tags && (
                  <div className="flex gap-1.5 flex-wrap">
                    {internship.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                    <Badge 
                      className={cn(
                        "text-xs font-semibold",
                        getPostedByColor(internship.postedBy)
                      )}
                    >
                      {getPostedByIcon(internship.postedBy)}
                      <span className="ml-1">{internship.postedBy}</span>
                    </Badge>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-2.5">
                {internship.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
                    {internship.description}
                  </p>
                )}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                      <Briefcase className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" strokeWidth={2.5} />
                    </div>
                    <span>{internship.type}</span>
                  </div>
                  {internship.location && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                        <MapPin className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" strokeWidth={2.5} />
                      </div>
                      <span>{internship.location}</span>
                    </div>
                  )}
                  {internship.duration && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                        <Clock className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" strokeWidth={2.5} />
                      </div>
                      <span>{internship.duration}</span>
                    </div>
                  )}
                  {internship.stipend && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#059669] dark:text-emerald-400">
                      <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-950/30">
                        <DollarSign className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                      <span>{internship.stipend}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                      <Calendar className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs">Deadline: {internship.deadline}</span>
                  </div>
                </div>
              </CardContent>
              
              {role === "student" && (
                <CardFooter className="pt-3">
                  <Button 
                    variant={appliedIds.includes(internship.id) ? "secondary" : "default"}
                    size="sm" 
                    className={cn(
                      "w-full font-semibold",
                      !appliedIds.includes(internship.id) && "bg-[#1E40AF] hover:bg-[#1E3A8A]"
                    )}
                    onClick={() => toggleApplied(internship.id)}
                  >
                    {appliedIds.includes(internship.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" strokeWidth={2.5} />
                        Applied
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" strokeWidth={2.5} />
                        Apply Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Internships;