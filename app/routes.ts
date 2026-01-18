import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route("/", "routes/App.tsx", [
    index("routes/dashboard.tsx"),
    route("login", "routes/login.tsx"),
    // route("dashboard", "routes/dashboard.tsx"),
    route("new-entry", "routes/new-entry.tsx"),
    route("debt-management", "routes/debt-management.tsx"),
    route("family-circle", "routes/family-circle.tsx"),
    route("test", "routes/test.tsx"),
    route("*", "routes/_.tsx"),
  ]),
] satisfies RouteConfig;
