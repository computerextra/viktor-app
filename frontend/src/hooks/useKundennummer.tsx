import { KundenFormularSuche } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";

export const useKundennummer = async (
  Kundennummer: string
): Promise<main.FormularKunde | null> => {
  const res = await KundenFormularSuche(Kundennummer);
  if (res == null) return null;
  return res;
};
