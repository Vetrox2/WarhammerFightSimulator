import { NgStyle } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CharacterDTO } from '../../models/character-dto.model';
import { AudioService } from '../../services/audio.service';
import { AudioTrack } from '../../models/audio-track.enum';

@Component({
  selector: 'app-character',
  imports: [NgStyle],
  templateUrl: './character.component.html',
  styleUrl: './character.component.css',
})
export class CharacterComponent implements OnInit, OnDestroy {
  @ViewChild('animationElement') animationElement!: ElementRef<HTMLDivElement>;
  @ViewChild('characterContainer')
  characterElement!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) position!: {
    left?: string;
    right?: string;
    bottom: string;
    height: string;
    width: string;
    transform: string;
  };
  @Input({ required: true }) damagedCharId!: WritableSignal<string>;
  character = input.required<CharacterDTO>();

  audioService = inject(AudioService);

  health = computed(() => this.character().health / this.maxHealth);

  private maxHealth = 0;
  private stopEffect;
  private hitTakeSFX!: AudioTrack;
  private attackSFX!: AudioTrack;
  private deathSFX!: AudioTrack;

  constructor() {
    this.stopEffect = effect(() => {
      const triggeredId = this.damagedCharId();
      if (triggeredId === this.character().guid) {
        this.playAnimationAndSFX();
      }
    });
  }

  playAnimationAndSFX(): Promise<void> {
    return new Promise((resolve) => {
      const animEl = this.animationElement.nativeElement;
      animEl.classList.add('animate-damage');
      if (this.character().health > 0)
        this.audioService.playSFX(this.hitTakeSFX);
      else {
        this.audioService.playSFX(this.deathSFX);
        this.characterElement.nativeElement.classList.add('dead');
      }
      setTimeout(() => {
        animEl.classList.remove('animate-damage');
        resolve();
      }, 2000);
    });
  }

  ngOnInit(): void {
    this.maxHealth = this.character().health;

    switch (this.character().name) {
      case 'Ork':
        this.hitTakeSFX = AudioTrack.OrcHittake;
        this.deathSFX = AudioTrack.OrcDeath;
        this.attackSFX = AudioTrack.OrcAttack;
        break;
      case 'Człowiek':
        this.hitTakeSFX = AudioTrack.WarriorHittake;
        this.deathSFX = AudioTrack.WarriorDeath;
        this.attackSFX = AudioTrack.WarriorAttack;
        break;

      case 'Niziołek':
        this.hitTakeSFX = AudioTrack.NiziolekHittake;
        this.deathSFX = AudioTrack.OrcDeath;
        this.attackSFX = AudioTrack.NiziolekAttack;
        break;

      case 'Krasnolud':
        this.hitTakeSFX = AudioTrack.DwarfHittake;
        this.deathSFX = AudioTrack.DwarfDeath;
        this.attackSFX = AudioTrack.DwarfAttack;
        break;

      case 'Elf':
        this.hitTakeSFX = AudioTrack.ElfHittake;
        this.deathSFX = AudioTrack.ElfDeath;
        this.attackSFX = AudioTrack.ElfAttack;
        break;
    }
  }

  ngOnDestroy(): void {
    this.stopEffect.destroy();
  }
}
