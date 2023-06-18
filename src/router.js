import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("./views/UserDashboard.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("./views/AdminDashboard.vue"),
    },
    {
      path: "/destinations",
      name: "destinations",
      component: () => import("./views/Destinations.vue"),
    },
    {
      path: "/destinations/:id",
      name: "destination",
      component: () => import("./views/Destination.vue"),
    },
    {
      path: "/userdestination/:id",
      name: "userdestination",
      component: () => import("./views/UserDestination.vue"),
    },
    {
      path: "/user-trips",
      name: "user-trips",
      component: () => import("./views/MyTrips.vue"),
    },
    {
      path: "/plan-details/:planId/destination/:id",
      name: "plan-details",
      component: () => import("./views/PlanDetails.vue"),
    },
  ],
});

export default router;
