import { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users as UsersIcon,
  Search,
  MoreVertical,
  Shield,
  GraduationCap,
  BookOpen,
  Download,
  Plus,
  Eye,
  Edit2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  department?: string;
  year?: string;
  designation?: string;
  club?: string;
  position?: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@campus.edu",
    role: "student",
    department: "Computer Science",
    year: "3rd Year",
    status: "active",
    lastActive: "2026-02-14",
  },
  {
    id: 2,
    name: "Dr. Anjali Verma",
    email: "anjali.verma@campus.edu",
    role: "professor",
    department: "Computer Science",
    designation: "Associate Professor",
    status: "active",
    lastActive: "2026-02-14",
  },
  {
    id: 3,
    name: "Arjun Singh",
    email: "arjun.singh@campus.edu",
    role: "club",
    club: "Programming Club",
    position: "Coordinator",
    status: "active",
    lastActive: "2026-02-13",
  },
  {
    id: 4,
    name: "Priya Patel",
    email: "priya.patel@campus.edu",
    role: "student",
    department: "Electronics",
    year: "2nd Year",
    status: "active",
    lastActive: "2026-02-14",
  },
  {
    id: 5,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@campus.edu",
    role: "professor",
    department: "Physics",
    designation: "Professor",
    status: "inactive",
    lastActive: "2026-02-10",
  },
  {
    id: 6,
    name: "Neha Gupta",
    email: "neha.gupta@campus.edu",
    role: "student",
    department: "Mathematics",
    year: "4th Year",
    status: "active",
    lastActive: "2026-02-14",
  },
  {
    id: 7,
    name: "Vikram Mehta",
    email: "vikram.mehta@campus.edu",
    role: "club",
    club: "Robotics Club",
    position: "Secretary",
    status: "active",
    lastActive: "2026-02-12",
  },
];

const roleColors = {
  student: "bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20",
  professor: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300",
  club: "bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20",
  admin: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300",
};

const roleIcons = {
  student: GraduationCap,
  professor: BookOpen,
  club: UsersIcon,
  admin: Shield,
};

const Users = () => {
  const { role } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", status: "active" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not admin
  if (role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-brand-secondary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              This section is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setShowProfileDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({ email: user.email, status: user.status });
    setShowEditDialog(true);
  };

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user);
    setShowSuspendDialog(true);
  };

  const confirmSuspend = () => {
    try {
      if (!selectedUser) return;
      setShowSuspendDialog(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend user");
    }
  };

  const updateUser = () => {
    try {
      setError(null);
      if (!selectedUser || !editForm.email.trim()) {
        setError("Email is required");
        return;
      }
      setShowEditDialog(false);
      setSelectedUser(null);
      setEditForm({ email: "", status: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoleFilter = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRoleFilter;
  });

  const stats = {
    total: mockUsers.length,
    students: mockUsers.filter(u => u.role === "student").length,
    professors: mockUsers.filter(u => u.role === "professor").length,
    clubs: mockUsers.filter(u => u.role === "club").length,
    active: mockUsers.filter(u => u.status === "active").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all users and permissions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-primary/10 dark:bg-brand-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-brand-primary font-medium">Students</p>
            <p className="text-2xl font-bold text-brand-primary mt-1">{stats.students}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">Professors</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.professors}</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-secondary/10 dark:bg-brand-secondary/20">
          <CardContent className="p-4">
            <p className="text-sm text-brand-secondary font-medium">Clubs</p>
            <p className="text-2xl font-bold text-brand-secondary mt-1">{stats.clubs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Now</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "student", "professor", "club"].map((r) => (
                <Button
                  key={r}
                  variant={selectedRole === r ? "default" : "outline"}
                  onClick={() => setSelectedRole(r)}
                  className={selectedRole === r ? "bg-brand-primary" : ""}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department/Club</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role as keyof typeof roleIcons];
                
                return (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={roleColors[user.role as keyof typeof roleColors]}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <RoleIcon className="h-3 w-3" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.role === "student" && `${user.department}, ${user.year}`}
                      {user.role === "professor" && `${user.department}`}
                      {user.role === "club" && `${user.club}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"} 
                             className={user.status === "active" ? "bg-green-600" : ""}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleSuspendUser(user)}
                            className="text-red-600"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className={roleColors[selectedUser.role as keyof typeof roleColors]}>
                    {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <Badge className="mt-2">
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                {selectedUser.role === "student" && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{selectedUser.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Year</p>
                      <p className="font-medium">{selectedUser.year}</p>
                    </div>
                  </>
                )}
                {selectedUser.role === "professor" && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{selectedUser.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Designation</p>
                      <p className="font-medium">{selectedUser.designation}</p>
                    </div>
                  </>
                )}
                {selectedUser.role === "club" && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Club</p>
                      <p className="font-medium">{selectedUser.club}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Position</p>
                      <p className="font-medium">{selectedUser.position}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedUser.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Active</p>
                  <p className="font-medium">{selectedUser.lastActive}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm({...editForm, status: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={updateUser} className="bg-brand-primary hover:bg-brand-primary/90">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Suspend User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend <span className="font-semibold">{selectedUser?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            The user will no longer be able to access the platform until they are reinstated.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmSuspend}>Suspend User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;