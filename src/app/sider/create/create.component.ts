import { Component, OnInit } from '@angular/core';

import { Challenge } from '../../models/challenge';
import { ChallengeService } from '../../services/challenge.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  alleChallenges: Challenge[];
  challenge: Challenge = {
    id: '',
    navn: '',
    beskrivelse: '',
    admin: '',
    deltagere: [],
    type: '',             // vil kun være solo, closed eller open
    inviteringskode: ''
  };


  constructor(private challengeService: ChallengeService, private data: DataService) { }

  ngOnInit(): void {
    // setter id til innlogget bruker til admin hvis bruker skal opprette challenge
    this.data.brukerId.subscribe(id => this.challenge.admin = id);

    this.challengeService.challenges.subscribe(alleChallenges => { this.alleChallenges = alleChallenges; });
  }

  onSubmit(){
    let invKode;
    // Ha med sjekk at gruppenavn er tatt?

    // hvis feltene er fylt ut, så submit
    if (this.challenge.navn !== '' && this.challenge.beskrivelse !== '' && this.challenge.type !== ''){

      if(this.challenge.type === 'closed' || this.challenge.type === 'open'){
        // genererer unik inviteringskode
        do{
          invKode = Math.random().toString(36).substring(7).toUpperCase();
        } while (this.eksistererInviteringskode(invKode));
        this.challenge.inviteringskode = invKode;
      }

      this.challenge.deltagere.push(this.challenge.admin); // legger også til admin i deltager listen
      this.challengeService.leggTilChallenge(this.challenge);

      // gjør form blank igjen via databinding
      this.challenge.navn = '';
      this.challenge.beskrivelse = '';
    } else {
      // melding om å fylle ut alle felt her.
    }
  }

  // sjekker om inviteringskode eksisterer, selvom det er en utrolig liten sjans for det.
  eksistererInviteringskode(invKode: string){
    for (const element of this.alleChallenges) {
      if(element.inviteringskode === invKode){
        return true;
      }
    }
    return false; // hvis koden ikke eksisterte fra før
  }

}
