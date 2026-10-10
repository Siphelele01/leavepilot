export type Role = "employee" | "manager" | "hr";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export const ROLE_HOME: Record<Role, string> = {
  employee: "/employee",
  manager: "/manager",
  hr: "/hr",
};

export const ROLE_LOGIN: Record<Role, string> = {
  employee: "/",
  manager: "/manager/login",
  hr: "/hr/login",
};

export const ROLE_LABEL: Record<Role, string> = {
  employee: "Employee",
  manager: "Manager / Supervisor",
  hr: "HR Administrator",
};