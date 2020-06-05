import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { ChallengeService } from '../../services/challenge.service';
import { Challenge } from '../../models/challenge';
import {Router} from '@angular/router'
import { element } from 'protractor';

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
  alleChallenges: Challenge[];
  challenge: Challenge;
  constructor(private challengeService: ChallengeService, private data: DataService, private activatedRoute: ActivatedRoute, private router: Router) { }

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
        if (chal.id === this.id){ this.challenge = chal; }
      });
      this.fraDato = new Date(this.challenge.startDato);
      this.tilDato = new Date(this.challenge.sluttDato);
    });

    

  }

  onSubmit(){
    let antallDagerFraStart = this.antallDagerFraStart();

    if (this.valgtDatoFrekvens !== undefined && this.valgtDatoFrekvens !== null){
      this.challenge.deltagere[this.deltagerIndex].statistikk[antallDagerFraStart] = this.valgtDatoFrekvens;
      this.challengeService.oppdaterChallenge(this.challenge);
      this.melding = 'Good job!';
    }

  }

  datoEndret(){
    console.log('this.deltagerIndex ' + this.deltagerIndex);
    let antallDagerFraStart = this.antallDagerFraStart();
    console.log('diffdays ' + antallDagerFraStart);
    if (this.challenge.deltagere[this.deltagerIndex].statistikk[antallDagerFraStart] === undefined){
      this.valgtDatoFrekvens = 0;
    } else {
      this.valgtDatoFrekvens = this.challenge.deltagere[this.deltagerIndex].statistikk[antallDagerFraStart];
    }

  }

  antallDagerFraStart(){
    const enDag = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const startPlaceholder = new Date(this.challenge.startDato);
    const valgtPlaceholder = new Date(this.valgtDato);
    startPlaceholder.setHours(0, 0, 0, 0);
    valgtPlaceholder.setHours(0, 0, 0, 0);
    const startDato = startPlaceholder.getTime();
    const valgtDato = valgtPlaceholder.getTime();

    const diffDays = Math.round(Math.abs((startDato - valgtDato) / enDag));

    return diffDays;
  }



  formValidering(){
    /*
    const startPlaceholder = new Date(this.challenge.startDato);
    const valgtPlaceholder = new Date(this.valgtDato);
    const sluttPlaceholder = new Date(this.challenge.sluttDato);
    startPlaceholder.setHours(0, 0, 0, 0);
    valgtPlaceholder.setHours(0, 0, 0, 0);
    sluttPlaceholder.setHours(0, 0, 0, 0);
    const startDato = startPlaceholder.getTime();
    const valgtDato = valgtPlaceholder.getTime();
    const sluttDato = sluttPlaceholder.getTime();

    // hvis valgtDato er mellom startdato og sluttdato
    if (valgtDato < startDato || valgtDato > sluttDato){
      console.log('feil dato');
      return true;
    } else {
      console.log('riktig dato');
      return false;
    }
    */
  }



}
