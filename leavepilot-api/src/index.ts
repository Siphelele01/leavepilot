import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type Role = "employee" | "manager" | "hr";
type User = { id: number; name: string; email: string; role: Role; passwordHash: string };

const JWT_SECRET = "dev-only-change-me";

// Temporary demo users. We will replace this with the database.
const users: User[] = [
  { id: 1, name: "Employee Demo", email: "employee@company.co.za", role: "employee", passwordHash: bcrypt.hashSync("Employee@123", 10) },
  { id: 2, name: "Manager Demo", email: "manager@company.co.za", role: "manager", passwordHash: bcrypt.hashSync("Manager@123", 10) },
  { id: 3, name: "HR Demo", email: "hr@company.co.za", role: "hr", passwordHash: bcrypt.hashSync("HR@12345", 10) },
];

const publicUser = (u: User) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "OK, the API is running" });
});

app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").toLowerCase().trim();
  const password = String(req.body?.password ?? "");
  const portal = String(req.body?.portal ?? ""); // which login page was used

  const user = users.find((u) => u.email === email);
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !valid) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }

  if (portal && user.role !== portal) {
    return res.status(403).json({ error: "This account cannot sign in on this page. Please use your own login page." });
  }

  const token = jwt.sign({ sub: String(user.id), role: user.role }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, user: publicUser(user) });
});

app.get("/auth/me", (req, res) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const user = users.find((u) => u.id === Number(payload.sub));
    if (!user) throw new Error("no user");
    res.json({ user: publicUser(user) });
  } catch {
    res.status(401).json({ error: "Not signed in" });
  }
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));