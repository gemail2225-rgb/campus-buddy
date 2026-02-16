import { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  Users,
  Check
} from "lucide-react";

interface Applicant {
  id: number;
  name: string;
  appliedOn: string;
}

interface StudentApplication {
  id: number;
  title: string;
  professor: string;
  appliedOn: string;
}

interface ResearchPosition {
  id: number;
  title: string;
  professor: string;
  department: string;
  description: string;
  requirements: string[];
  duration: string;
  stipend: string;
  deadline: string;
  status: string;
  applicants: Applicant[];
}

// Mock research positions
const initialResearchPositions: ResearchPosition[] = [
  {
    id: 1,
    title: "ML Research Assistant",
    professor: "Dr. Anjali Verma",
    department: "Computer Science",
    description: "Working on deep learning models for medical image analysis.",
    requirements: ["Python", "PyTorch", "ML Basics"],
    duration: "6 months",
    stipend: "₹15,000/month",
    deadline: "2026-03-15",
    status: "Open",
    applicants: [
      { id: 1, name: "John Doe", appliedOn: "2026-02-10" },
      { id: 2, name: "Jane Smith", appliedOn: "2026-02-12" }
    ]
  },
  {
    id: 2,
    title: "NLP Research Intern",
    professor: "Dr. Priya Singh",
    department: "CSE",
    description: "Working on sentiment analysis and language models for Indian languages.",
    requirements: ["NLP", "Python", "Transformers"],
    duration: "5 months",
    stipend: "₹15,000/month",
    deadline: "2026-03-10",
    status: "Open",
    applicants: []
  },
];

const Research = () => {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState("available");
  const [researchPositions, setResearchPositions] = useState(initialResearchPositions);
  const [studentApplications, setStudentApplications] = useState<StudentApplication[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showApplicantsDialog, setShowApplicantsDialog] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<ResearchPosition | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    duration: "",
    stipend: "",
    deadline: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateResearch = () => {
    try {
      setError(null);
      if (!formData.title.trim()) {
        setError("Title is required");
        return;
      }
      if (!formData.description.trim()) {
        setError("Description is required");
        return;
      }
      if (!formData.deadline) {
        setError("Deadline is required");
        return;
      }
      const newPosition = {
        id: Math.max(...researchPositions.map(p => p.id), 0) + 1,
        ...formData,
        requirements: formData.requirements.split(",").map(r => r.trim()),
        professor: "Dr. Anjali Verma",
        department: "Computer Science",
        status: "Open",
        applicants: []
      };
      setResearchPositions([newPosition, ...researchPositions]);
      setFormData({ title: "", description: "", requirements: "", duration: "", stipend: "", deadline: "" });
      setShowCreateDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create research position");
    }
  };

  const handleEditResearch = (position: ResearchPosition) => {
    setFormData({
      title: position.title,
      description: position.description,
      requirements: position.requirements.join(", "),
      duration: position.duration,
      stipend: position.stipend,
      deadline: position.deadline,
    });
    setSelectedPosition(position);
    setShowEditDialog(true);
  };

  const handleUpdateResearch = () => {
    try {
      setError(null);
      if (!selectedPosition) return;
      if (!formData.title.trim()) {
        setError("Title is required");
        return;
      }
      if (!formData.description.trim()) {
        setError("Description is required");
        return;
      }
      if (!formData.deadline) {
        setError("Deadline is required");
        return;
      }
      setResearchPositions(researchPositions.map(p =>
        p.id === selectedPosition.id
          ? {
              ...p,
              ...formData,
              requirements: formData.requirements.split(",").map(r => r.trim()),
            }
          : p
      ));
      setShowEditDialog(false);
      setSelectedPosition(null);
      setFormData({ title: "", description: "", requirements: "", duration: "", stipend: "", deadline: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update research position");
    }
  };

  const handleDeleteResearch = (id: number) => {
    if (confirm("Are you sure you want to delete this position?")) {
      setResearchPositions(researchPositions.filter(p => p.id !== id));
    }
  };

  const handleApplyForResearch = (position: ResearchPosition) => {
    const alreadyApplied = studentApplications.find(app => app.id === position.id);
    if (alreadyApplied) {
      return; // Already applied
    }

    setStudentApplications([...studentApplications, {
      id: position.id,
      title: position.title,
      professor: position.professor,
      appliedOn: new Date().toISOString().split('T')[0],
    }]);

    // Update applicants count
    setResearchPositions(researchPositions.map(p =>
      p.id === position.id
        ? {
            ...p,
            applicants: [...p.applicants, { id: Date.now(), name: "You", appliedOn: new Date().toISOString().split('T')[0] }]
          }
        : p
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Internships</h1>
          <p className="text-muted-foreground mt-2">
            {role === "professor" 
              ? "Post and manage research opportunities for students" 
              : "Find research opportunities with professors"}
          </p>
        </div>
        
        {role === "professor" && (
          <Button 
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => {
              setFormData({ title: "", description: "", requirements: "", duration: "", stipend: "", deadline: "" });
              setShowCreateDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Research
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="available">Available Positions</TabsTrigger>
          <TabsTrigger value={role === "professor" ? "my-posts" : "my-applications"}>
            {role === "professor" ? "My Posts" : "My Applications"}
          </TabsTrigger>
        </TabsList>

        {/* Available Positions Tab */}
        <TabsContent value="available" className="space-y-6">
          {researchPositions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Research Positions Available</h3>
                <p className="text-muted-foreground">Check back later for opportunities</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {researchPositions.map((position) => (
                <Card key={position.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{position.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {position.professor} • {position.department}
                        </p>
                      </div>
                      <Badge variant={position.status === "Open" ? "default" : "secondary"}>
                        {position.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{position.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{position.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stipend</p>
                        <p className="font-medium">{position.stipend}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {position.requirements.map((req: string) => (
                          <Badge key={req} variant="outline">{req}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Applicants: {position.applicants.length}
                    </div>

                    <div className="flex gap-2 pt-4">
                      {role === "professor" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditResearch(position)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedPosition(position);
                              setShowApplicantsDialog(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Applicants
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteResearch(position.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {role === "student" && (
                        <Button
                          className="w-full font-bold px-6 py-3 bg-brand-primary hover:bg-brand-primary/85 text-white shadow-lg hover:shadow-xl transition-all"
                          onClick={() => handleApplyForResearch(position)}
                          disabled={studentApplications.find(app => app.id === position.id) !== undefined}
                        >
                          <Check className="h-5 w-5 mr-2" />
                          {studentApplications.find(app => app.id === position.id) ? "Applied" : "Apply Now"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Posts Tab (Professor) */}
        <TabsContent value="my-posts" className="space-y-6">
          {role === "professor" && (
            researchPositions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground mb-4">Start by posting your first research opportunity</p>
                  <Button 
                    className="bg-brand-primary hover:bg-brand-primary/90"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Research
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {researchPositions.map((position) => (
                  <Card key={position.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{position.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{position.description}</p>
                      <div className="text-sm text-muted-foreground">
                        Applicants: {position.applicants.length}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditResearch(position)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedPosition(position);
                            setShowApplicantsDialog(true);
                          }}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteResearch(position.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </TabsContent>

        {/* My Applications Tab (Student) */}
        <TabsContent value="my-applications">
          {role === "student" && (
            studentApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground">Apply to research positions to see them here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {studentApplications.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{app.title}</h3>
                          <p className="text-sm text-muted-foreground">{app.professor}</p>
                          <p className="text-sm text-muted-foreground mt-1">Applied on {app.appliedOn}</p>
                        </div>
                        <Badge>Pending</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          setSelectedPosition(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? "Edit Research Position" : "Post New Research Position"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., ML Research Assistant"
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the research work..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 6 months"
                />
              </div>
              <div className="space-y-2">
                <Label>Stipend</Label>
                <Input
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  placeholder="e.g., ₹15,000/month"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Skills (comma-separated)</Label>
              <Input
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Python, PyTorch, ML Basics"
              />
            </div>

            <div className="space-y-2">
              <Label>Deadline *</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setShowEditDialog(false);
            }}>
              Cancel
            </Button>
            <Button
              className="bg-brand-primary hover:bg-brand-primary/90"
              onClick={showEditDialog ? handleUpdateResearch : handleCreateResearch}
            >
              {showEditDialog ? "Update" : "Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applicants Dialog */}
      <Dialog open={showApplicantsDialog} onOpenChange={setShowApplicantsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Applicants</DialogTitle>
          </DialogHeader>

          {selectedPosition && selectedPosition.applicants.length === 0 ? (
            <p className="text-center text-muted-foreground">No applicants yet</p>
          ) : (
            <div className="space-y-3">
              {selectedPosition?.applicants.map((applicant: Applicant) => (
                <div key={applicant.id} className="flex items-start justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{applicant.name}</p>
                    <p className="text-sm text-muted-foreground">Applied on {applicant.appliedOn}</p>
                  </div>
                  <Badge>Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Research;