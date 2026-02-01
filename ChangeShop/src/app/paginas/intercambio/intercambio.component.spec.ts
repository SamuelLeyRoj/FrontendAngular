import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IntercambioPage } from './intercambio.component';

describe('IntercambioPage', () => {
  let component: IntercambioPage;
  let fixture: ComponentFixture<IntercambioPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IntercambioPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IntercambioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
