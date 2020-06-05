import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontComponent } from './components/front/front.component';

import { ChallengeService } from './services/challenge.service';
import { HeaderComponent } from './header/header.component';
import { CreateComponent } from './components/create/create.component';
import { LoginComponent } from './components/login/login.component';
import { JoinComponent } from './components/join/join.component';
import { ChallengeDetailComponent } from './components/challenge-detail/challenge-detail.component';
import { MeldingsboksComponent } from './components/meldingsboks/meldingsboks.component';

@NgModule({
  declarations: [
    AppComponent,
    FrontComponent,
    HeaderComponent,
    CreateComponent,
    LoginComponent,
    JoinComponent,
    ChallengeDetailComponent,
    MeldingsboksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseconfig, 'angularfs'),
    AngularFirestoreModule
  ],
  providers: [ChallengeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
