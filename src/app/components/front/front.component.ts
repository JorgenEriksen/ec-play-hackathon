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
  administrerendeChallenges: number; // antall challenge som innlogget bruker administrerer

  constructor(private challengeService: ChallengeService, private data: DataService) { }

  ngOnInit(): void {
    this.data.brukerId.subscribe(id => this.innloggetId = id);

    this.administrerendeChallenges = 0;
    this.challengeService.getChallenges().subscribe(challengesData => {
      this.alleChallenges = challengesData;

      this.alleChallenges.forEach(element => {
        if (element.admin === this.innloggetId){ this.administrerendeChallenges++; }
      });
    });
  }

  slettChallenge(event, challenge){
    this.challengeService.slettChallenge(challenge);
  }

}
