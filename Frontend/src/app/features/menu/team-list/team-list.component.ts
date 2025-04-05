import { NgFor } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { GameService } from '../../../services/game.service';
import { MenuService } from '../../../services/menu.service';
import { CharacterTeam } from '../../../models/character-team.model';
import { CharacterDTO } from '../../../models/character-dto.model';
import { CharacterTileComponent } from '../character-tile/character-tile.component';

@Component({
  selector: 'app-team-list',
  imports: [NgFor, CharacterTileComponent],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css',
})
export class TeamListComponent implements OnInit {
  @Input({ required: true }) teamSide!: CharacterTeam;

  private readonly gameService = inject(GameService);
  private readonly menuService = inject(MenuService);

  defaultCharacters = this.gameService.defaultCharacters;
  selectedCharacters: Signal<CharacterDTO[]> = signal([]);

  addCharacter(character: CharacterDTO) {
    const characterCopy = { ...character };
    characterCopy.team = this.teamSide;
    this.menuService.addCharacter(characterCopy);
  }

  removeCharacter(index: number) {
    this.menuService.removeCharacter(index, this.teamSide);
  }

  ngOnInit(): void {
    this.selectedCharacters = this.menuService.getSelectedCharacters(
      this.teamSide
    );
  }
}
