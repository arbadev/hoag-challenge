import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/home", "routes/dashboard/home.tsx"),
  route("dashboard/queue", "routes/dashboard/queue.tsx"),
  route("dashboard/agents", "routes/dashboard/agents.tsx"),
  route("dashboard/analytics", "routes/dashboard/analytics.tsx"),
] satisfies RouteConfig;
