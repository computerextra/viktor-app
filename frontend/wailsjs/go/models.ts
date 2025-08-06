export namespace db {
	
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

}

export namespace main {
	
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

