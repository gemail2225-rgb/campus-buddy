import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  Users,
  Briefcase,
  Calendar,
  Clock,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  FileText,
  Upload,
  Download,
  TrendingUp,
  Award,
  Bell,
  Eye,
  ChevronRight,
  Link2,
  Video,
  BookMarked,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import components
import { StatCard } from "@/components/StatCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Import API
import {
  fetchCourses,
  fetchAssignments,
  fetchStudyMaterials,
  fetchResearchInternships,
  createAssignment,
  createResearchInternship,
  updateResearchInternship,
  deleteResearchInternship,
  deleteStudyMaterial,
  type Course,
  type Assignment,
  type StudyMaterial,
  type ResearchInternship
} from "@/api/professorApi";

const ProfessorDashboard = () => {
  const { role } = useRole();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showResearchDialog, setShowResearchDialog] = useState(false);
  const [showEditResearchDialog, setShowEditResearchDialog] = useState(false);
  
  // State for data from API
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [researchPosts, setResearchPosts] = useState<ResearchInternship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock students for a course (to be replaced with real enrollment)
  const [courseStudents, setCourseStudents] = useState<any[]>([]); // will be populated when viewing a course

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    course: "",
    dueDate: "",
    totalMarks: "100",
    description: ""
  });

  // Research form state
  const [researchForm, setResearchForm] = useState({
    id: "",
    title: "",
    description: "",
    duration: "",
    stipend: "",
    deadline: "",
    requirements: ""
  });

  // Material form state
  const [materialForm, setMaterialForm] = useState({
    title: "",
    course: "",
    type: "pdf"
  });

  // Redirect if not professor
  if (role !== "professor") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-[#059669] mb-4" />
            <h2 className="text-2xl font-bold mb-2">Professor Dashboard</h2>
            <p className="text-muted-foreground">
              This dashboard is only available for professors.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch all data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [coursesData, assignmentsData, materialsData, researchData] = await Promise.all([
          fetchCourses(),
          fetchAssignments(),
          fetchStudyMaterials(),
          fetchResearchInternships(),
        ]);
        setCourses(coursesData);
        setAssignments(assignmentsData);
        setMaterials(materialsData);
        setResearchPosts(researchData);
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

  // Compute stats
  const professorStats = {
    courses: courses.length,
    students: courses.reduce((acc, c) => acc + (c.students?.length || 0), 0),
    avgGPA: 8.2, // placeholder – need to compute from grades if available
    topPerformer: "Rahul Sharma", // placeholder
    passRate: 92, // placeholder
    attendanceRate: 86 // placeholder
  };

  const handleCreateAssignment = async () => {
    try {
      setError(null);
      if (!assignmentForm.title.trim()) {
        setError("Assignment title is required");
        return;
      }
      if (!assignmentForm.course) {
        setError("Course is required");
        return;
      }
      if (!assignmentForm.dueDate) {
        setError("Due date is required");
        return;
      }
      setIsLoading(true);
      const newAssignment = await createAssignment({
        title: assignmentForm.title,
        description: assignmentForm.description,
        course: assignmentForm.course,
        dueDate: assignmentForm.dueDate,
        totalMarks: parseInt(assignmentForm.totalMarks),
      });
      setAssignments(prev => [...prev, newAssignment]);
      setShowAssignmentDialog(false);
      setAssignmentForm({ title: "", course: "", dueDate: "", totalMarks: "100", description: "" });
      toast({ title: "Success", description: "Assignment created" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to create assignment", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadMaterial = async () => {
    try {
      // For file upload, you'd need to handle FormData. This is a placeholder.
      setShowMaterialDialog(false);
      setMaterialForm({ title: "", course: "", type: "pdf" });
      toast({ title: "Info", description: "Upload material not implemented" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload material", variant: "destructive" });
    }
  };

  const handleCreateResearch = async () => {
    try {
      if (!researchForm.title || !researchForm.deadline) {
        setError("Title and deadline required");
        return;
      }
      setIsLoading(true);
      const newResearch = await createResearchInternship({
        title: researchForm.title,
        description: researchForm.description,
        duration: researchForm.duration,
        stipend: researchForm.stipend,
        deadline: researchForm.deadline,
        requiredSkills: researchForm.requirements.split(',').map(s => s.trim()),
      });
      setResearchPosts(prev => [...prev, newResearch]);
      setShowResearchDialog(false);
      setResearchForm({ id: "", title: "", description: "", duration: "", stipend: "", deadline: "", requirements: "" });
      toast({ title: "Success", description: "Research opportunity posted" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to create research", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditResearch = (research: ResearchInternship) => {
    setResearchForm({
      id: research._id,
      title: research.title,
      description: research.description,
      duration: research.duration,
      stipend: research.stipend,
      deadline: research.deadline.slice(0, 10),
      requirements: research.requiredSkills.join(', ')
    });
    setShowEditResearchDialog(true);
  };

  const handleUpdateResearch = async () => {
    try {
      if (!researchForm.id) return;
      setIsLoading(true);
      const updated = await updateResearchInternship(researchForm.id, {
        title: researchForm.title,
        description: researchForm.description,
        duration: researchForm.duration,
        stipend: researchForm.stipend,
        deadline: researchForm.deadline,
        requiredSkills: researchForm.requirements.split(',').map(s => s.trim()),
      });
      setResearchPosts(prev => prev.map(r => r._id === updated._id ? updated : r));
      setShowEditResearchDialog(false);
      setResearchForm({ id: "", title: "", description: "", duration: "", stipend: "", deadline: "", requirements: "" });
      toast({ title: "Success", description: "Research updated" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to update research", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResearch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research opportunity?")) return;
    try {
      setIsLoading(true);
      await deleteResearchInternship(id);
      setResearchPosts(prev => prev.filter(r => r._id !== id));
      toast({ title: "Success", description: "Research deleted" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete research", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    try {
      setIsLoading(true);
      await deleteStudyMaterial(id);
      setMaterials(prev => prev.filter(m => m._id !== id));
      toast({ title: "Success", description: "Material deleted" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete material", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSubmissions = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setShowSubmissionsModal(true);
  };

  const handleViewStudents = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      // Convert enrolled students to UI format (if populated)
      setCourseStudents(course.students?.map(s => ({ ...s, attendance: 85, grade: 'A', submissions: 8, total: 8 })) || []);
    }
    setSelectedCourse(courseId);
    setShowStudentsModal(true);
  };

  const handleDownloadMaterial = (materialId: string) => {
    // open file URL or download
  };

  if (isLoading && courses.length === 0) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, Dr. Anjali Verma
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Student Performance Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Class GPA"
          value={professorStats.avgGPA}
          color="blue"
          icon={<Award className="h-5 w-5" />}
          description="Across all courses"
        />
        <StatCard
          title="Top Performer"
          value={professorStats.topPerformer}
          color="green"
          icon={<Users className="h-5 w-5" />}
          description="Overall highest"
        />
        <StatCard
          title="Pass Rate"
          value={`${professorStats.passRate}%`}
          color="orange"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 2, direction: "up", label: "vs last sem" }}
        />
        <StatCard
          title="Attendance Rate"
          value={`${professorStats.attendanceRate}%`}
          color="orange"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Main Tabs - Only Courses, Assignments, Research */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="courses">Courses I Teach</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course._id} className="border-l-4 border-l-brand-primary hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-2xl font-bold">{course.courseName}</h3>
                        <Badge variant="outline" className="bg-brand-primary/10 text-brand-primary border-brand-primary/30">
                          {course.courseCode}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Semester</p>
                          <p className="text-sm font-semibold">{course.semester}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Credits</p>
                          <p className="text-sm font-semibold">{course.credits}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Students</p>
                          <p className="text-sm font-semibold">{course.students?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Materials</p>
                          <p className="text-sm font-semibold">{materials.filter(m => m.course?._id === course._id).length}</p>
                        </div>
                      </div>

                      {/* Attendance Progress */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">Average Attendance</span>
                          <span className="text-xs font-bold text-brand-primary">{course.attendance || 0}%</span>
                        </div>
                        <Progress value={course.attendance || 0} className="h-2" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:flex-col">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleViewStudents(course._id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Students
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => setShowMaterialDialog(true)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Material
                      </Button>
                      <Button 
                        className="justify-start bg-brand-primary hover:bg-brand-primary/90"
                        onClick={() => setShowAssignmentDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Assignment
                      </Button>
                    </div>
                  </div>

                  {/* Study Materials Preview */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <BookMarked className="h-4 w-4 text-brand-primary" />
                      Recent Materials
                    </h4>
                    <div className="space-y-2">
                      {materials.filter(m => m.course?._id === course._id).slice(0, 3).map((material) => (
                        <div key={material._id} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-brand-primary" />
                            <span className="text-sm">{material.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">-</span>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadMaterial(material._id)}>
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteMaterial(material._id)}>
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">All Assignments</h2>
            <Button 
              className="bg-brand-primary hover:bg-brand-primary/90"
              onClick={() => setShowAssignmentDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>

          <div className="grid gap-4">
            {assignments.map((assignment) => {
              const totalStudents = courses.find(c => c._id === assignment.course?._id)?.students?.length || 0;
              const submissions = assignment.submissions?.length || 0;
              const status = new Date(assignment.dueDate) > new Date() ? "Open" : "Closed";
              return (
                <Card key={assignment._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <Badge variant={status === "Open" ? "default" : "secondary"}>
                            {status}
                          </Badge>
                        </div>
                        <p className="text-sm text-brand-primary font-medium mt-1">{assignment.course?.courseCode}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{submissions}/{totalStudents} Submitted</span>
                          </div>
                        </div>
                        <Progress 
                          value={totalStudents ? (submissions / totalStudents) * 100 : 0} 
                          className="h-1.5 w-32 mt-2" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewSubmissions(assignment._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Submissions
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Research Opportunities</h2>
            <Button 
              className="bg-[#059669] hover:bg-[#047857]"
              onClick={() => setShowResearchDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Research
            </Button>
          </div>

          <div className="grid gap-4">
            {researchPosts.map((post) => {
              const status = new Date(post.deadline) > new Date() ? "Open" : "Closed";
              return (
                <Card key={post._id} className="border-l-4 border-l-[#059669]">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <Badge variant={status === "Open" ? "default" : "destructive"}>
                            {status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#059669] font-medium mt-1">{post.professor?.name}</p>
                        <p className="text-sm text-muted-foreground mt-2">{post.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="text-sm font-semibold">{post.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Stipend</p>
                            <p className="text-sm font-semibold text-[#059669]">{post.stipend}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Deadline</p>
                            <p className="text-sm font-semibold">{new Date(post.deadline).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Applicants</p>
                            <p className="text-sm font-semibold">{post.applicants?.length || 0}</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs font-medium mb-1">Requirements:</p>
                          <div className="flex flex-wrap gap-1">
                            {post.requiredSkills.map((req, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Applicants
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditResearch(post)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteResearch(post._id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Students Modal */}
      <Dialog open={showStudentsModal} onOpenChange={setShowStudentsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Students enrolled in {courses.find(c => c._id === selectedCourse)?.courseName}</DialogTitle>
            <DialogDescription>
              {courses.find(c => c._id === selectedCourse)?.students?.length || 0} students total
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">{student.rollNo || '-'}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.attendance} className="h-2 w-16" />
                        <span className={student.attendance >= 75 ? "text-green-600" : "text-red-600"}>
                          {student.attendance}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.grade}</Badge>
                    </TableCell>
                    <TableCell>{student.submissions}/{student.total}</TableCell>
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

      {/* Assignment Dialog */}
      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>Add a new assignment for your course</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assignment Title</Label>
              <Input 
                placeholder="e.g., Binary Search Tree Implementation"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={assignmentForm.course} onValueChange={(v) => setAssignmentForm({...assignmentForm, course: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Assignment details and instructions"
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input 
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input 
                  type="number"
                  placeholder="100"
                  value={assignmentForm.totalMarks}
                  onChange={(e) => setAssignmentForm({...assignmentForm, totalMarks: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignmentDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateAssignment} className="bg-brand-primary hover:bg-brand-primary/90" disabled={isLoading}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Research Dialog - Create */}
      <Dialog open={showResearchDialog} onOpenChange={setShowResearchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post Research Opportunity</DialogTitle>
            <DialogDescription>Share research opportunities with students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Research Title</Label>
              <Input 
                placeholder="e.g., ML Research Assistant"
                value={researchForm.title}
                onChange={(e) => setResearchForm({...researchForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Brief description of the research work"
                value={researchForm.description}
                onChange={(e) => setResearchForm({...researchForm, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input 
                  placeholder="e.g., 6 months"
                  value={researchForm.duration}
                  onChange={(e) => setResearchForm({...researchForm, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Stipend</Label>
                <Input 
                  placeholder="e.g., ₹15,000/month"
                  value={researchForm.stipend}
                  onChange={(e) => setResearchForm({...researchForm, stipend: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input 
                type="date"
                value={researchForm.deadline}
                onChange={(e) => setResearchForm({...researchForm, deadline: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Requirements (comma separated)</Label>
              <Input 
                placeholder="e.g., Python, PyTorch, ML Basics"
                value={researchForm.requirements}
                onChange={(e) => setResearchForm({...researchForm, requirements: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResearchDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateResearch} className="bg-[#059669]" disabled={isLoading}>Post Research</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Research Dialog - Edit */}
      <Dialog open={showEditResearchDialog} onOpenChange={setShowEditResearchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Research Opportunity</DialogTitle>
            <DialogDescription>Update research opportunity details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Research Title</Label>
              <Input 
                placeholder="e.g., ML Research Assistant"
                value={researchForm.title}
                onChange={(e) => setResearchForm({...researchForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Brief description of the research work"
                value={researchForm.description}
                onChange={(e) => setResearchForm({...researchForm, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input 
                  placeholder="e.g., 6 months"
                  value={researchForm.duration}
                  onChange={(e) => setResearchForm({...researchForm, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Stipend</Label>
                <Input 
                  placeholder="e.g., ₹15,000/month"
                  value={researchForm.stipend}
                  onChange={(e) => setResearchForm({...researchForm, stipend: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input 
                type="date"
                value={researchForm.deadline}
                onChange={(e) => setResearchForm({...researchForm, deadline: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Requirements (comma separated)</Label>
              <Input 
                placeholder="e.g., Python, PyTorch, ML Basics"
                value={researchForm.requirements}
                onChange={(e) => setResearchForm({...researchForm, requirements: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditResearchDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateResearch} className="bg-[#059669]" disabled={isLoading}>Update Research</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Dialog */}
      <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Study Material</DialogTitle>
            <DialogDescription>Add new material for students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>File Name</Label>
              <Input 
                placeholder="e.g., Lecture Notes.pdf"
                value={materialForm.title}
                onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={materialForm.course} onValueChange={(v) => setMaterialForm({...materialForm, course: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Material Type</Label>
              <Select value={materialForm.type} onValueChange={(v) => setMaterialForm({...materialForm, type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Upload File</Label>
              <Input type="file" className="cursor-pointer" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaterialDialog(false)}>Cancel</Button>
            <Button onClick={handleUploadMaterial} className="bg-[#059669]" disabled={isLoading}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submissions Modal */}
      <Dialog open={showSubmissionsModal} onOpenChange={setShowSubmissionsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assignment Submissions</DialogTitle>
            <DialogDescription>
              {assignments.find(a => a._id === selectedAssignment)?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.find(a => a._id === selectedAssignment)?.submissions?.map((sub) => (
                  <TableRow key={sub.student?._id}>
                    <TableCell>{sub.student?.name || 'Unknown'}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Submitted</Badge>
                    </TableCell>
                    <TableCell>
                      <Input className="w-16 h-8" placeholder="Grade" defaultValue={sub.marks} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
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

export default ProfessorDashboard;