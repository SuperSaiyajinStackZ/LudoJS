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

import { LudoPlayer } from './player.js';

export class LudoGame {
	constructor(pNum, fNum) {
		this.pAmount = Math.min(4, pNum); // Spieler Anzahl.
		this.CurrentPlayer = 0; // Aktueller Spieler, beginnend mit 0.
		this.canContinue = false; // Kann Fortfahren -> Nein.
		this.ergebnis = 0; // Das Würfel Ergebnis.
		this.figur = 0; // Die ausgewählte Figur.
		this.Players = new Array(); // Ein neuer Array für die Spieler.

		/* Initialisiere Spieler. */
		for (let i = 0; i < this.pAmount; i++) {
			this.Players.push(new LudoPlayer(Math.min(4, fNum)));
		}
	};

	/* Anzahl. */
	GetPlayerAmount() { return this.pAmount; }; // Spieler-Anzahl.
	GetFigurAmount() { return this.Players[0].GetAmount(); }; // Figuren-Anzahl.

	/* Der aktuelle Spieler. */
	GetCurrentPlayer() { return this.CurrentPlayer; };
	SetCurrentPlayer(v) { this.CurrentPlayer = v; };

	/* Die Position der Figuren. */
	GetPosition(player, figur) { return this.Players[player].GetPosition(figur); };
	SetPosition(player, figur, pos) { this.Players[player].SetPosition(figur, pos); };

	/* Ob bereits am Ziel. */
	GetDone(player, figur) { return this.Players[player].GetDone(figur); };
	SetDone(player, figur, isDone) { this.Players[player].SetDone(figur, isDone); };

	/* Das Ergebnis des Würfels. */
	GetErgebnis() { return this.ergebnis; };
	SetErgebnis(v) { this.ergebnis = v; };

	/* Ob fortfahren möglich ist. */
	GetCanContinue() { return this.canContinue; };
	SetCanContinue(v) { this.canContinue = v; };

	/* Die ausgewählte Figur. */
	GetSelectedFigur() { return this.figur; };
	SetSelectedFigur(v) { this.figur = v; };
};