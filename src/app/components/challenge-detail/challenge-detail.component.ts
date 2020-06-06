import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { ChallengeService } from '../../services/challenge.service';
import { BrukerService } from '../../services/bruker.service';
import { Challenge } from '../../models/challenge';
import { Bruker } from '../../models/bruker';
import {Router} from '@angular/router'
import { element } from 'protractor';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail.component.html',
  styleUrls: ['./challenge-detail.component.scss']
})
export class ChallengeDetailComponent implements OnInit {
  id: string;
  innloggetId: string;
  melding: string;
  color = 'green';
  fraDato: Date;                // blir brukt til validering av dato i form
  tilDato: Date;                // blir brukt til validering av dato i form
  valgtDato = new Date();
  valgtDatoFrekvens: number;
  deltagerIndex: number;

  totalFrekvens: number;
  dagensStreak: number;
  dagerMedAktivitet: number;
  bestStreak: number;
  topDeltagere: any[];

  confirmBoks = false;              // viser confirm boks ang sletting av challenge
  alleChallenges: Challenge[];
  alleBrukere: Bruker[];
  challenge: Challenge;
  redigerChallenge: Challenge;
  constructor(private challengeService: ChallengeService, private data: DataService, private brukerService: BrukerService,
              private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id'); // ID til challenge

    this.challengeService.getChallenges().subscribe(challengesData => {
      this.alleChallenges = challengesData;
      this.alleChallenges.forEach(chal => {
        this.data.brukerId.subscribe(id => this.innloggetId = id); // finner bruker
        chal.deltagere.forEach((del, idx) => {
          if (del.brukerId === this.innloggetId){
            this.deltagerIndex = idx;
          }
        });
        if (chal.id === this.id){
          this.challenge = chal;
          this.redigerChallenge = chal;
        }
      });

      // henter alle brukere
      this.brukerService.getBrukere().subscribe(brukereData => {
        this.alleBrukere = brukereData;
      });

      setTimeout(() => this.kalkulerPoeng(), 800);  // hacky løsning som må bli erstattet med async
      this.fraDato = new Date(this.challenge.startDato);
      this.tilDato = new Date(this.challenge.sluttDato);
    });

  }

  kalkulerPoeng(){




    // regner ut innlogget bruker sine totale frekvens, og antall dager med aktivitet
    this.totalFrekvens = 0;
    this.dagerMedAktivitet = 0;
    this.challenge.deltagere[this.deltagerIndex].statistikk.forEach(poeng => {
      this.totalFrekvens += poeng;
      if (poeng > 0){ this.dagerMedAktivitet++ }
    });

    // regner ut beste dag streaken
    let adder = 0;
    let streak = 0;
    this.challenge.deltagere[this.deltagerIndex].statistikk.forEach(e => {
      if (e !== 0){ adder++; }
      else if (adder > streak){
        streak = adder;
        adder = 0;
      } else {adder = 0; }
    });
    this.bestStreak = streak;

    this.kalkulerTopBrukere();

  }

  kalkulerTopBrukere(){
    // regner ut alle sine poeng
    this.topDeltagere = [];
    let brukernavn = '';
    this.challenge.deltagere.forEach(e => {
      this.alleBrukere.forEach(bruker => {
        if (bruker.id === e.brukerId){
          brukernavn = bruker.brukernavn;
        }
      });
      let num = e.statistikk.reduce((a, b) => a + b, 0);
      this.topDeltagere.push({
        brukerId: e.brukerId,
        brukerNavn: brukernavn,
        frekvens: num
      });
    });

    this.topDeltagere = this.topDeltagere.sort((a, b) => (a.frekvens > b.frekvens) ? 1 : ((b.frekvens > a.frekvens) ? -1 : 0));
    console.log(this.topDeltagere);
    // reversere rekkefølgen så høyest sum kommer først
    this.topDeltagere.reverse();
    let kutt = this.challenge.antallToplise;
    if (this.challenge.deltagere.length < this.challenge.antallToplise){
      kutt = this.challenge.deltagere.length;
    }
    this.topDeltagere = this.topDeltagere.slice(0, kutt);

    // hvis det ikke skal være sortert rekkefølge
    if (this.challenge.ikkeSorter === true){
      this.topDeltagere.sort(() => Math.random() - 0.5);
    }

  }




  onSubmit(){
    console.log(this.challenge);
    let antallDagerFraStart = this.antallDagerFraStart(this.valgtDato);

    if (this.valgtDatoFrekvens !== undefined && this.valgtDatoFrekvens !== null && this.valgtDatoFrekvens !== 0 
      && this.valgtDatoFrekvens <= this.challenge.frekvens){
      this.challenge.deltagere[this.deltagerIndex].statistikk[antallDagerFraStart] = this.valgtDatoFrekvens;
      this.challengeService.oppdaterChallenge(this.challenge);
      this.melding = 'Good job!';
    }

  }

  datoEndret(){
    console.log('this.deltagerIndex ' + this.deltagerIndex);
    let antallDagerFraStart = this.antallDagerFraStart(this.valgtDato);
    console.log('diffdays ' + antallDagerFraStart);
    if (this.challenge.deltagere[this.deltagerIndex].statistikk[antallDagerFraStart] === undefined){
      this.valgtDatoFrekvens = 0;
    } else {
      this.valgtDatoFrekvens = this.challenge.deltagere[this.deltagerIndex].statistikk[antallDagerFraStart];
    }

  }

  antallDagerFraStart(dato: Date){
    const enDag = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const startPlaceholder = new Date(this.challenge.startDato);
    const valgtPlaceholder = new Date(dato);
    console.log(startPlaceholder);
    console.log(valgtPlaceholder);

    startPlaceholder.setHours(0, 0, 0, 0);
    valgtPlaceholder.setHours(0, 0, 0, 0);
    const startDato = startPlaceholder.getTime();
    const valgtDato = valgtPlaceholder.getTime();

    const diffDays = Math.round(Math.abs((startDato - valgtDato) / enDag));

    return diffDays;
  }

  onRedigerSubmit(){
    console.log('sjekk: ' + this.redigerChallenge.antallToplise);
    // hvis alle feltene er riktig fylt ut
    if (this.redigerChallenge.navn !== '' && this.redigerChallenge.beskrivelse !== '' && this.redigerChallenge.frekvens !== null 
    && this.redigerChallenge.antallToplise !== null){
      this.challengeService.oppdaterChallenge(this.redigerChallenge);
    }

  }

  onSlettSubmit(){
    this.confirmBoks = !this.confirmBoks;
  }

  slettChallenge(){
    this.challengeService.slettChallenge(this.challenge);
    this.router.navigateByUrl('/');
  }


}
