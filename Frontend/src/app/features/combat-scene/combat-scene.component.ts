import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { NgFor } from '@angular/common';
import { RoundHistory } from '../../models/round-history.model';
import { CharacterComponent } from '../character/character.component';
import { CharacterDTO } from '../../models/character-dto.model';
import { HitSuccessMissReason } from '../../models/hit-success-miss-reason.model';
import { asyncScheduler, SchedulerAction } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { AudioTrack } from '../../models/audio-track.enum';
import { Round } from '../../models/round.model';

@Component({
  selector: 'app-combat-scene',
  imports: [NgFor, CharacterComponent],
  templateUrl: './combat-scene.component.html',
  styleUrl: './combat-scene.component.css',
})
export class CombatSceneComponent {
  @ViewChild('animationElement') animationElement!: ElementRef<HTMLDivElement>;
  gameService = inject(GameService);
  audioService = inject(AudioService);

  teamA = signal<CharacterDTO[]>([]);
  teamB = signal<CharacterDTO[]>([]);
  isAnimating = signal(false);
  damagedCharacter = signal('');

  baseHeight = 600;
  maxVerticalShift = signal(0);
  maxHorizontalShift = signal(0);
  roundHistory!: RoundHistory;

  constructor() {
    this.startBattle();
  }

  startBattle() {
    const component = this;
    this.audioService.play(AudioTrack.BattleBackground);

    asyncScheduler.schedule(
      function processRound(this: SchedulerAction<number>) {
        if (component.roundHistory.rounds.length === 0) {
          component.endGameIfFinished();
          return;
        }

        component.isAnimating.set(true);
        component.audioService.playSFX(AudioTrack.WeaponSwoossh);
        component.playAttackAnimationAndSFX().then(() => {
          component.isAnimating.set(false);
          component.manageRoundDamage();
          component.roundHistory.rounds.shift();

          this.schedule(undefined, 2000);
        });
      },
      0,
      0
    );
  }

  playAttackAnimationAndSFX(): Promise<void> {
    return new Promise((resolve) => {
      const animEl = this.animationElement.nativeElement;
      animEl.classList.add('animate');
      setTimeout(() => {
        switch (this.roundHistory.rounds[0].hitSuccessFailReason) {
          case HitSuccessMissReason.Parry:
            this.audioService.playSFX(AudioTrack.SwordAttack);
            break;
        }
      }, 600);

      setTimeout(() => {
        animEl.classList.remove('animate');
        resolve();
      }, 800);
    });
  }

  manageRoundDamage() {
    const round = this.roundHistory.rounds[0];

    if (round.hitSuccessFailReason === HitSuccessMissReason.Hit) {
      this.dealDamage(round.defendingCharID, round.defendingCharCurrentHP);
      this.damagedCharacter.set(round.defendingCharID);
    }
  }

  endGameIfFinished() {
    if (this.roundHistory.rounds.length === 0) {
      //victory anim
      this.gameService.goToMenu();
    }
  }

  getImagePosition(
    index: number,
    isRightSide: boolean
  ): {
    left?: string;
    right?: string;
    bottom: string;
    height: string;
    width: string;
    transform: string;
  } {
    const k = 0.4;
    const reverseIndex = isRightSide
      ? this.roundHistory.teamB.length - index - 1
      : this.roundHistory.teamA.length - index - 1;
    let posScale = 1 - 1 / (1 + k * reverseIndex);
    let sizeScale = this.maxHorizontalShift() / 960;
    const bottom = `${
      ((this.maxVerticalShift() * posScale) / 1.6) * sizeScale
    }px`;
    const height = this.baseHeight * (1 - posScale) * sizeScale;
    const xPos = `${
      (this.maxHorizontalShift() * posScale * 1.25 - this.baseHeight * 0.25) *
      sizeScale
    }px`;

    const heightPx = `${height}px`;
    const transform = `scaleX(${isRightSide ? 1 : -1})`;

    return isRightSide
      ? { right: xPos, bottom, height: heightPx, width: heightPx, transform }
      : { left: xPos, bottom, height: heightPx, width: heightPx, transform };
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateResponsiveValues();
  }

  updateResponsiveValues() {
    this.maxVerticalShift.set(window.innerHeight - 50);
    this.maxHorizontalShift.set(window.innerWidth / 2);
  }

  trackByFn(index: number, character: CharacterDTO) {
    return character.guid;
  }

  private dealDamage(id: string, newHp: number) {
    let index = this.teamA().findIndex((char) => char.guid === id);
    if (index !== -1) {
      this.updateCharacterHP(index, this.teamA, newHp);
      return;
    }

    index = this.teamB().findIndex((char) => char.guid === id);
    if (index !== -1) {
      this.updateCharacterHP(index, this.teamB, newHp);
      return;
    }
  }

  private updateCharacterHP(
    index: number,
    team: WritableSignal<CharacterDTO[]>,
    newHp: number
  ) {
    team.update((chars) =>
      chars.map((char, i) => (i === index ? { ...char, health: newHp } : char))
    );
  }

  ngOnInit(): void {
    const tempRoundHistory = this.gameService.currentRoundHistory();
    if (!tempRoundHistory) {
      this.gameService.goToMenu();
      return;
    }

    this.roundHistory = tempRoundHistory;
    this.teamA.set(this.roundHistory.teamA);
    this.teamB.set(this.roundHistory.teamB);

    this.updateResponsiveValues();
  }
}
