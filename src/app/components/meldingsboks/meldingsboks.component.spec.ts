import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeldingsboksComponent } from './meldingsboks.component';

describe('MeldingsboksComponent', () => {
  let component: MeldingsboksComponent;
  let fixture: ComponentFixture<MeldingsboksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeldingsboksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeldingsboksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
