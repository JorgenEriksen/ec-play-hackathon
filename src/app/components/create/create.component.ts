import { Component, OnInit } from '@angular/core';

import { Challenge } from '../../models/challenge';
import { ChallengeService } from '../../services/challenge.service';
import { DataService } from '../../services/data.service';

import {Router} from '@angular/router'
import * as moment from 'moment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  melding: string;               // melding til meldingsboks.
  alleChallenges: Challenge[];
  datoImorgen = new Date();
  challenge: Challenge = {
    id: '',
    navn: '',
    beskrivelse: '',
    frekvens: 1,
    startDato: '',
    sluttDato: '',
    prioritering: 'frekvens',
    admin: '',
    deltagere: [{
      brukerId: '',                          // id til brukerene som er med i challenge
      statistikk: []         // frekvens gjort av challenge den datoen]
    }],
    type: 'closed',             // vil kun være solo, closed eller open
    inviteringskode: ''
  };


  constructor(private challengeService: ChallengeService, private data: DataService, private router: Router) { }

  ngOnInit(): void {
    // setter id til innlogget bruker til admin hvis bruker skal opprette challenge
    this.data.brukerId.subscribe(id => this.challenge.admin = id);

    this.challengeService.challenges.subscribe(alleChallenges => { this.alleChallenges = alleChallenges; });

    this.datoImorgen.setDate(this.datoImorgen.getDate() + 1); // legger til en dag
  }

  onSubmit(){
    let invKode;
    // Ha med sjekk at gruppenavn er tatt?

    // hvis feltene er riktig fylt ut, så submit
    if (this.formValidering()){
      if (this.challenge.type === 'closed' || this.challenge.type === 'open'){
        // genererer unik inviteringskode
        do{
          invKode = Math.random().toString(36).substring(7).toUpperCase();
        } while (this.eksistererInviteringskode(invKode));
        this.challenge.inviteringskode = invKode;
      }

      // legger også til admin i deltager listen
      this.challenge.deltagere[0] = {
        brukerId: this.challenge.admin,
        statistikk: []
      };

      // regner ut hvor mange dager det er med challenge og legger in blanke tall i statestikk
      // this.challenge.deltagere[0].statistikk


      this.challenge.startDato = new Date(Date.now()).toString();
      this.challenge.sluttDato = new Date(this.challenge.sluttDato).toString();
      this.challengeService.leggTilChallenge(this.challenge);
      this.router.navigateByUrl('/');
    }
  }

  // sjekker om inviteringskode eksisterer, selvom det er en utrolig liten sjans for det.
  eksistererInviteringskode(invKode: string){
    for (const element of this.alleChallenges) {
      if (element.inviteringskode === invKode){
        return true;
      }
    }
    return false; // hvis koden ikke eksisterte fra før
  }

  formValidering(){
    const dagensDatoPlaceholder = new Date().getTime();
    const sluttDatoPlaceholder = new Date(this.challenge.sluttDato).getTime();

    if (this.challenge.navn === '' || this.challenge.beskrivelse === '' || this.challenge.type === ''){
      this.melding = 'please complete all parts of the form';
      return false;
    } else if (dagensDatoPlaceholder >= sluttDatoPlaceholder){
      this.melding = 'date must be atleast a day ahead';
      return false;
    } else {
      return true;
    }

  }

}
