import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("login", "routes/login.tsx"),
  route("provider", "routes/provider.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
