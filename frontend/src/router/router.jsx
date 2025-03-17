import { createBrowserRouter, Outlet } from "react-router-dom";
import { Layout } from "../Component/Layout/Layout";
import { routes } from "./routeList";

const AppLayout = () => {
  console.log("Rendering AppLayout");
  return (
    <>
      <Layout />
      <Outlet />
    </>
  );
};

const routerConfig = [
  {
    element: <AppLayout />,
    children: routes.map((route) => {
      console.log("Adding route:", route.path);
      return {
        path: route.path,
        element: route.element,
        children: route.children || [], 
      };
    }),
  },
];

const router = createBrowserRouter(routerConfig);

console.log("Router configuration initialized:", routerConfig);

export default router;
