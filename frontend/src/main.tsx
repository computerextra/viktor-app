import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import Layout from "./Layout";
import Home from "./Pages/Home";
import "./style.css";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
