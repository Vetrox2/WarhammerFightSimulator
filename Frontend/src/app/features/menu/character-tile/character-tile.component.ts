import { Component, EventEmitter, input, Output } from '@angular/core';
import { CharacterDTO } from '../../../models/character-dto.model';

@Component({
  selector: 'app-character-tile',
  imports: [],
  templateUrl: './character-tile.component.html',
  styleUrl: './character-tile.component.css'
})
export class CharacterTileComponent {
  @Output() remove = new EventEmitter();
  character = input.required<CharacterDTO>();

  removeCharacter(){
    this.remove.emit();
  }
}
