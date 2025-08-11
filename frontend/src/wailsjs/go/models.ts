export namespace db {
	
	export class Abteilung {
	    ID: string;
	    Name: string;
	
	    static createFrom(source: any = {}) {
	        return new Abteilung(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	    }
	}
	export class Angebot {
	    ID: string;
	    Title: string;
	    Subtitle: sql.NullString;
	    // Go type: time
	    DateStart: any;
	    // Go type: time
	    DateStop: any;
	    Link: string;
	    Image: string;
	    Anzeigen: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Angebot(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Subtitle = this.convertValues(source["Subtitle"], sql.NullString);
	        this.DateStart = this.convertValues(source["DateStart"], null);
	        this.DateStop = this.convertValues(source["DateStop"], null);
	        this.Link = source["Link"];
	        this.Image = source["Image"];
	        this.Anzeigen = source["Anzeigen"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Ansprechpartner {
	    ID: string;
	    Name: string;
	    Telefon: sql.NullString;
	    Mobil: sql.NullString;
	    Mail: sql.NullString;
	    Lieferantid: string;
	
	    static createFrom(source: any = {}) {
	        return new Ansprechpartner(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Telefon = this.convertValues(source["Telefon"], sql.NullString);
	        this.Mobil = this.convertValues(source["Mobil"], sql.NullString);
	        this.Mail = this.convertValues(source["Mail"], sql.NullString);
	        this.Lieferantid = source["Lieferantid"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetCountRow {
	    Abteilungen: number;
	    Angebote: number;
	    Jobs: number;
	    Mitarbeiter: number;
	    Partner: number;
	
	    static createFrom(source: any = {}) {
	        return new GetCountRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Abteilungen = source["Abteilungen"];
	        this.Angebote = source["Angebote"];
	        this.Jobs = source["Jobs"];
	        this.Mitarbeiter = source["Mitarbeiter"];
	        this.Partner = source["Partner"];
	    }
	}
	export class GetEinkaufRow {
	    ID: string;
	    Name: string;
	    EinkaufID: sql.NullString;
	    Paypal: sql.NullBool;
	    Abonniert: sql.NullBool;
	    Geld: sql.NullString;
	    Pfand: sql.NullString;
	    Dinge: sql.NullString;
	    Abgeschickt: sql.NullTime;
	    Bild1: sql.NullString;
	    Bild2: sql.NullString;
	    Bild3: sql.NullString;
	
	    static createFrom(source: any = {}) {
	        return new GetEinkaufRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.EinkaufID = this.convertValues(source["EinkaufID"], sql.NullString);
	        this.Paypal = this.convertValues(source["Paypal"], sql.NullBool);
	        this.Abonniert = this.convertValues(source["Abonniert"], sql.NullBool);
	        this.Geld = this.convertValues(source["Geld"], sql.NullString);
	        this.Pfand = this.convertValues(source["Pfand"], sql.NullString);
	        this.Dinge = this.convertValues(source["Dinge"], sql.NullString);
	        this.Abgeschickt = this.convertValues(source["Abgeschickt"], sql.NullTime);
	        this.Bild1 = this.convertValues(source["Bild1"], sql.NullString);
	        this.Bild2 = this.convertValues(source["Bild2"], sql.NullString);
	        this.Bild3 = this.convertValues(source["Bild3"], sql.NullString);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetEinkaufslisteRow {
	    ID: string;
	    Name: string;
	    Dinge: sql.NullString;
	    Paypal: sql.NullBool;
	    Abonniert: sql.NullBool;
	    Geld: sql.NullString;
	    Pfand: sql.NullString;
	    Abgeschickt: sql.NullTime;
	    Bild1: sql.NullString;
	    Bild2: sql.NullString;
	    Bild3: sql.NullString;
	
	    static createFrom(source: any = {}) {
	        return new GetEinkaufslisteRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Dinge = this.convertValues(source["Dinge"], sql.NullString);
	        this.Paypal = this.convertValues(source["Paypal"], sql.NullBool);
	        this.Abonniert = this.convertValues(source["Abonniert"], sql.NullBool);
	        this.Geld = this.convertValues(source["Geld"], sql.NullString);
	        this.Pfand = this.convertValues(source["Pfand"], sql.NullString);
	        this.Abgeschickt = this.convertValues(source["Abgeschickt"], sql.NullTime);
	        this.Bild1 = this.convertValues(source["Bild1"], sql.NullString);
	        this.Bild2 = this.convertValues(source["Bild2"], sql.NullString);
	        this.Bild3 = this.convertValues(source["Bild3"], sql.NullString);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetMitarbeiterWithAbteilungRow {
	    ID: string;
	    Name: string;
	    Short: sql.NullString;
	    Sex: sql.NullString;
	    Focus: sql.NullString;
	    Mail: sql.NullString;
	    Abteilungid: sql.NullString;
	    AbteilungID: sql.NullString;
	    AbteilungName: sql.NullString;
	
	    static createFrom(source: any = {}) {
	        return new GetMitarbeiterWithAbteilungRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Short = this.convertValues(source["Short"], sql.NullString);
	        this.Sex = this.convertValues(source["Sex"], sql.NullString);
	        this.Focus = this.convertValues(source["Focus"], sql.NullString);
	        this.Mail = this.convertValues(source["Mail"], sql.NullString);
	        this.Abteilungid = this.convertValues(source["Abteilungid"], sql.NullString);
	        this.AbteilungID = this.convertValues(source["AbteilungID"], sql.NullString);
	        this.AbteilungName = this.convertValues(source["AbteilungName"], sql.NullString);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetOneMitarbeiterWithAbteilungRow {
	    ID: string;
	    Name: string;
	    Short: sql.NullString;
	    Sex: sql.NullString;
	    Focus: sql.NullString;
	    Mail: sql.NullString;
	    Abteilungid: sql.NullString;
	    AbteilungID: sql.NullString;
	    AbteilungName: sql.NullString;
	
	    static createFrom(source: any = {}) {
	        return new GetOneMitarbeiterWithAbteilungRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Short = this.convertValues(source["Short"], sql.NullString);
	        this.Sex = this.convertValues(source["Sex"], sql.NullString);
	        this.Focus = this.convertValues(source["Focus"], sql.NullString);
	        this.Mail = this.convertValues(source["Mail"], sql.NullString);
	        this.Abteilungid = this.convertValues(source["Abteilungid"], sql.NullString);
	        this.AbteilungID = this.convertValues(source["AbteilungID"], sql.NullString);
	        this.AbteilungName = this.convertValues(source["AbteilungName"], sql.NullString);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Job {
	    ID: string;
	    Name: string;
	    Online: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Job(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Online = source["Online"];
	    }
	}
	export class Lieferant {
	    ID: string;
	    Firma: string;
	    Kundennummer: sql.NullString;
	    Webseite: sql.NullString;
	
	    static createFrom(source: any = {}) {
	        return new Lieferant(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Firma = source["Firma"];
	        this.Kundennummer = this.convertValues(source["Kundennummer"], sql.NullString);
	        this.Webseite = this.convertValues(source["Webseite"], sql.NullString);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Mitarbeiter {
	    ID: string;
	    Name: string;
	    Short: sql.NullString;
	    Image: boolean;
	    Sex: sql.NullString;
	    Focus: sql.NullString;
	    Mail: sql.NullString;
	    Abteilungid: sql.NullString;
	    Einkaufid: sql.NullString;
	    Azubi: boolean;
	    Geburtstag: sql.NullTime;
	    Gruppenwahl: sql.NullString;
	    Homeoffice: sql.NullString;
	    MobilBusiness: sql.NullString;
	    MobilPrivat: sql.NullString;
	    TelefonBusiness: sql.NullString;
	    TelefonIntern1: sql.NullString;
	    TelefonIntern2: sql.NullString;
	    TelefonPrivat: sql.NullString;
	
	    static createFrom(source: any = {}) {
	        return new Mitarbeiter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Short = this.convertValues(source["Short"], sql.NullString);
	        this.Image = source["Image"];
	        this.Sex = this.convertValues(source["Sex"], sql.NullString);
	        this.Focus = this.convertValues(source["Focus"], sql.NullString);
	        this.Mail = this.convertValues(source["Mail"], sql.NullString);
	        this.Abteilungid = this.convertValues(source["Abteilungid"], sql.NullString);
	        this.Einkaufid = this.convertValues(source["Einkaufid"], sql.NullString);
	        this.Azubi = source["Azubi"];
	        this.Geburtstag = this.convertValues(source["Geburtstag"], sql.NullTime);
	        this.Gruppenwahl = this.convertValues(source["Gruppenwahl"], sql.NullString);
	        this.Homeoffice = this.convertValues(source["Homeoffice"], sql.NullString);
	        this.MobilBusiness = this.convertValues(source["MobilBusiness"], sql.NullString);
	        this.MobilPrivat = this.convertValues(source["MobilPrivat"], sql.NullString);
	        this.TelefonBusiness = this.convertValues(source["TelefonBusiness"], sql.NullString);
	        this.TelefonIntern1 = this.convertValues(source["TelefonIntern1"], sql.NullString);
	        this.TelefonIntern2 = this.convertValues(source["TelefonIntern2"], sql.NullString);
	        this.TelefonPrivat = this.convertValues(source["TelefonPrivat"], sql.NullString);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Partner {
	    ID: string;
	    Name: string;
	    Link: string;
	    Image: string;
	
	    static createFrom(source: any = {}) {
	        return new Partner(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Link = source["Link"];
	        this.Image = source["Image"];
	    }
	}
	export class SearchArchiveRow {
	    ID: number;
	    Title: string;
	
	    static createFrom(source: any = {}) {
	        return new SearchArchiveRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	    }
	}

}

export namespace main {
	
	export class AbteilungProps {
	    Name: string;
	
	    static createFrom(source: any = {}) {
	        return new AbteilungProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	    }
	}
	export class AngebotProps {
	    Title: string;
	    Subtitle?: string;
	    DateStart: string;
	    DateStop: string;
	    Link: string;
	    Image: string;
	    Anzeigen: boolean;
	
	    static createFrom(source: any = {}) {
	        return new AngebotProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Title = source["Title"];
	        this.Subtitle = source["Subtitle"];
	        this.DateStart = source["DateStart"];
	        this.DateStop = source["DateStop"];
	        this.Link = source["Link"];
	        this.Image = source["Image"];
	        this.Anzeigen = source["Anzeigen"];
	    }
	}
	export class AnsprechpartnerProps {
	    Name: string;
	    Telefon?: string;
	    Mobil?: string;
	    Mail?: string;
	    LieferantenId: string;
	
	    static createFrom(source: any = {}) {
	        return new AnsprechpartnerProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Telefon = source["Telefon"];
	        this.Mobil = source["Mobil"];
	        this.Mail = source["Mail"];
	        this.LieferantenId = source["LieferantenId"];
	    }
	}
	export class AusstellerProps {
	    Artikelnummer: string;
	    Link: string;
	
	    static createFrom(source: any = {}) {
	        return new AusstellerProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Artikelnummer = source["Artikelnummer"];
	        this.Link = source["Link"];
	    }
	}
	export class EinkaufUpdateProps {
	    MitarbeiterId: string;
	    Paypal: boolean;
	    Abonniert: boolean;
	    Dinge: string;
	    Geld?: string;
	    Pfand?: string;
	    Bild1?: string;
	    Bild2?: string;
	    Bild3?: string;
	
	    static createFrom(source: any = {}) {
	        return new EinkaufUpdateProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.MitarbeiterId = source["MitarbeiterId"];
	        this.Paypal = source["Paypal"];
	        this.Abonniert = source["Abonniert"];
	        this.Dinge = source["Dinge"];
	        this.Geld = source["Geld"];
	        this.Pfand = source["Pfand"];
	        this.Bild1 = source["Bild1"];
	        this.Bild2 = source["Bild2"];
	        this.Bild3 = source["Bild3"];
	    }
	}
	export class FormularKunde {
	    Kundennummer: string;
	    Name: string;
	    Vorname: string;
	
	    static createFrom(source: any = {}) {
	        return new FormularKunde(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Kundennummer = source["Kundennummer"];
	        this.Name = source["Name"];
	        this.Vorname = source["Vorname"];
	    }
	}
	export class Geburtstag {
	    Name: string;
	    Diff: number;
	    // Go type: time
	    Date: any;
	
	    static createFrom(source: any = {}) {
	        return new Geburtstag(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Diff = source["Diff"];
	        this.Date = this.convertValues(source["Date"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Geburtstagsliste {
	    Heute: Geburtstag[];
	    Zukunft: Geburtstag[];
	    Vergangen: Geburtstag[];
	
	    static createFrom(source: any = {}) {
	        return new Geburtstagsliste(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Heute = this.convertValues(source["Heute"], Geburtstag);
	        this.Zukunft = this.convertValues(source["Zukunft"], Geburtstag);
	        this.Vergangen = this.convertValues(source["Vergangen"], Geburtstag);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class InfoProps {
	    Mail: string;
	    Auftrag: string;
	
	    static createFrom(source: any = {}) {
	        return new InfoProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Mail = source["Mail"];
	        this.Auftrag = source["Auftrag"];
	    }
	}
	export class JobProps {
	    Name: string;
	    Online: boolean;
	
	    static createFrom(source: any = {}) {
	        return new JobProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Online = source["Online"];
	    }
	}
	export class KundenResponse {
	    SG_Adressen_PK: number;
	    Suchbegriff?: string;
	    KundNr?: string;
	    LiefNr?: string;
	    Homepage?: string;
	    Telefon1?: string;
	    Telefon2?: string;
	    Mobiltelefon1?: string;
	    Mobiltelefon2?: string;
	    EMail1?: string;
	    EMail2?: string;
	    KundUmsatz?: number;
	    LiefUmsatz?: number;
	
	    static createFrom(source: any = {}) {
	        return new KundenResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.SG_Adressen_PK = source["SG_Adressen_PK"];
	        this.Suchbegriff = source["Suchbegriff"];
	        this.KundNr = source["KundNr"];
	        this.LiefNr = source["LiefNr"];
	        this.Homepage = source["Homepage"];
	        this.Telefon1 = source["Telefon1"];
	        this.Telefon2 = source["Telefon2"];
	        this.Mobiltelefon1 = source["Mobiltelefon1"];
	        this.Mobiltelefon2 = source["Mobiltelefon2"];
	        this.EMail1 = source["EMail1"];
	        this.EMail2 = source["EMail2"];
	        this.KundUmsatz = source["KundUmsatz"];
	        this.LiefUmsatz = source["LiefUmsatz"];
	    }
	}
	export class LieferantenProps {
	    Firma: string;
	    Kundennummer?: string;
	    Webseite?: string;
	
	    static createFrom(source: any = {}) {
	        return new LieferantenProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Firma = source["Firma"];
	        this.Kundennummer = source["Kundennummer"];
	        this.Webseite = source["Webseite"];
	    }
	}
	export class LieferantenResponse {
	    Lieferant: db.Lieferant;
	    Ansprechpartner: db.Ansprechpartner[];
	
	    static createFrom(source: any = {}) {
	        return new LieferantenResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Lieferant = this.convertValues(source["Lieferant"], db.Lieferant);
	        this.Ansprechpartner = this.convertValues(source["Ansprechpartner"], db.Ansprechpartner);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MitarbeiterProps {
	    Name: string;
	    Image: boolean;
	    Azubi: boolean;
	    Short?: string;
	    Sex?: string;
	    Focus?: string;
	    Mail?: string;
	    AbteilungId?: string;
	    Geburtstag?: string;
	    Gruppenwahl?: string;
	    Homeoffice?: string;
	    MobilBusiness?: string;
	    MobilPrivat?: string;
	    TelefonIntern1?: string;
	    TelefonIntern2?: string;
	    TelefonPrivat?: string;
	
	    static createFrom(source: any = {}) {
	        return new MitarbeiterProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Image = source["Image"];
	        this.Azubi = source["Azubi"];
	        this.Short = source["Short"];
	        this.Sex = source["Sex"];
	        this.Focus = source["Focus"];
	        this.Mail = source["Mail"];
	        this.AbteilungId = source["AbteilungId"];
	        this.Geburtstag = source["Geburtstag"];
	        this.Gruppenwahl = source["Gruppenwahl"];
	        this.Homeoffice = source["Homeoffice"];
	        this.MobilBusiness = source["MobilBusiness"];
	        this.MobilPrivat = source["MobilPrivat"];
	        this.TelefonIntern1 = source["TelefonIntern1"];
	        this.TelefonIntern2 = source["TelefonIntern2"];
	        this.TelefonPrivat = source["TelefonPrivat"];
	    }
	}
	export class PartnerProps {
	    Name: string;
	    Link: string;
	    Image: string;
	
	    static createFrom(source: any = {}) {
	        return new PartnerProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Link = source["Link"];
	        this.Image = source["Image"];
	    }
	}
	export class SearchProps {
	    Search: string;
	
	    static createFrom(source: any = {}) {
	        return new SearchProps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Search = source["Search"];
	    }
	}

}

export namespace sql {
	
	export class NullBool {
	    Bool: boolean;
	    Valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new NullBool(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Bool = source["Bool"];
	        this.Valid = source["Valid"];
	    }
	}
	export class NullString {
	    String: string;
	    Valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new NullString(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.String = source["String"];
	        this.Valid = source["Valid"];
	    }
	}
	export class NullTime {
	    // Go type: time
	    Time: any;
	    Valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new NullTime(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Time = this.convertValues(source["Time"], null);
	        this.Valid = source["Valid"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

