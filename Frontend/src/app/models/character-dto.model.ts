import { Armour } from './armour.model';
import { CharacterAbility } from './character-ability.model';
import { CharacterTeam } from './character-team.model';
import { WeaponDTO } from './weapon-dto.model';

export interface CharacterDTO {
  bigURL: string;
  smallURL: string;
  name: string;
  guid: string;
  team: CharacterTeam;
  meleeSkill: number;
  dexterity: number;
  numberOfAttacks: number;
  health: number;
  strength: number;
  resistance: number;
  rangeSkill: number;
  armour: Armour;
  rightHand?: WeaponDTO;
  leftHand?: WeaponDTO;
  abilities: CharacterAbility[];
  dodgeValue?: number;
}
