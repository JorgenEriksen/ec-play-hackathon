import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bruker } from '../models/bruker';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class BrukerService {
  brukerCollection: AngularFirestoreCollection<Bruker>;
  brukere: Observable<Bruker[]>; // denne var <any> tidligere
  brukerDoc: AngularFirestoreDocument<Bruker>;
  brukerPlaceholder: any;

  constructor(public afs: AngularFirestore) {
    this.brukerCollection = this.afs.collection('Brukere', ref => ref.orderBy('brukernavn', 'asc'));
    this.brukere = this.brukerCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
       const data = a.payload.doc.data() as Bruker;
       data.id = a.payload.doc.id;
       return data;
       });
     }));
  }

  getBrukere(){
    return this.brukere;
  }
  getBrukernavnFraId(bruker: Bruker){
    this.brukerDoc = this.afs.doc(`brukerDoc/${bruker.id}`);
  }

  leggTilBruker(nyBruker: Bruker){ // nyBruker skal være ferdig validert før den kommer hit fra create
   this.brukerCollection.add(nyBruker);
  }


  async leggTilBrukerOgReturnerId(nyBruker: Bruker){
    this.brukerCollection.add(nyBruker).then(docRef => {
        console.log(docRef.id);
        return docRef.id;
    });
  }

  slettBruker(slettBruker: Bruker){
   this.brukerDoc = this.afs.doc(`Brukere/${slettBruker.id}`);
   this.brukerDoc.delete();
  }


}
