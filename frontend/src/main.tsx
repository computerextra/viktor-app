import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import Layout from "./Layout";
import Einkauf from "./Pages/Einkauf";
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
          <Route path="Einkauf">
            <Route index element={<Einkauf />} />
          </Route>
          <Route path="Mitarbeiter">
            <Route index element={<>Mitarbeiter</>} />
          </Route>
          <Route path="Lieferanten">
            <Route index element={<>Lieferanten</>} />
          </Route>
          <Route path="Formulare">
            <Route index element={<>Formulare</>} />
          </Route>
          <Route path="Archiv">
            <Route index element={<>Archiv</>} />
          </Route>
          <Route path="Kunden">
            <Route index element={<>Kunden</>} />
          </Route>
          <Route path="Warenlieferung">
            <Route index element={<>Warenlieferung</>} />
          </Route>
          <Route path="CMS">
            <Route index element={<>CMS</>} />
          </Route>
          <Route path="SN">
            <Route index element={<>SN</>} />
          </Route>
          <Route path="Info">
            <Route index element={<>Info</>} />
          </Route>
          <Route path="Label">
            <Route index element={<>Label</>} />
          </Route>
          <Route path="Aussteller">
            <Route index element={<>Aussteller</>} />
          </Route>
          <Route path="Versand">
            <Route index element={<>Versand</>} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
