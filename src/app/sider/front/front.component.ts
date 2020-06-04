import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../services/challenge.service';

import { Challenge } from '../../models/challenge';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {
  challenges: Challenge;

  constructor(private challengeService: ChallengeService) { }

  ngOnInit(): void {
    this.challengeService.getChallenges().subscribe(challengesData => {
      this.challenges = challengesData;
    });
  }

  slettChallenge(event, challenge){
    this.challengeService.slettChallenge(challenge);
  }

}
