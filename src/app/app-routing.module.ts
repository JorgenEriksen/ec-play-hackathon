import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrontComponent } from './sider/front/front.component';
import { CreateComponent } from './sider/create/create.component';
import { JoinComponent } from './sider/join/join.component';


const routes: Routes = [
  { path: '', component: FrontComponent },
  { path: 'create', component: CreateComponent },
  { path: 'join', component: JoinComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
