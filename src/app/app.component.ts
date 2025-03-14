import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ec-challenge';
  loggetInn: boolean;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.erLoggetInn.subscribe(verdi => this.loggetInn = verdi);
  }

}
