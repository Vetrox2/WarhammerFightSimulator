import { HitSuccessMissReason } from './hit-success-miss-reason.model';
import { WeaponName } from './weapon-name.enum';

export interface Round {
  attackingWeaponName: WeaponName;
  hitSuccessFailReason: HitSuccessMissReason;
  defendingCharID: string;
  defendingCharCurrentHP: number;
}
