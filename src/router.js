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
      path: "/recipes",
      name: "recipes",
      component: () => import("./views/RecipeList.vue"),
    },
    {
      path: "/recipe/:id",
      name: "editRecipe",
      props: true,
      component: () => import("./views/EditRecipe.vue"),
    },
    {
      path: "/ingredients",
      name: "ingredients",
      component: () => import("./views/IngredientList.vue"),
    },
  ],
});

export default router;
