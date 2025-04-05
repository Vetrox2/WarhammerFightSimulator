import { WeaponName } from './weapon-name.enum';
import { WeaponTrait } from './weapon-trait.model';

export interface WeaponDTO {
  weaponName: WeaponName;
  modifier: number;
  weaponTraits: WeaponTrait[];
}
