import { Component, OnInit } from '@angular/core';

import { ChallengeService } from '../../services/challenge.service';
import { DataService } from '../../services/data.service';
import { Challenge } from '../../models/challenge';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  melding: string;               // melding til meldingsboks
  color: 'green';
  alleChallenges: Challenge[];
  innloggetId: string;
  redigerChallenge: Challenge;
  allePotensielleChallenges;        // alle åpne challenge som brukeren ikke er medlem av.
  antallOpenChallenges: number;
  kodeInput = '';

  constructor(private challengeService: ChallengeService, private data: DataService) { }

  ngOnInit(): void {
    this.data.brukerId.subscribe(id => this.innloggetId = id);

    this.challengeService.getChallenges().subscribe(challengesData => {
      this.alleChallenges = challengesData;

      // teller antall lagrede challenges som er open og lager array med ujoinet challenge
      this.antallOpenChallenges = 0;
      this.allePotensielleChallenges = [];
      this.alleChallenges.forEach(chal => {
        let medlem = false;
        if (chal.type === 'open'){ this.antallOpenChallenges++; }
        chal.deltagere.forEach(deltager => {
          if (deltager.brukerId === this.innloggetId){ medlem = true; }
        });
        if (medlem === false){ this.allePotensielleChallenges.push(chal); }
      });
    });
  }

  onSubmit(){
    if (this.kodeInput !== ''){
      if (this.finnesInviteringskode(this.kodeInput)){ // om inviteringskoden finnes
        if (!this.erBrukerMedlem()){                   // om innlogget bruker ikke er medlem fra før
          this.leggTilBrukerIChallenge(this.redigerChallenge);
          this.kodeInput = '';
        } else {
          console.log('Er allerede medlem');
        }
      } else {
        console.log('Fant ikke challenge');
      }
    }
    this.kodeInput = '';
  }

  // returnerer true om kodeInput er en match med en challenge.inviteringskode
  finnesInviteringskode(kodeInput: string){
    for (const element of this.alleChallenges) {
      console.log(kodeInput + ' === ' + element.inviteringskode);
      if (kodeInput === element.inviteringskode){
        this.redigerChallenge = element;
        return true;
      }
    }
    return false;
  }

  // returnerer true om id til innlogget bruker er
  erBrukerMedlem(){
    for (const bruker of this.redigerChallenge.deltagere){
      if (this.innloggetId === bruker.brukerId){
        return true;
      }
    }
    return false;
  }



  // denne kan bli kjørt fra onSubmit() eller (click)/html
  leggTilBrukerIChallenge(chal: Challenge){
    this.redigerChallenge = chal;
    let statestikkPlaceholder = [];
    for (let i = 0; i < this.redigerChallenge.antallDager; i++){
        statestikkPlaceholder.push(0);
    }
    this.redigerChallenge.deltagere.push({
      brukerId: this.innloggetId,
      statistikk: statestikkPlaceholder
    });
    this.challengeService.oppdaterChallenge(this.redigerChallenge);
    this.color = 'green';
    this.melding = 'You have joined challenge ' + this.redigerChallenge.navn;
  }

}
