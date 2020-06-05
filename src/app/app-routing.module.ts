import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrontComponent } from './components/front/front.component';
import { CreateComponent } from './components/create/create.component';
import { JoinComponent } from './components/join/join.component';
import { ChallengeDetailComponent } from './components/challenge-detail/challenge-detail.component';


const routes: Routes = [
  { path: '', component: FrontComponent },
  { path: 'challenge/:id', component: ChallengeDetailComponent },
  { path: 'create', component: CreateComponent },
  { path: 'join', component: JoinComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
