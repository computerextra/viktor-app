import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import "./index.css";
import Layout from "./Layout";
import Archiv from "./Pages/Archiv";
import Eingabe from "./Pages/Einkauf/Eingabe";
import Einkauf from "./Pages/Einkauf/Einkauf";
import Home from "./Pages/Home";
import Kundensuche from "./Pages/Kundensuche";
import CmsOverview from "./Pages/CRM/Overview";
import AbteilungOverview from "./Pages/CRM/Abteilung/Overview";
import AngeboteOverview from "./Pages/CRM/Angebote/Overview";
import MitarbeiterOverview from "./Pages/CRM/Mitarbeiter/Overview";
import JobOverview from "./Pages/CRM/Jobs/Overview";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Einkauf">
            <Route index element={<Einkauf />} />
            <Route path=":id" element={<Eingabe />} />
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
            <Route index element={<Archiv />} />
          </Route>
          <Route path="Kunden">
            <Route index element={<Kundensuche />} />
          </Route>
          <Route path="Warenlieferung">
            <Route index element={<>Warenlieferung</>} />
          </Route>
          <Route path="CMS">
            <Route index element={<CmsOverview />} />
            <Route path="Abteilungen">
              <Route index element={<AbteilungOverview />} />
            </Route>
            <Route path="Angebote">
              <Route index element={<AngeboteOverview />} />
            </Route>
            <Route path="Mitarbeiter">
              <Route index element={<MitarbeiterOverview />} />
            </Route>
            <Route path="Jobs">
              <Route index element={<JobOverview />} />
            </Route>
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
  </StrictMode>,
);
