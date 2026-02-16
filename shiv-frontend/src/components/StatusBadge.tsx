import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "Pending" | "In Review" | "In Progress" | "Resolved" | "Open" | "Deadline Soon" | "Closed" | "Lost" | "Found";

const statusStyles: Record<StatusType, string> = {
  Pending: "bg-yellow-500 text-white hover:bg-yellow-600",
  "In Review": "bg-blue-500 text-white hover:bg-blue-600",
  "In Progress": "bg-amber-500 text-white hover:bg-amber-600",
  Resolved: "bg-green-500 text-white hover:bg-green-600",
  Open: "bg-green-500 text-white hover:bg-green-600",
  "Deadline Soon": "bg-orange-500 text-white hover:bg-orange-600",
  Closed: "bg-gray-500 text-white hover:bg-gray-600",
  Lost: "bg-red-500 text-white hover:bg-red-600",
  Found: "bg-emerald-500 text-white hover:bg-emerald-600",
};

const StatusBadge = ({ status }: { status: StatusType }) => {
  return (
    <Badge className={cn("border-0 font-semibold", statusStyles[status])}>
      {status}
    </Badge>
  );
};

export default StatusBadge;