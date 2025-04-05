import { Injectable } from '@angular/core';
import { AudioTrack } from '../models/audio-track.enum';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly musicPath = 'assets/Sounds';
  private tracks: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.tracks[AudioTrack.MenuBackground] = new Audio(
      `${this.musicPath}/menu_music.mp3`
    );
    this.tracks[AudioTrack.StartBattle] = new Audio(
      `${this.musicPath}/battle-start-sound.mp3`
    );
    this.tracks[AudioTrack.BattleBackground] = new Audio(
      `${this.musicPath}/fight_music.mp3`
    );

    this.tracks[AudioTrack.MenuBackground].loop = true;
    this.tracks[AudioTrack.BattleBackground].loop = true;

    // Characters
    this.tracks[AudioTrack.DwarfAttack] = new Audio(
      `${this.musicPath}/Characters/dwarf-attack.mp3`
    );
    this.tracks[AudioTrack.DwarfDeath] = new Audio(
      `${this.musicPath}/Characters/dwarf-death.mp3`
    );
    this.tracks[AudioTrack.DwarfHittake] = new Audio(
      `${this.musicPath}/Characters/dwarf-hittake.mp3`
    );
    this.tracks[AudioTrack.ElfAttack] = new Audio(
      `${this.musicPath}/Characters/elf-attack.mp3`
    );
    this.tracks[AudioTrack.ElfDeath] = new Audio(
      `${this.musicPath}/Characters/elf-death.mp3`
    );
    this.tracks[AudioTrack.ElfHittake] = new Audio(
      `${this.musicPath}/Characters/elf-hittake.mp3`
    );
    this.tracks[AudioTrack.NiziolekAttack] = new Audio(
      `${this.musicPath}/Characters/niziolek-attack.mp3`
    );
    this.tracks[AudioTrack.NiziolekHittake] = new Audio(
      `${this.musicPath}/Characters/niziolek-hittake.mp3`
    );
    this.tracks[AudioTrack.OrcAttack] = new Audio(
      `${this.musicPath}/Characters/orc-attack.mp3`
    );
    this.tracks[AudioTrack.OrcDeath] = new Audio(
      `${this.musicPath}/Characters/orc-death.mp3`
    );
    this.tracks[AudioTrack.OrcHittake] = new Audio(
      `${this.musicPath}/Characters/orc-hittake.mp3`
    );
    this.tracks[AudioTrack.WarriorAttack] = new Audio(
      `${this.musicPath}/Characters/warrior-attack.mp3`
    );
    this.tracks[AudioTrack.WarriorDeath] = new Audio(
      `${this.musicPath}/Characters/warrior-death.mp3`
    );
    this.tracks[AudioTrack.WarriorHittake] = new Audio(
      `${this.musicPath}/Characters/warrior-hittake.mp3`
    );

    // Weapons
    this.tracks[AudioTrack.MetalHit] = new Audio(
      `${this.musicPath}/Weapons/metal-hit.mp3`
    );
    this.tracks[AudioTrack.ShieldHit] = new Audio(
      `${this.musicPath}/Weapons/shield-hit.mp3`
    );
    this.tracks[AudioTrack.SwordAttack] = new Audio(
      `${this.musicPath}/Weapons/sword-attack.mp3`
    );
    this.tracks[AudioTrack.SwordHit] = new Audio(
      `${this.musicPath}/Weapons/sword-hit.mp3`
    );
    this.tracks[AudioTrack.WeaponSwoossh] = new Audio(
      `${this.musicPath}/Weapons/weapon-swooosh.mp3`
    );
  }

  play(track: AudioTrack) {
    this.stopAll();
    if (this.tracks[track]) {
      this.tracks[track].play();
    }
  }

  stopAll() {
    Object.values(this.tracks).forEach((audio) => audio.pause());
  }

  playSFX(track: AudioTrack) {
    if (this.tracks[track]) {
      this.tracks[track].currentTime = 0;
      this.tracks[track].play();
    }
  }
}
