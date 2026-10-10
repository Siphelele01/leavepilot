import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { ROLE_LABEL, ROLE_LOGIN, type Role } from "../types";

const SECTIONS: Record<Role, { title: string; text: string }[]> = {
  employee: [
    { title: "My leave balance", text: "See your available leave" },
    { title: "Request leave", text: "Submit a new leave request" },
    { title: "My requests", text: "Track status and history" },
    { title: "My payslips", text: "View and download payslips" },
  ],
  manager: [
    { title: "Pending approvals", text: "Approve or decline team requests" },
    { title: "Team calendar", text: "See approved team leave" },
    { title: "Request staff", text: "Submit a staffing request" },
  ],
  hr: [
    { title: "Employees", text: "Manage users and roles" },
    { title: "Leave types & balances", text: "Configure rules and adjust balances" },
    { title: "Reports", text: "Leave reports and exports" },
    { title: "Staff requests", text: "Review staffing requests" },
    { title: "Payslips & payroll", text: "Payroll Phase 1" },
    { title: "Audit log", text: "Review sensitive actions" },
  ],
};

export default function DashboardPage({ role }: { role: Role }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="dash">
      <header className="dash-header">
        <div>
          <h1>{ROLE_LABEL[role]} dashboard</h1>
          <p className="muted">Signed in as {user?.name} ({user?.email})</p>
        </div>
        <button
          className="secondary"
          onClick={() => {
            logout();
            navigate(ROLE_LOGIN[role]);
          }}
        >
          Sign out
        </button>
      </header>

      <div className="grid">
        {SECTIONS[role].map((s) => (
          <div className="tile" key={s.title}>
            <h3>{s.title}</h3>
            <p className="muted">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}