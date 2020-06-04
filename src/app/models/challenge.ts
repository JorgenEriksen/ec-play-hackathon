export interface Challenge {
    id: string;
    navn: string;
    beskrivelse: string;
    admin: string;              // id til grunnleggeren av challenge
    deltagere: Array<string>;   // id til brukerene som er med i challenge
    type: string;               // vil kun være solo, closed eller open
    inviteringskode: string;    // en evt. inviteringskode
}
