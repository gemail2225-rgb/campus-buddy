

#campus Buddy – Unified Campus Platform (Frontend MVP)

A clean, demo-ready campus dashboard with role-based views, mock data, and local state only. No backend needed.

---

## 1. App Shell & Layout
- **Left sidebar** with navigation links: Dashboard, Grievances, Internships, Lost & Found, Academics (Student only), Analytics (Admin only)
- **Top navbar** with "AEGIS" branding, notification bell (with red badge count), and a **Role Switcher** dropdown (Student / Authority / Admin)
- Role is stored in React context and dynamically controls which sidebar items and page content are visible

## 2. Dashboard Page
- **Student view**: 4 summary cards – Active Grievances, New Internships, My Lost/Found Posts, Current GPA
- **Authority view**: 3 cards – Pending Grievances, Resolved Today, Category Breakdown
- **Admin view**: 4 cards – Total Users, Total Grievances, Resolution Rate, Total Lost/Found Posts
- All cards use static mock data

## 3. Grievance Module
- **Student**: "Submit Grievance" button opens a modal form (Title, Description, Category). Grievances stored in local state and displayed in a table with colored status badges (Pending/Red, In Review/Yellow, Resolved/Green)
- **Authority**: View all grievances, change status via dropdown, add comments, and see a simple update timeline

## 4. Internship Module
- Card-based listing with Title, Company, Type, Deadline, and status badges (Open, Deadline Soon, Closed)
- **Student**: "Mark as Applied" toggle on each card
- **Admin**: Simple form to add a new internship

## 5. Lost & Found Module
- Card layout with form to post items (Title, Description, Type, Location, Contact, optional image preview)
- Status badges: Lost (Red), Found (Green), Resolved (Grey)
- Filter buttons: All, Lost, Found, My Posts

## 6. Academics Page (Student Only)
- Read-only view with a course table, attendance percentages, GPA display, and resource links
- Static mock data

## 7. Analytics Page (Admin Only)
- Bar chart for grievances by category (using Recharts, already installed)
- Resolution rate display
- Lost vs Found item count visualization

## 8. Notifications
- Clicking the bell icon opens a dropdown with mock notifications (status updates, new internships, comments)

## Design Approach
- Minimal, professional aesthetic with soft shadows, rounded corners, consistent spacing
- Colored status badges throughout
- Responsive layout
- Reusable card and badge components built on existing shadcn/ui primitives

