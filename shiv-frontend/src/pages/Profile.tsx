import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch"; // Added for toggle switches
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Briefcase,
  GraduationCap,
  Shield,
  Edit2,
  Save,
  X,
  Award,
  Clock,
  Users,
  Heart,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define proper types for mock user details
interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

interface StudentDetails {
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: string;
  semester: string;
  hostel: string;
  phone: string;
  dob: string;
  interests: string[];
  skills: string[];
  social: SocialLinks;
}

interface ProfessorDetails {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  qualification: string;
  experience: string;
  phone: string;
  cabin: string;
  interests: string[];
  publications: number;
  social: SocialLinks;
}

interface ClubDetails {
  name: string;
  email: string;
  club: string;
  position: string;
  department: string;
  year: string;
  phone: string;
  members: number;
  eventsOrganized: number;
  interests: string[];
  social: SocialLinks;
}

interface AdminDetails {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: string;
  phone: string;
  cabin: string;
  permissions: string[];
  joinedDate: string;
  social: SocialLinks;
}

// Union type for all possible user details
type UserDetails = StudentDetails | ProfessorDetails | ClubDetails | AdminDetails;

// Mock user details with proper typing
const mockUserDetails: Record<string, UserDetails> = {
  student: {
    name: "Rahul Sharma",
    email: "rahul.sharma@campus.edu",
    rollNo: "CS21001",
    department: "Computer Science",
    year: "3rd Year",
    semester: "6th Semester",
    hostel: "Hostel A, Room 204",
    phone: "+91 98765 43210",
    dob: "2003-05-15",
    interests: ["Web Development", "AI/ML", "Open Source"],
    skills: ["React", "Node.js", "Python", "TypeScript"],
    social: {
      github: "github.com/rahulsharma",
      linkedin: "linkedin.com/in/rahulsharma",
      twitter: "twitter.com/rahulsharma"
    }
  },
  professor: {
    name: "Dr. Anjali Verma",
    email: "anjali.verma@campus.edu",
    employeeId: "FAC2101",
    department: "Computer Science",
    designation: "Associate Professor",
    qualification: "Ph.D. in Computer Science (IIT Delhi)",
    experience: "12 years",
    phone: "+91 98765 43211",
    cabin: "CS Block, Room 305",
    interests: ["Algorithms", "Machine Learning", "Data Structures"],
    publications: 24,
    social: {
      github: "github.com/anjaliVerma",
      linkedin: "linkedin.com/in/anjali-verma",
      twitter: "twitter.com/anjali_verma"
    }
  },
  club: {
    name: "Arjun Singh",
    email: "arjun.singh@campus.edu",
    club: "Programming Club",
    position: "Coordinator",
    department: "Computer Science",
    year: "4th Year",
    phone: "+91 98765 43212",
    members: 45,
    eventsOrganized: 12,
    interests: ["Competitive Programming", "Web Dev", "Community Building"],
    social: {
      github: "github.com/arjunsingh",
      linkedin: "linkedin.com/in/arjunsingh",
      twitter: "twitter.com/arjunsingh"
    }
  },
  admin: {
    name: "Admin User",
    email: "admin@campus.edu",
    employeeId: "ADM001",
    department: "Administration",
    role: "System Administrator",
    phone: "+91 98765 43213",
    cabin: "Admin Block, Room 101",
    permissions: ["Full Access", "User Management", "Analytics"],
    joinedDate: "2024-01-01",
    social: {
      github: "github.com/admin",
      linkedin: "linkedin.com/in/admin",
      twitter: "twitter.com/admin"
    }
  }
};

const Profile = () => {
  const { user } = useAuth();
  const { role } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Get user data based on role, fallback to student if role not found
  const userData = mockUserDetails[role as keyof typeof mockUserDetails] || mockUserDetails.student;

  const getRoleIcon = () => {
    switch(role) {
      case "student": return <GraduationCap className="h-5 w-5" />;
      case "professor": return <BookOpen className="h-5 w-5" />;
      case "club": return <Users className="h-5 w-5" />;
      case "admin": return <Shield className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = () => {
    switch(role) {
      case "student": return "from-blue-500 to-cyan-500";
      case "professor": return "from-emerald-500 to-green-500";
      case "club": return "from-amber-500 to-orange-500";
      case "admin": return "from-red-500 to-orange-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Type guard functions
  const isStudent = (data: UserDetails): data is StudentDetails => {
    return 'rollNo' in data;
  };

  const isProfessor = (data: UserDetails): data is ProfessorDetails => {
    return 'employeeId' in data && 'publications' in data;
  };

  const isClub = (data: UserDetails): data is ClubDetails => {
    return 'club' in data && 'members' in data;
  };

  const isAdmin = (data: UserDetails): data is AdminDetails => {
    return 'permissions' in data;
  };

  return (
    <div className="space-y-8">
      {/* Header with Cover Photo */}
      <div className="relative h-48 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#fb923c] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
            <AvatarFallback className={`text-4xl font-bold bg-gradient-to-br ${getRoleColor()} text-white`}>
              {getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
          <div className="mb-4 text-white">
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <p className="flex items-center gap-2 mt-1">
              {getRoleIcon()}
              <span className="capitalize">{role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Edit Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "destructive" : "default"}
                className={isEditing ? "" : "bg-[#1E40AF] hover:bg-[#1E3A8A]"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#1E40AF]" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      {isEditing ? (
                        <Input defaultValue={userData.name} className="mt-1" />
                      ) : (
                        <p className="font-medium">{userData.name}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      {isEditing ? (
                        <Input defaultValue={userData.email} className="mt-1" />
                      ) : (
                        <p className="font-medium">{userData.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      {isEditing ? (
                        <Input defaultValue={userData.phone} className="mt-1" />
                      ) : (
                        <p className="font-medium">{userData.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                      {isEditing ? (
                        <Input type="date" defaultValue={(userData as any).dob || ""} className="mt-1" />
                      ) : (
                        <p className="font-medium">{(userData as any).dob || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Role-specific fields */}
                  {isStudent(userData) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Roll Number</Label>
                        <p className="font-medium">{userData.rollNo}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Department</Label>
                        <p className="font-medium">{userData.department}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Year</Label>
                        <p className="font-medium">{userData.year}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Semester</Label>
                        <p className="font-medium">{userData.semester}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Hostel</Label>
                        <p className="font-medium">{userData.hostel}</p>
                      </div>
                    </div>
                  )}

                  {isProfessor(userData) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Employee ID</Label>
                        <p className="font-medium">{userData.employeeId}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Department</Label>
                        <p className="font-medium">{userData.department}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Designation</Label>
                        <p className="font-medium">{userData.designation}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Qualification</Label>
                        <p className="font-medium">{userData.qualification}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Experience</Label>
                        <p className="font-medium">{userData.experience}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Cabin</Label>
                        <p className="font-medium">{userData.cabin}</p>
                      </div>
                    </div>
                  )}

                  {isClub(userData) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Club</Label>
                        <p className="font-medium">{userData.club}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Position</Label>
                        <p className="font-medium">{userData.position}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Department</Label>
                        <p className="font-medium">{userData.department}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Year</Label>
                        <p className="font-medium">{userData.year}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Members</Label>
                        <p className="font-medium">{userData.members}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Events Organized</Label>
                        <p className="font-medium">{userData.eventsOrganized}</p>
                      </div>
                    </div>
                  )}

                  {isAdmin(userData) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Employee ID</Label>
                        <p className="font-medium">{userData.employeeId}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Department</Label>
                        <p className="font-medium">{userData.department}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Role</Label>
                        <p className="font-medium">{userData.role}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Joined Date</Label>
                        <p className="font-medium">{userData.joinedDate}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Cabin</Label>
                        <p className="font-medium">{userData.cabin}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interests & Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#f59e0b]" />
                    Interests & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(userData as any).interests?.map((interest: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-amber-100 text-[#f59e0b] dark:bg-amber-950">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(userData as any).skills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {isProfessor(userData) && (
                    <div>
                      <Label className="text-sm font-medium">Publications</Label>
                      <p className="text-2xl font-bold text-[#059669] mt-1">{userData.publications}</p>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Social Links</Label>
                    <div className="space-y-2 mt-2">
                      {userData.social?.github && (
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <a href={`https://${userData.social.github}`} className="text-sm text-[#1E40AF] hover:underline" target="_blank" rel="noopener noreferrer">
                            {userData.social.github}
                          </a>
                        </div>
                      )}
                      {userData.social?.linkedin && (
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-muted-foreground" />
                          <a href={`https://${userData.social.linkedin}`} className="text-sm text-[#1E40AF] hover:underline" target="_blank" rel="noopener noreferrer">
                            {userData.social.linkedin}
                          </a>
                        </div>
                      )}
                      {userData.social?.twitter && (
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-muted-foreground" />
                          <a href={`https://${userData.social.twitter}`} className="text-sm text-[#1E40AF] hover:underline" target="_blank" rel="noopener noreferrer">
                            {userData.social.twitter}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Changes Button (when editing) */}
            {isEditing && (
              <div className="flex justify-end">
                <Button className="bg-[#059669] hover:bg-[#047857]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                        <Clock className="h-4 w-4 text-[#1E40AF]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {role === "student" && "Submitted a grievance"}
                          {role === "professor" && "Posted research internship"}
                          {role === "club" && "Created new event"}
                          {role === "admin" && "Modified user permissions"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                      <Badge variant="outline">View</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push notifications</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Grievance updates</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Internship alerts</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile visibility</span>
                      <select className="border rounded-md px-2 py-1 bg-background">
                        <option>Public</option>
                        <option>Private</option>
                        <option>Campus Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600">Danger Zone</h3>
                  <Button variant="destructive">Deactivate Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;