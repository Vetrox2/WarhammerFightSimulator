import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { NgFor, NgIf } from '@angular/common';
import { CharacterDTO } from '../../models/character-dto.model';
import { TeamListComponent } from './team-list/team-list.component';
import { CharacterTeam } from '../../models/character-team.model';
import { MenuService } from '../../services/menu.service';
import { AudioService } from '../../services/audio.service';
import { AudioTrack } from '../../models/audio-track.enum';

@Component({
  selector: 'app-menu',
  imports: [TeamListComponent, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit, OnDestroy {
  private readonly gameService = inject(GameService);
  private readonly menuService = inject(MenuService);
  private readonly audioService = inject(AudioService);

  private selectedCharacters = this.menuService.getSelectedCharacters(
    CharacterTeam.Both
  );

  CharacterTeam = CharacterTeam;
  isGameLoading = signal(false);

  private stopEffect;

  constructor() {
    this.audioService.play(AudioTrack.MenuBackground);
    this.stopEffect = effect(() => {
      if (this.gameService.gameStarted()) {
        this.isGameLoading.set(false);
      }
    });
  }

  startBattle() {
    this.audioService.playSFX(AudioTrack.StartBattle);
    this.startBattleAfterDelay();
    this.isGameLoading.set(true);
  }

  startBattleAfterDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.gameService.fetchBattleHistory(this.selectedCharacters());
        resolve();
      }, 2000);
    });
  }

  ngOnInit(): void {
    this.gameService.fetchDefaultCharacters();
  }

  ngOnDestroy(): void {
    this.stopEffect.destroy();
  }
}
