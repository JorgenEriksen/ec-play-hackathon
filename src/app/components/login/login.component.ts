import { Component, OnInit } from '@angular/core';

import { Bruker } from '../../models/bruker';
import { BrukerService } from '../../services/bruker.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  alleBrukere: Bruker[];
  bruker: Bruker = {
    id: '',
    brukernavn: '',
  };
  loggetInn: boolean;
  boksMelding = '';

  constructor(private brukerService: BrukerService, private data: DataService) { }


  ngOnInit(): void {
    this.brukerService.getBrukere().subscribe(brukere => {
      this.alleBrukere = brukere;
    });

    this.data.erLoggetInn.subscribe(verdi => this.loggetInn = verdi);
  }


  onSubmit(){
    let fantBruker = false;
    let id = '';

    if (this.bruker.brukernavn !== ''){
        this.alleBrukere.forEach(b => {
          if (b.brukernavn === this.bruker.brukernavn){
            fantBruker = true;
            id = b.id;
          }
      });
   }

    if (fantBruker){
      this.data.settInnloggetBrukerId(id); // lagrer brukerIden så man vet hvilken bruker som er innlogget
      this.data.loggInn(true);
      this.boksMelding = '';
    } else {
      this.brukerService.leggTilBruker(this.bruker);
      this.boksMelding = `User with username ${this.bruker.brukernavn} is now registred`;
    }
    this.bruker.brukernavn = ''; // clear form

  }

}
