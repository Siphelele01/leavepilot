import type { ReactNode } from "react";
import { Redirect, Route, Switch } from "wouter";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { ROLE_HOME, ROLE_LOGIN, type Role } from "./types";

// Only lets the right role into a dashboard.
// Not signed in -> sent to that role's own login page.
function Protected({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!user) return <Redirect to={ROLE_LOGIN[role]} />;
  if (user.role !== role) return <Redirect to={ROLE_HOME[user.role]} />;
  return <>{children}</>;
}

// Shows a login page. If already signed in with the SAME role, skip to the dashboard.
function LoginRoute({ role }: { role: Role }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (user && user.role === role) return <Redirect to={ROLE_HOME[role]} />;
  return <LoginPage role={role} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        {/* Login pages */}
        <Route path="/"><LoginRoute role="employee" /></Route>
        <Route path="/manager/login"><LoginRoute role="manager" /></Route>
        <Route path="/hr/login"><LoginRoute role="hr" /></Route>

        {/* Dashboards */}
        <Route path="/employee">
          <Protected role="employee"><DashboardPage role="employee" /></Protected>
        </Route>
        <Route path="/manager">
          <Protected role="manager"><DashboardPage role="manager" /></Protected>
        </Route>
        <Route path="/hr">
          <Protected role="hr"><DashboardPage role="hr" /></Protected>
        </Route>

        <Route><Redirect to="/" /></Route>
      </Switch>
    </AuthProvider>
  );
}