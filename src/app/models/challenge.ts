export interface Challenge {
    id: string;
    navn: string;
    beskrivelse: string;
    frekvens: number;
    startDato: string;         // blir lagret i string, men konverteres til date i component.ts
    sluttDato: string;         // blir lagret i string, men konverteres til date i component.ts
    prioritering: string;      // denne er valgt som en string og ikke bool for å tilrettelegge for evt. flere alternativer.
    admin: string;              // id til grunnleggeren av challenge
    deltagere: [{
        brukerId: string;                   // id til brukerene som er med i challenge
        statistikk: number[];
    }];
    type: string;               // vil kun være solo, closed eller open
    inviteringskode: string;    // en evt. inviteringskode
}
