import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Equipaje } from './equipaje';

describe('Equipaje', () => {
  let component: Equipaje;
  let fixture: ComponentFixture<Equipaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Equipaje]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Equipaje);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
