/*
	Diese Datei ist Teil von LudoJS.
	Copyright (C) 2020-2021 bei SuperSaiyajinStackZ.

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

	Additional Terms 7.b and 7.c of GPLv3 apply to this file:
		* Requiring preservation of specified reasonable legal notices or
		  author attributions in that material or in the Appropriate Legal
		  Notices displayed by works containing it.
		* Prohibiting misrepresentation of the origin of that material,
		  or requiring that modified versions of such material be marked in
		  reasonable ways as different from the original version.
*/

import { LudoGame } from './core/game.js';
import { GameHelper_CanMove, GameHelper_DoesOwnFigurBlock, GameHelper_MarkAsDone, GameHelper_AdditionalDoneCheck, GameHelper_KickAction } from './core/gameHelper.js';

/*
	Gehe zur nächsten Figur, falls verfügbar.
*/
export function GameAction_NextFigur(Game) {
	if (Game.GetSelectedFigur() == Game.GetFigurAmount() - 1) return; // Bereits an der letzten Figur.

	for (let cFigur = Game.GetSelectedFigur() + 1; cFigur < Game.GetFigurAmount(); cFigur++) {
		if (GameHelper_CanMove(Game, Game.GetCurrentPlayer(), cFigur, Game.GetErgebnis())) {
			Game.SetSelectedFigur(cFigur);
			return;
		}
	}
};

/*
	Gehe zur vorherigen Figur, falls verfügbar.
*/
export function GameAction_PreviousFigur(Game) {
	if (Game.GetSelectedFigur() == 0) return; // Bereits an der ersten figur.

	for (let cFigur = Game.GetSelectedFigur() - 1; cFigur >= 0; cFigur--) {
		if (GameHelper_CanMove(Game, Game.GetCurrentPlayer(), cFigur, Game.GetErgebnis())) {
			Game.SetSelectedFigur(cFigur);
			return;
		}
	}
};

/*
	Gehe zur ersten verfügbaren Figur-Selektion.
*/
export function GameAction_GetFirstAvlFigur(Game) {
	for (let cFigur = 0; cFigur < Game.GetFigurAmount(); cFigur++) {
		if (GameHelper_CanMove(Game, Game.GetCurrentPlayer(), cFigur, Game.GetErgebnis())) {
			Game.SetSelectedFigur(cFigur);
			return;
		}
	}

	Game.SetSelectedFigur(-1);
};


/*
	Die Spiel-Logik.

	Wiedergibt (false), falls nicht spielbar.
*/
export function GameAction_Play(Game) {
	const position = Game.GetPosition(Game.GetCurrentPlayer(), Game.GetSelectedFigur());

	/* 0 --> Auf Feld 1, falls das Ergebnis eine 6 war, ansonsten ungültig. */
	if (position == 0) {
		if (Game.GetErgebnis() == 6) {
			if (!GameHelper_DoesOwnFigurBlock(Game, Game.GetCurrentPlayer(), Game.GetSelectedFigur(), 1)) {
				Game.SetPosition(Game.GetCurrentPlayer(), Game.GetSelectedFigur(), 1);
				Game.SetCanContinue(true);

				/* Führe die Kick Aktion aus. */
				GameHelper_KickAction(Game, Game.GetCurrentPlayer(), Game.GetSelectedFigur());

				return true;

			} else {
				return false; // Die Eigene Figur blockt.
			}

		} else {
			return false; // Position 0 und keine 6 -> Ungültig!
		}

		/* Falls die Position nicht 0 ist. */
	} else {
		if (position + Game.GetErgebnis() < 45) {
			if (!GameHelper_DoesOwnFigurBlock(Game, Game.GetCurrentPlayer(), Game.GetSelectedFigur(), Game.GetErgebnis())) {
				Game.SetPosition(Game.GetCurrentPlayer(), Game.GetSelectedFigur(), position + Game.GetErgebnis());
				GameHelper_MarkAsDone(Game, Game.GetCurrentPlayer(), Game.GetSelectedFigur());

				/* Führe die Kick Aktion aus. */
				GameHelper_KickAction(Game, Game.GetCurrentPlayer(), Game.GetSelectedFigur());

				for (let i = 0; i < Game.GetFigurAmount(); i++) {
					GameHelper_AdditionalDoneCheck(Game, Game.GetCurrentPlayer(), i);
				}

				Game.SetCanContinue((Game.GetErgebnis() == 6));
				return true;

			} else {
				return false; // Die Eigene Figur blockt.
			}

		} else {
			return false; // Größer als 44.
		}
	}
};

/*
	Nächster Spieler Handle.
*/
export function GameAction_NextPHandle(Game) {
	/* Setze Werte zurück für den nächsten Zug. */
	Game.SetErgebnis(0);
	Game.SetSelectedFigur(0);

	if (Game.GetCanContinue()) {
		Game.SetCanContinue(false);
		return;
	}

	if (Game.GetCurrentPlayer() < Game.GetPlayerAmount() - 1) {
		Game.SetCurrentPlayer(Game.GetCurrentPlayer() + 1);
		return;

	} else {
		Game.SetCurrentPlayer(0);
	}
};