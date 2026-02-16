import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  ExternalLink, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Download,
  FileText,
  Video,
  Link2,
  ChevronRight,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookMarked,
  Plus,
  Edit2,
  Trash2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/contexts/RoleContext";

// Import API functions
import {
  fetchCourses,
  fetchAssignments,
  fetchStudyMaterials,
  createAssignment,
  type Course,
  type Assignment,
  type StudyMaterial
} from "@/api/professorApi";

// GPA Calculator Function
const calculateGPA = (courses: Course[]) => {
  const gradePointsMap: Record<string, number> = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };
  const totalPoints = courses.reduce((sum, c) => {
    // If grade is not available, default to 0
    const grade = (c as any).grade || 'F';
    const points = gradePointsMap[grade] || 0;
    return sum + (points * (c.credits || 0));
  }, 0);
  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
};

const Academics = () => {
  const { role } = useRole();
  const { toast } = useToast();
  const [selectedSemester, setSelectedSemester] = useState("current");
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    courseId: "",
    title: "",
    dueDate: "",
    description: ""
  });

  // State for data
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to determine material type
  const getMaterialType = (url?: string): 'pdf' | 'video' | 'link' => {
    if (!url) return 'link';
    if (url.endsWith('.pdf')) return 'pdf';
    if (url.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i)) return 'video';
    return 'link';
  };

  // Fetch data on mount and role change
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [coursesData, assignmentsData, materialsData] = await Promise.all([
          fetchCourses(),
          fetchAssignments(),
          fetchStudyMaterials(),
        ]);
        setCourses(coursesData);
        setAssignments(assignmentsData);
        setStudyMaterials(materialsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        toast({
          title: "Error",
          description: "Failed to load academic data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [role, toast]);

  // Student-specific calculations
  const currentGPA = calculateGPA(courses);
  const cgpa = "8.45"; // placeholder – would come from another endpoint or compute all semesters
  const attendanceStats = {
    above75: courses.filter(c => (c.attendance || 0) >= 75).length,
    below75: courses.filter(c => (c.attendance || 0) < 75).length,
    average: courses.length > 0 
      ? Math.round(courses.reduce((sum, c) => sum + (c.attendance || 0), 0) / courses.length)
      : 0
  };

  // Professor stats (can be computed from courses and assignments)
  const professorStats = {
    avgClassGPA: "7.85", // placeholder – would need grade data
    topPerformer: "Sarah Johnson", // placeholder
    passRate: "94%",
    avgAttendance: attendanceStats.average + "%"
  };

  // Handle add assignment (professor only)
  const handleAddAssignment = async () => {
    try {
      if (!assignmentForm.courseId || !assignmentForm.title || !assignmentForm.dueDate) {
        toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
        return;
      }
      setIsLoading(true);
      const newAssignment = await createAssignment({
        title: assignmentForm.title,
        description: assignmentForm.description,
        course: assignmentForm.courseId,
        dueDate: assignmentForm.dueDate,
        totalMarks: 100, // default
      });
      setAssignments(prev => [...prev, newAssignment]);
      setAssignmentForm({ courseId: "", title: "", dueDate: "", description: "" });
      setIsAddingAssignment(false);
      toast({ title: "Success", description: "Assignment created" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to create assignment", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && courses.length === 0) {
    return <div className="p-6 text-center">Loading academic data...</div>;
  }

  // STUDENT VIEW
  if (role === "student") {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academics</h1>
            <p className="text-muted-foreground mt-2">
              Track your courses, attendance, and grades
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Semester {new Date().getMonth() < 6 ? 'Spring' : 'Fall'} 2026
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900 border-blue-200 dark:border-blue-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Current GPA</p>
                  <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mt-2">{currentGPA}</div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>CGPA: {cgpa}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900 border-green-200 dark:border-green-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Attendance</p>
                  <div className="text-4xl font-bold text-green-700 dark:text-green-300 mt-2">{attendanceStats.average}%</div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <BookMarked className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                  ✓ {attendanceStats.above75} above 75%
                </Badge>
                {attendanceStats.below75 > 0 && (
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                    ⚠ {attendanceStats.below75} below 75%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courses</p>
                  <div className="text-3xl font-bold mt-2">{courses.length}</div>
                </div>
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-4">{courses.reduce((sum, c) => sum + (c.credits || 0), 0)} Total Credits</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                  <div className="text-3xl font-bold mt-2">{assignments.length}</div>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {assignments.filter(a => new Date(a.dueDate) > new Date()).length} Pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="courses">📚 Courses</TabsTrigger>
            <TabsTrigger value="assignments">📝 Assignments</TabsTrigger>
            <TabsTrigger value="materials">📁 Materials</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Courses</CardTitle>
                <CardDescription>Current semester course details with attendance and grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Professor</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Resources</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course._id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>{course.professor?.name || 'N/A'}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={course.attendance || 0} 
                                  className={cn(
                                    "h-2 w-20",
                                    (course.attendance || 0) >= 75 ? "bg-green-100" : "bg-red-100"
                                  )}
                                />
                                <span className={cn(
                                  "text-sm font-medium",
                                  (course.attendance || 0) >= 75 ? "text-green-600" : "text-red-600"
                                )}>
                                  {course.attendance || 0}%
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={(course as any).grade === 'A' ? 'default' : 'outline'}>
                              {(course as any).grade || '-'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="View course details">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <Card key={course._id} className="border-l-4" style={{ borderLeftColor: (course.attendance || 0) >= 75 ? '#10b981' : '#ef4444' }}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.courseCode}</h3>
                        <p className="text-sm text-muted-foreground">{course.courseName}</p>
                      </div>
                      <Badge>{(course as any).grade || '-'}</Badge>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance</span>
                        <span className={(course.attendance || 0) >= 75 ? 'text-green-600' : 'text-red-600'}>
                          {course.attendance || 0}%
                        </span>
                      </div>
                      <Progress value={course.attendance || 0} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Track your pending and submitted assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Title</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => {
                        const status = new Date(assignment.dueDate) > new Date() ? "pending" : "overdue";
                        const priority = (assignment.totalMarks || 0) > 50 ? "high" : "medium";
                        return (
                          <TableRow key={assignment._id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{assignment.course?.courseCode}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={status === "pending" ? "outline" : "default"}>
                                {status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={priority === "high" ? "destructive" : "secondary"}>
                                {priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border-brand-primary/50">View</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Study Materials</CardTitle>
                <CardDescription>Course notes, presentations, and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {studyMaterials.map((material) => {
                    const type = getMaterialType(material.fileUrl);
                    return (
                      <Card key={material._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              type === 'pdf' ? 'bg-red-100 dark:bg-red-900/20' : 
                              type === 'video' ? 'bg-blue-100 dark:bg-blue-900/20' : 
                              'bg-green-100 dark:bg-green-900/20'
                            )}>
                              {type === 'pdf' && <FileText className="h-5 w-5 text-red-600" />}
                              {type === 'video' && <Video className="h-5 w-5 text-blue-600" />}
                              {type === 'link' && <Link2 className="h-5 w-5 text-green-600" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{material.title}</h4>
                              <p className="text-sm text-muted-foreground">{material.course?.courseName}</p>
                              <p className="text-xs text-muted-foreground mt-1">Uploaded by {material.uploadedBy?.name}</p>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Download material">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CGPA Calculator Section */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-primary/10 rounded-full">
                  <GraduationCap className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">CGPA Calculator</h3>
                  <p className="text-sm text-muted-foreground">Calculate your weighted average</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Current CGPA</p>
                  <p className="text-3xl font-bold text-brand-primary">{cgpa}</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Credits Earned</p>
                  <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + (c.credits || 0), 0)}</p>
                </div>
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Calculate Details
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // PROFESSOR VIEW
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academics</h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses and monitor student performance
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <BookOpen className="h-4 w-4 mr-2" />
          Semester {new Date().getMonth() < 6 ? 'Spring' : 'Fall'} 2026
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-brand-primary/10 to-white dark:from-brand-primary/20 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Class GPA</p>
                <div className="text-4xl font-bold text-brand-primary mt-2">{professorStats.avgClassGPA}</div>
              </div>
              <Award className="h-8 w-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-brand-secondary/10 to-white dark:from-brand-secondary/20 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Performer</p>
                <div className="text-2xl font-bold text-brand-secondary mt-2">{professorStats.topPerformer}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-brand-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <div className="text-4xl font-bold mt-2">{professorStats.passRate}</div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <div className="text-4xl font-bold mt-2">{professorStats.avgAttendance}</div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="courses">📚 Courses I Teach</TabsTrigger>
          <TabsTrigger value="assignments">📝 Assignments</TabsTrigger>
          <TabsTrigger value="materials">📁 Study Materials</TabsTrigger>
        </TabsList>

        {/* Courses I Teach Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Courses I Teach</CardTitle>
              <CardDescription>Manage your courses, students, and course materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{course.courseCode}</TableCell>
                        <TableCell>{course.courseName}</TableCell>
                        <TableCell>Spring 2026</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.students?.length || 0} Students</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={course.attendance || 0} className="h-2 w-20" />
                            <span className="text-sm font-medium">{course.attendance || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit course">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="View students">
                              <Users className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Course Details Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.slice(0, 2).map((course) => (
              <Card key={course._id} className="border-l-4 border-l-brand-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{course.courseCode}</h3>
                      <p className="text-sm text-muted-foreground">{course.courseName}</p>
                    </div>
                    <Badge className="bg-brand-primary/20 text-brand-primary">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Student Engagement</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-1.5" />
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span>Class Performance</span>
                      <span className="font-medium text-green-600">8.2/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Course Assignments</CardTitle>
                <CardDescription>Create and manage assignments for your courses</CardDescription>
              </div>
              <Dialog open={isAddingAssignment} onOpenChange={setIsAddingAssignment}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-primary hover:bg-brand-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Assignment</DialogTitle>
                    <DialogDescription>Add a new assignment for your course</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Course</label>
                      <Select value={assignmentForm.courseId} onValueChange={(value) => setAssignmentForm({...assignmentForm, courseId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a course..." />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.courseCode} - {course.courseName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Assignment Title</label>
                      <Input
                        value={assignmentForm.title}
                        onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                        placeholder="Enter assignment title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={assignmentForm.dueDate}
                        onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={assignmentForm.description}
                        onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                        placeholder="Enter assignment description"
                      />
                    </div>
                    <Button onClick={handleAddAssignment} className="w-full bg-brand-primary hover:bg-brand-primary/90" disabled={isLoading}>
                      Create Assignment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => {
                      const totalStudents = courses.find(c => c._id === assignment.course?._id)?.students?.length || 0;
                      const submissions = assignment.submissions?.length || 0;
                      const status = new Date(assignment.dueDate) > new Date() ? "Open" : "Closed";
                      return (
                        <TableRow key={assignment._id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell>{assignment.course?.courseCode}</TableCell>
                          <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{submissions}/{totalStudents}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status === "Open" ? "default" : "secondary"}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">Review</Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Materials Tab */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Study Materials</CardTitle>
              <CardDescription>Course notes, lectures, and reference materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {studyMaterials.map((material) => {
                  const type = getMaterialType(material.fileUrl);
                  return (
                    <Card key={material._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            type === 'pdf' ? 'bg-red-100 dark:bg-red-900/20' : 
                            type === 'video' ? 'bg-blue-100 dark:bg-blue-900/20' : 
                            'bg-green-100 dark:bg-green-900/20'
                          )}>
                            {type === 'pdf' && <FileText className="h-5 w-5 text-red-600" />}
                            {type === 'video' && <Video className="h-5 w-5 text-blue-600" />}
                            {type === 'link' && <Link2 className="h-5 w-5 text-green-600" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{material.title}</h4>
                            <p className="text-sm text-muted-foreground">{material.course?.courseName}</p>
                            <p className="text-xs text-muted-foreground mt-1">Uploaded by {material.uploadedBy?.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Academics;