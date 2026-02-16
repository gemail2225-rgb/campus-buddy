import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const grievanceData = [
  { category: "Hostel", count: 12 },
  { category: "Academics", count: 8 },
  { category: "Mess", count: 15 },
  { category: "Infrastructure", count: 6 },
];

const lostFoundData = [
  { name: "Lost", value: 18 },
  { name: "Found", value: 14 },
  { name: "Resolved", value: 10 },
];

const COLORS = ["hsl(0, 84%, 60%)", "hsl(142, 71%, 45%)", "hsl(215, 16%, 47%)"];

const Analytics = () => {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Analytics</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Resolution Rate</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">67%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Grievances</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">41</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Grievances by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={grievanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(222.2, 47.4%, 11.2%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Lost vs Found Items</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={lostFoundData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {lostFoundData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
