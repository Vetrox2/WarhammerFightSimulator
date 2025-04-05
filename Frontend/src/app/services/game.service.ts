import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import {
  EMPTY,
  Observable,
  catchError,
  forkJoin,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { RoundHistory } from '../models/round-history.model';
import { CharacterDTO } from '../models/character-dto.model';
import { HttpClient } from '@angular/common/http';
import { CharacterAvatarMap } from '../models/character-avatar.map';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiService = inject(ApiService);
  private readonly http = inject(HttpClient);

  private _currentRoundHistory = signal<RoundHistory | null>(null);
  private _defaultCharacters = signal<CharacterDTO[]>([]);

  gameStarted = computed(() => this._currentRoundHistory() !== null);

  public get currentRoundHistory() {
    return this._currentRoundHistory.asReadonly();
  }

  public get defaultCharacters() {
    return this._defaultCharacters.asReadonly();
  }

  public fetchDefaultCharacters(): void {
    this.apiService
      .get<CharacterDTO[]>('fight/defaultChar')
      .pipe(
        switchMap((characters) =>
          this.mapToCharactersWithAvatarUrl(characters)
        ),
        catchError(() => EMPTY)
      )
      .subscribe((characters) => {
        this._defaultCharacters.set(characters);
      });
  }

  public fetchBattleHistory(model: CharacterDTO[]): void {
    this.apiService
      .post<RoundHistory>('fight/battleresult', model)
      .pipe(
        switchMap((result) =>
          forkJoin({
            teamA: this.mapToCharactersWithAvatarUrl(result.teamA),
            teamB: this.mapToCharactersWithAvatarUrl(result.teamB),
          }).pipe(
            tap(({ teamA, teamB }) => {
              result.teamA = teamA;
              result.teamB = teamB;
              this._currentRoundHistory.set(result);
            })
          )
        ),
        catchError(() => {
          console.error('Error happened while fetching battle history');
          return EMPTY;
        })
      )
      .subscribe();
  }

  goToMenu() {
    this._currentRoundHistory.set(null);
  }

  private mapToCharactersWithAvatarUrl(
    characters: CharacterDTO[]
  ): Observable<CharacterDTO[]> {
    return this.http.get<CharacterAvatarMap[]>('/assets/avatar-map.json').pipe(
      map((maps) => {
        return characters.map((char) => {
          const charMap =
            maps.find((map) => map.name === char.name) ??
            maps.find((map) => map.name === 'Default');
          return {
            ...char,
            smallURL: charMap?.avatar_url ?? '',
            bigURL: charMap?.character_url ?? '',
          };
        });
      })
    );
  }
}
