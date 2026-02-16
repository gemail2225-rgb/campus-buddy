import { useState } from "react";
import { initialLostFound } from "@/data/mockData";
import { LostFoundItem } from "@/types/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Phone } from "lucide-react";

type Filter = "All" | "Lost" | "Found" | "My Posts";

const LostFound = () => {
  const [items, setItems] = useState<LostFoundItem[]>(initialLostFound);
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "Lost" as "Lost" | "Found", location: "", contact: "" });

  const handlePost = () => {
    if (!form.title.trim()) return;
    const newItem: LostFoundItem = {
      id: `lf${Date.now()}`,
      ...form,
      status: form.type,
      postedBy: "current-user",
      date: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    setForm({ title: "", description: "", type: "Lost", location: "", contact: "" });
    setOpen(false);
  };

  const filtered = items.filter((item) => {
    if (filter === "All") return true;
    if (filter === "My Posts") return item.postedBy === "current-user";
    return item.type === filter;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Lost & Found</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Post Item</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Post Lost/Found Item</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "Lost" | "Found" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lost">Lost</SelectItem>
                  <SelectItem value="Found">Found</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input placeholder="Contact Info" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <DialogFooter><Button onClick={handlePost}>Post</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex gap-2">
        {(["All", "Lost", "Found", "My Posts"] as Filter[]).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <StatusBadge status={item.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{item.description}</p>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{item.location}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{item.contact}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LostFound;
