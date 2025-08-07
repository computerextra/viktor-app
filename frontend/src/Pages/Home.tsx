import Geburtstagsliste from "@/components/Geburtstagsliste";

export default function Home() {
  return (
    <div className="panel">
      <div className="panel-label">Start</div>
      <div className="mt-1 p-1">
        <h1>Willkommen auf Viktor (Der App)</h1>
        <p>
          Die Funktionen sind wie auf der Seite, nur halt als App (und in einem
          anderen Design)
        </p>
        <Geburtstagsliste />
      </div>
    </div>
  );
}
