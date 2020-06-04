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
  alleChallenges: Challenge[];
  innloggetId: string;
  redigerChallenge: Challenge;
  kodeInput = '';

  constructor(private challengeService: ChallengeService, private data: DataService) { }

  ngOnInit(): void {
    this.data.brukerId.subscribe(id => this.innloggetId = id);

    this.challengeService.getChallenges().subscribe(challengesData => {
      this.alleChallenges = challengesData;
    });
  }

  onSubmit(){
    if (this.kodeInput !== ''){
      if (this.finnesInviteringskode(this.kodeInput)){ // om inviteringskoden finnes
        if (!this.erBrukerMedlem()){                   // om innlogget bruker ikke er medlem fra før
          console.log('Lagt til bruker!');
          this.redigerChallenge.deltagere.push(this.innloggetId);
          this.challengeService.oppdaterChallenge(this.redigerChallenge);
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
      if (this.innloggetId === bruker){
        return true;
      }
    }
    return false;
  }

}
