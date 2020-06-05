import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meldingsboks',
  templateUrl: './meldingsboks.component.html',
  styleUrls: ['./meldingsboks.component.scss']
})
export class MeldingsboksComponent implements OnInit {
  @Input() melding: string;
  @Input() color: string;

  constructor() { }

  ngOnInit(): void {
  }

}
