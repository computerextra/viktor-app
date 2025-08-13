import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import "./index.css";
import Layout from "./Layout";
import Archiv from "./Pages/Archiv";
import EditAbteilung from "./Pages/CRM/Abteilung/id";
import NewAbteilung from "./Pages/CRM/Abteilung/neu";
import AbteilungOverview from "./Pages/CRM/Abteilung/Overview";
import EditAngebot from "./Pages/CRM/Angebote/id";
import NewAngebot from "./Pages/CRM/Angebote/neu";
import AngeboteOverview from "./Pages/CRM/Angebote/Overview";
import EditJob from "./Pages/CRM/Jobs/id";
import NewJob from "./Pages/CRM/Jobs/neu";
import JobOverview from "./Pages/CRM/Jobs/Overview";
import EditMitarbeiter from "./Pages/CRM/Mitarbeiter/id";
import NewMitarbeiter from "./Pages/CRM/Mitarbeiter/neu";
import { MitarbeiterOverview as CMSMitarbeiterOverview } from "./Pages/CRM/Mitarbeiter/Overview";
import CmsOverview from "./Pages/CRM/Overview";
import EditPartner from "./Pages/CRM/Partner/id";
import NewPartner from "./Pages/CRM/Partner/neu";
import PartnerOverview from "./Pages/CRM/Partner/Overview";
import Eingabe from "./Pages/Einkauf/Eingabe";
import Einkauf from "./Pages/Einkauf/Einkauf";
import Home from "./Pages/Home";
import Kundensuche from "./Pages/Kundensuche";
import MitarbeiterOverview from "./Pages/Mitarbeiter/Overview";
import Warenlieferung from "./Pages/Warenlieferung";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="Einkauf">
              <Route index element={<Einkauf />} />
              <Route path=":id" element={<Eingabe />} />
            </Route>
            <Route path="Mitarbeiter">
              <Route index element={<MitarbeiterOverview />} />
              <Route path=":id" element={<>Info</>} />
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
              <Route index element={<Warenlieferung />} />
            </Route>
            <Route path="CMS">
              <Route index element={<CmsOverview />} />
              <Route path="Abteilungen">
                <Route index element={<AbteilungOverview />} />
                <Route path="Neu" element={<NewAbteilung />} />
                <Route path=":id" element={<EditAbteilung />} />
              </Route>
              <Route path="Angebote">
                <Route index element={<AngeboteOverview />} />
                <Route path="Neu" element={<NewAngebot />} />
                <Route path=":id" element={<EditAngebot />} />
              </Route>
              <Route path="Mitarbeiter">
                <Route index element={<CMSMitarbeiterOverview />} />
                <Route path="Neu" element={<NewMitarbeiter />} />
                <Route path=":id" element={<EditMitarbeiter />} />
              </Route>
              <Route path="Jobs">
                <Route index element={<JobOverview />} />
                <Route path="Neu" element={<NewJob />} />
                <Route path=":id" element={<EditJob />} />
              </Route>
              <Route path="Partner">
                <Route index element={<PartnerOverview />} />
                <Route path="Neu" element={<NewPartner />} />
                <Route path=":id" element={<EditPartner />} />
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
      </ClerkProvider>
    </HashRouter>
  </StrictMode>
);
