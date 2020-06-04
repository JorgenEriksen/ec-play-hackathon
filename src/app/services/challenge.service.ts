import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Challenge } from '../models/challenge';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  challengeCollection: AngularFirestoreCollection<Challenge>;
  challenges: Observable<any>; // får error når jeg setter til <Challange> må få sett mer på det senere
  challengeDoc: AngularFirestoreDocument<Challenge>;

  constructor(public afs: AngularFirestore) {
    this.challengeCollection = this.afs.collection('Challenges', ref => ref.orderBy('navn', 'asc'));
    this.challenges = this.challengeCollection.snapshotChanges().pipe(map(changes => {
     return changes.map(a => {
      const data = a.payload.doc.data() as Challenge;
      data.id = a.payload.doc.id;
      return data;
      });
    }));
   }

   getChallenges(){
     return this.challenges;
   }

   leggTilChallenge(nyChallenge: Challenge){ // nyChallenge skal være ferdig validert før den kommer hit fra create
    this.challengeCollection.add(nyChallenge);
   }

   oppdaterChallenge(redChallenge: Challenge){
    this.challengeDoc = this.afs.doc(`Challenges/${redChallenge.id}`);
    this.challengeDoc.update(redChallenge);
   }

   slettChallenge(slettChallenge: Challenge){
    this.challengeDoc = this.afs.doc(`Challenges/${slettChallenge.id}`);
    this.challengeDoc.delete();
   }


}



