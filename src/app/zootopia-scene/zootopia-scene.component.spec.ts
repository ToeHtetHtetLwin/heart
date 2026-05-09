import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZootopiaSceneComponent } from './zootopia-scene.component';

describe('ZootopiaSceneComponent', () => {
  let component: ZootopiaSceneComponent;
  let fixture: ComponentFixture<ZootopiaSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZootopiaSceneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZootopiaSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
