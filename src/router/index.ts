import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";
import { isLoggedin } from "@/use/useAuth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Home",
    component: Login,
  },
  {
    path: "/",
    name: "",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
    meta: {
      isLoginRequired: true,
    },
  },
  {
    path: "/notes/:id",
    name: "notes-edit",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
    meta: {
      isLoginRequired: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.isLoginRequired && isLoggedin.value) {
    next();
    return
  }else if(to.path !== "/login") {
    next("/login");
  }else {
    next()
  }
});

export default router;
