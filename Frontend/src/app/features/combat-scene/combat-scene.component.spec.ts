import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatSceneComponent } from './combat-scene.component';

describe('CombatSceneComponent', () => {
  let component: CombatSceneComponent;
  let fixture: ComponentFixture<CombatSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombatSceneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombatSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
