import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CutequestionComponent } from './cutequestion.component';

describe('CutequestionComponent', () => {
  let component: CutequestionComponent;
  let fixture: ComponentFixture<CutequestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CutequestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CutequestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
