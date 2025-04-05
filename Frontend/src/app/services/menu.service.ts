import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { CharacterDTO } from '../models/character-dto.model';
import { CharacterTeam } from '../models/character-team.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private selectedCharactersLeft = signal<CharacterDTO[]>([]);
  private selectedCharactersRight = signal<CharacterDTO[]>([]);

  getSelectedCharacters(team: CharacterTeam) {
    switch (team) {
      case CharacterTeam.TeamA:
        return this.selectedCharactersLeft.asReadonly();
      case CharacterTeam.TeamB:
        return this.selectedCharactersRight.asReadonly();
      case CharacterTeam.Both:
        return computed(() => [
          ...this.selectedCharactersLeft(),
          ...this.selectedCharactersRight(),
        ]);
      default:
        console.error('Wrong team selected');
        return this.selectedCharactersLeft.asReadonly();
    }
  }

  addCharacter(char: CharacterDTO) {
    switch (char.team) {
      case CharacterTeam.TeamA:
        this.addCharacterToCollection(this.selectedCharactersLeft, char);
        break;
      case CharacterTeam.TeamB:
        this.addCharacterToCollection(this.selectedCharactersRight, char);
        break;
    }
  }

  removeCharacter(index: number, team: CharacterTeam) {
    switch (team) {
      case CharacterTeam.TeamA:
        this.removeCharacterFromCollection(this.selectedCharactersLeft, index);
        break;
      case CharacterTeam.TeamB:
        this.removeCharacterFromCollection(this.selectedCharactersRight, index);
        break;
    }
  }

  private addCharacterToCollection(
    collection: WritableSignal<CharacterDTO[]>,
    char: CharacterDTO
  ) {
    collection.update((array) => [...array, char]);
  }

  private removeCharacterFromCollection(
    collection: WritableSignal<CharacterDTO[]>,
    index: number
  ) {
    collection.update((array) => {
      const newArray = [...array];
      newArray.splice(index, 1);
      return newArray;
    });
  }
}
