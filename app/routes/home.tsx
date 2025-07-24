import type { Route } from "./+types/home";
import { Navigate } from "react-router";
import { useAuth } from "~/contexts/auth-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Call Center Management System" },
    { name: "description", content: "Welcome to Call Center Management System" },
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
}
