import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private loggetInnSource = new BehaviorSubject<boolean>(false);
  erLoggetInn = this.loggetInnSource.asObservable();

  private brukerIdSource = new BehaviorSubject<string>('');
  brukerId = this.brukerIdSource.asObservable();

  constructor() { }

  loggInn(verdi: boolean){
    this.loggetInnSource.next(verdi);
  }

  settInnloggetBrukerId(verdi: string){
    this.brukerIdSource.next(verdi);
  }

}
