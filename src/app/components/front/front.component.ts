import { Component, OnInit } from '@angular/core';

import { ChallengeService } from '../../services/challenge.service';
import { DataService } from '../../services/data.service';
import { Challenge } from '../../models/challenge';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {
  innloggetId: string;
  alleChallenges: Challenge[];
  alleBrukerChallenges: Challenge[]; // alle challenge til innlogget bruker
  administrerendeChallenges: number; // antall challenge som innlogget bruker administrerer

  constructor(private challengeService: ChallengeService, private data: DataService) { }

  ngOnInit(): void {
    this.data.brukerId.subscribe(id => this.innloggetId = id);

    this.administrerendeChallenges = 0;
    this.challengeService.getChallenges().subscribe(challengesData => {
      this.alleChallenges = challengesData;
      this.alleBrukerChallenges = [];
      // looper igjennom alle challenger
      this.alleChallenges.forEach(chal => {
        if (chal.admin === this.innloggetId){ this.administrerendeChallenges++; }
        // looper igjennom alle deltagere i challenge
        chal.deltagere.forEach(deltager => {
          if (deltager.brukerId === this.innloggetId){ this.alleBrukerChallenges.push(chal); }
        });
      });
    });
  }

  slettChallenge(event, challenge){
    this.challengeService.slettChallenge(challenge);
  }

}
