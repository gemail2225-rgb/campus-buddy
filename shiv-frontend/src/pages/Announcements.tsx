import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Megaphone, 
  Plus,
  Edit2,
  Trash2,
  MessageCircle,
  Send,
} from "lucide-react";

// Import API functions
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  addComment,
  type Announcement as ApiAnnouncement,
} from "@/api/clubApi";

// Local interface to match component's expected shape (can be adapted later)
interface Comment {
  id: string; // use string for backend IDs
  author: string;
  text: string;
  date: string;
}

interface Announcement {
  id: string;
  title: string;
  club: string;
  content: string;
  date: string;
  pinned: boolean;
  type: string;
  postedBy: string;
  views: number;
  priority: string;
  comments: Comment[];
}

// Helper to convert API announcement to component format
const fromApiAnnouncement = (api: ApiAnnouncement): Announcement => ({
  id: api._id,
  title: api.title,
  club: api.club?.name || "Club",
  content: api.content,
  date: new Date(api.createdAt).toLocaleDateString(),
  pinned: api.pinned,
  type: api.priority || "General", // map priority to type for UI (or you can separate)
  postedBy: api.club?.name || "Club",
  views: api.views,
  priority: api.priority,
  comments: api.comments?.map(c => ({
    id: c._id,
    author: c.user?.name || "User",
    text: c.text,
    date: new Date(c.date).toLocaleDateString(),
  })) || [],
});

const Announcements = () => {
  const { role } = useRole();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [commentText, setCommentText] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "General",
    priority: "Medium",
    pinned: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements on mount
  useEffect(() => {
    const loadAnnouncements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data.map(fromApiAnnouncement));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load announcements");
        toast({
          title: "Error",
          description: "Failed to load announcements",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadAnnouncements();
  }, [toast]);

  const handleCreateAnnouncement = async () => {
    try {
      setError(null);
      if (!formData.title.trim()) {
        setError("Title is required");
        return;
      }
      if (!formData.content.trim()) {
        setError("Content is required");
        return;
      }
      setIsLoading(true);
      const newApi = await createAnnouncement({
        title: formData.title,
        content: formData.content,
        pinned: formData.pinned,
        priority: formData.priority as 'Low' | 'Medium' | 'High',
      });
      // Convert and prepend
      setAnnouncements(prev => [fromApiAnnouncement(newApi), ...prev]);
      setFormData({ title: "", content: "", type: "General", priority: "Medium", pinned: false });
      setShowCreateDialog(false);
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

  const handleEditAnnouncement = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      pinned: announcement.pinned,
    });
    setSelectedAnnouncement(announcement);
    setShowEditDialog(true);
  };

  const handleUpdateAnnouncement = async () => {
    try {
      setError(null);
      if (!selectedAnnouncement) return;
      if (!formData.title.trim()) {
        setError("Title is required");
        return;
      }
      if (!formData.content.trim()) {
        setError("Content is required");
        return;
      }
      setIsLoading(true);
      const updatedApi = await updateAnnouncement(selectedAnnouncement.id, {
        title: formData.title,
        content: formData.content,
        pinned: formData.pinned,
        priority: formData.priority as 'Low' | 'Medium' | 'High',
      });
      // Update the list
      setAnnouncements(prev =>
        prev.map(a => a.id === updatedApi._id ? fromApiAnnouncement(updatedApi) : a)
      );
      setShowEditDialog(false);
      setSelectedAnnouncement(null);
      setFormData({ title: "", content: "", type: "General", priority: "Medium", pinned: false });
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update announcement");
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
      setAnnouncements(prev => prev.filter(a => a.id !== id));
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

  const handleAddComment = async (announcementId: string) => {
    if (!commentText.trim()) return;
    try {
      setIsLoading(true);
      const newComments = await addComment(announcementId, commentText);
      // Update comments in state
      setAnnouncements(prev =>
        prev.map(a =>
          a.id === announcementId
            ? {
                ...a,
                comments: newComments.map(c => ({
                  id: c._id,
                  author: c.user?.name || "User",
                  text: c.text,
                  date: new Date(c.date).toLocaleDateString(),
                })),
              }
            : a
        )
      );
      setCommentText("");
      setShowCommentDialog(false);
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinAnnouncement = (id: string) => {
    // Not directly supported by API; maybe implement via update
  };

  if (isLoading && announcements.length === 0) {
    return <div className="p-6 text-center">Loading announcements...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-2">
            {role === "club" 
              ? "Manage club announcements" 
              : "Stay updated with campus announcements"}
          </p>
        </div>
        
        {(role === "club" || role === "admin") && (
          <Button 
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => {
              setFormData({ title: "", content: "", type: "General", priority: "Medium", pinned: false });
              setShowCreateDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Announcements List */}
      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Announcements</h3>
              <p className="text-muted-foreground">No announcements yet</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        {announcement.pinned && (
                          <Badge className="bg-yellow-500">Pinned</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {announcement.club} • {announcement.date} • By {announcement.postedBy}
                      </p>
                    </div>

                    {(role === "club" || role === "admin") && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAnnouncement(announcement)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-700 dark:text-gray-300">{announcement.content}</p>

                  {/* Badges */}
                  <div className="flex gap-2">
                    <Badge variant="outline">{announcement.type}</Badge>
                    <Badge variant={announcement.priority === "High" ? "destructive" : "secondary"}>
                      {announcement.priority}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-3 border-t text-sm text-muted-foreground">
                    <span>{announcement.views} views</span>
                    <span>{announcement.comments.length} comments</span>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-3 pt-3 border-t">
                    {announcement.comments.map(comment => (
                      <div key={comment.id} className="bg-muted/50 p-3 rounded">
                        <p className="text-sm font-medium">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">{comment.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{comment.date}</p>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowCommentDialog(true);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Announcement Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          setSelectedAnnouncement(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
            <DialogDescription>
              {showEditDialog ? "Update announcement details" : "Post a new announcement"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter announcement content"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                >
                  <option>General</option>
                  <option>Important</option>
                  <option>Event</option>
                  <option>Recruitment</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinned"
                checked={formData.pinned}
                onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="pinned" className="text-sm">Pin this announcement</label>
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
              onClick={showEditDialog ? handleUpdateAnnouncement : handleCreateAnnouncement}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : (showEditDialog ? "Update" : "Post")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>

          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-brand-primary hover:bg-brand-primary/90"
              onClick={() => selectedAnnouncement && handleAddComment(selectedAnnouncement.id)}
              disabled={isLoading}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Posting..." : "Post Comment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Announcements;