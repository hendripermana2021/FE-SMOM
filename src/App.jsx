import React, { Suspense, lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import SmoothScroll from "smooth-scroll";
import Loader from "./layouts/loader/Loader.js";

import LandingPage from "./pages/landingpages.jsx";
import Login from "./pages/Login.jsx";
import ClassTable from "./views/ui/ClassTabel.jsx";

/****Layouts*****/
const FullLayout = lazy(() => import("./layouts/FullLayout.js"));

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

/***** Pages ****/
const Starter = lazy(() => import("./views/Starter.jsx"));
const SiswaTables = lazy(() => import("./views/ui/SiswaTabel.jsx"));
const ModulTables = lazy(() => import("./views/ui/ModulTabel.js"));
const GuruTables = lazy(() => import("./views/ui/GuruTabel.js"));

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "", element: <Navigate to="/landing" /> },
      { path: "dashboard", element: <Navigate to="/starter" /> },
      { path: "starter", element: <Starter /> },
      { path: "modul", element: <ModulTables /> },
      { path: "kelas", element: <ClassTable /> },
      { path: "siswa", element: <SiswaTables /> },
      { path: "guru", element: <GuruTables /> },
      { path: "post", element: <SiswaTables /> },
    ],
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

// Initialize smooth scroll
const App = () => {
  const routing = useRoutes(ThemeRoutes);

  return (
    <Suspense fallback={<Loader />}>
      <div className="dark">{routing}</div>
    </Suspense>
  );
};

export default App;
