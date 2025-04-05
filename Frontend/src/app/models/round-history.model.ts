import { CharacterDTO } from './character-dto.model';
import { CharacterTeam } from './character-team.model';
import { Round } from './round.model';

export interface RoundHistory {
  rounds: Round[];
  teamA: CharacterDTO[];
  teamB: CharacterDTO[];
  winnerTeam: CharacterTeam;
}
