import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisVuelosComponent } from './mis-vuelos';

describe('MisVuelos', () => {
  let component: MisVuelosComponent;
  let fixture: ComponentFixture<MisVuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisVuelosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisVuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
