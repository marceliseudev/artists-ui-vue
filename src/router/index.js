import Vue from "vue";
import Router from "vue-router";
import IAM from "@/IAM";
import store from "../store";

// Containers
const TheContainer = () => import("@/containers/TheContainer");

// Views
const Artists = () => import("@/views/Artists");
const Albums = () => import("@/views/Albums");
const Login = () => import("@/views/security/Login");
const Register = () => import("@/views/security/Register");
const ResetPassword = () => import("@/views/security/ResetPassword");
const ChangeEmail = () => import("@/views/security/ChangeEmail");
const ChangePassword = () => import("@/views/security/ChangePassword");
const UserAction = () => import("@/views/security/UserAction");
const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");

const router = new Router({
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes(),
});

Vue.use(Router);

router.beforeEach(async (to, from, next) => {
  let currentUser = await IAM.getCurrentUser(); // wait firebase
  let isAdmin = await IAM.hasRole("admin");
  await store.dispatch("updateUserAmdin", isAdmin);

  let requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("/login");
  else next();
});

function configRoutes() {
  return [
    {
      path: "/",
      redirect: "/artists",
      name: "Home",
      component: TheContainer,
      children: [
        {
          path: "login",
          name: "Login",
          component: Login,
          meta: { requiresAuth: false },
        },
        {
          path: "register",
          name: "Register",
          component: Register,
          meta: { requiresAuth: false },
        },
        {
          path: "resetpassword",
          name: "ResetPassword",
          component: ResetPassword,
          meta: { requiresAuth: false },
        },
        {
          path: "changeemail",
          name: "ChangeEmail",
          component: ChangeEmail,
          meta: { requiresAuth: true },
        },
        {
          path: "changepassword",
          name: "ChangePassword",
          component: ChangePassword,
          meta: { requiresAuth: true },
        },
        {
          path: "useraction",
          name: "UserAction",
          component: UserAction,
          meta: { requiresAuth: false },
        },
        {
          path: "artists",
          name: "Artists",
          component: Artists,
          meta: { requiresAuth: true },
        },
        {
          path: "albums",
          name: "Albums",
          component: Albums,
          meta: { requiresAuth: true },
          props: true,
        },
      ],
    },
    {
      path: "/page500",
      name: "Page500",
      component: Page500,
      meta: { requiresAuth: false },
    },
    {
      path: "*",
      name: "Page404",
      component: Page404,
      meta: { requiresAuth: false },
    },
  ];
}

export default router;
