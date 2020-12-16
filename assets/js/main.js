/*
	Diese Datei ist Teil von LudoJS.
	Copyright (C) 2020 bei SuperSaiyajinStackZ.

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

import { GameAction_GetFirstAvlFigur, GameAction_NextFigur, GameAction_PreviousFigur, GameAction_Play, GameAction_NextPHandle } from './gameAction.js';
import { CoreHelper_RefreshField, CoreHelper_RollDice, ClearDice, InitGraphics } from './core/coreHelper.js';
import { LudoGame } from './core/game.js';
let Game, alreadyLoaded = false;

document.getElementById("GameStart").onclick = () => Init();
document.getElementById("HomePage").onclick = function() {
	window.location.href = "https://supersaiyajinstackz.github.io/";
};

/* Würfel Roll checks. */
document.getElementById("RollDice").onclick = function() {
	Game.SetErgebnis(CoreHelper_RollDice()); // Roll den Würfel.
	GameAction_GetFirstAvlFigur(Game);

	if (Game.GetSelectedFigur() == -1) {
		GameAction_NextPHandle(Game);
		document.getElementById("CurrentPlayer").innerText = (Game.GetCurrentPlayer() + 1).toString();

		document.getElementById("FigureSelection").classList.add("showNone");
		document.getElementById("DiceRoll").classList.remove("showNone");

	} else {
		document.getElementById("FigureSelection").classList.remove("showNone");
		document.getElementById("DiceRoll").classList.add("showNone");
		CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), true);
	}
};

/* Figuren-wechsel. */
document.getElementById("PreviousFigur").onclick = function() {
	GameAction_PreviousFigur(Game);
	CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), true);
};

document.getElementById("PlayFigur").onclick = function() {
	if (GameAction_Play(Game)) {
		CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), false);

		let dones = 0;
		for (let i = 0; i < Game.GetFigurAmount(); i++) {
			if (Game.GetDone(Game.GetCurrentPlayer(), i)) dones++;
		}

		/* Falls alle am Ziel sind -> Fertig! */
		if (dones == Game.GetFigurAmount()) {
			alert("Player " + (Game.GetCurrentPlayer() + 1).toString() + " won!");
			ResetGame();

			document.getElementById("FigureSelection").classList.add("showNone");
			document.getElementById("DiceRoll").classList.remove("showNone");

			return;
		}

		GameAction_NextPHandle(Game);

		document.getElementById("CurrentPlayer").innerText = (Game.GetCurrentPlayer() + 1).toString();
		document.getElementById("FigureSelection").classList.add("showNone");
		document.getElementById("DiceRoll").classList.remove("showNone");
	}
};

document.getElementById("NextFigur").onclick = function() {
	GameAction_NextFigur(Game);
	CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), true);
};

/*
	Initialisiert das Spiel.
*/
function Init() {
	/* Überprüfe Spieler Anzahl. */
	if (document.getElementById("PlayerAmount").value > 4 || document.getElementById("PlayerAmount").value <= 1) {
		alert("The min amount for the Players is: 2!\nThe max amount for the Players is: 4!");
		return;
	}

	/* Überprüfe Figuren Anzahl. */
	if (document.getElementById("FigurAmount").value > 4 || document.getElementById("FigurAmount").value <= 0) {
		alert("The min amount for the Figures is: 1!\nThe max amount for the Figures is: 4!");
		return;
	}

	Game = new LudoGame(document.getElementById("PlayerAmount").value, document.getElementById("FigurAmount").value);

	InitGraphics();
	document.getElementById("LoadingText").classList.remove("showNone");
	if (!alreadyLoaded) setTimeout(LoadGame, 1000); // Waiting 1 second to let graphics properly load.
	else LoadGame(); // Else if already graphics loaded on first begin -> go directly in game.
};

/*
	Lade das Spiel.
*/
function LoadGame() {
	if (!alreadyLoaded) document.getElementById("LoadingText").classList.add("showNone");
	/* Verstecke Einstellungs screen und zeige spiel screen an. */
	document.getElementById("GamePrepare").classList.add("showNone");
	document.getElementById("GamePlay").classList.remove("showNone");
	document.getElementById("Dice").classList.remove("showNone");
	ClearDice();
	document.getElementById("CurrentPlayer").innerText = 1; // Spieler 1.
	CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), false);
	alreadyLoaded = true;
};

/*
	Setzt das Spiel zurück und kehrt zum Haupt-Menü zurück.
*/
function ResetGame() {
	Game = undefined; // Bereinige das Spiel.

	document.getElementById("PlayerAmount").value = 2;
	document.getElementById("FigurAmount").value = 1;

	/* Verstecke Spiel screen und gehe zurück zum Haupt-Bildschirm. */
	document.getElementById("GamePrepare").classList.remove("showNone");
	document.getElementById("GamePlay").classList.add("showNone");
	document.getElementById("Dice").classList.add("showNone");
	document.getElementById("CurrentPlayer").innerText = 1; // Spieler 1.
};