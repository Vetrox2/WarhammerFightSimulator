import { Component, inject } from '@angular/core';
import { MenuComponent } from './features/menu/menu.component';
import { CombatSceneComponent } from './features/combat-scene/combat-scene.component';
import { NgIf } from '@angular/common';
import { GameService } from './services/game.service';
import { testRoundHistory } from './test-round-history';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, CombatSceneComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  gameService = inject(GameService);
  showGame = this.gameService.gameStarted;

  testRoundHistory = testRoundHistory as any;
}
