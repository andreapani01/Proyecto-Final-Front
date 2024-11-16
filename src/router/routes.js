const routes = [
  {
    path: "/",
    component: () => import("src/components/auth/LoginForm.vue"),
  },
  {
    path: "/informes",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/InformesPage.vue"),

        path: "report",
        component: () => import("pages/ReportPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
