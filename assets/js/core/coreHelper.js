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

import { LudoGame } from './game.js';
import { GameHelper_PositionConvert } from './gameHelper.js';

let Haus, Fields, MainField, Chips, selector, Dices;
export let initialized = false;

/* Wechsel die Sprache. */
document.getElementById("SwitchLang").onclick = function() {
	console.log(document.documentElement.lang);
	if (document.documentElement.lang == "en") window.location.href = "/de";
	else window.location.href = "/en";
}

/* Initialisiere die Grafiken damit sie nicht noch einmal geladen werden müssen. */
export function InitGraphics() {
	if (!initialized) {
		Haus = new Array(4);
		Fields = new Array(4);
		Chips = new Array(4);
		Dices = new Array(6);

		/* Initialisiere Chips, Häuser und Felder. */
		for (let i = 0; i < 4; i++) {
			Chips[i] = new Image(18, 18);
			Chips[i].src = "assets/images/chips/chip_" + (i + 1).toString() + ".png";

			Haus[i] = new Image(76, 76);
			Haus[i].src = "assets/images/houses/home_" + (i + 1).toString() + ".png";
			Fields[i] = new Image(94, 37);
			Fields[i].src = "assets/images/fields/fields_" + (i + 1).toString() + ".png";
		}

		/* Initialisiere die Würfel. */
		for (let i = 0; i < 6; i++) {
			Dices[i] = new Image(80, 80);
			Dices[i].src = "assets/images/dices/dice_" + (i + 1).toString() + ".png";
		}

		MainField = new Image(210, 210);
		MainField.src = "assets/images/fields/main_field.png";

		selector = new Image(18, 18);
		selector.src = "assets/images/chips/chip_selector.png";

		initialized = true;
	}
};

/* Rolle den Würfel. */
export function CoreHelper_RollDice() {
	let val = Math.floor(Math.random() * 6) + 1;
	DrawDice(val - 1); // - 1, weil array startet ab NULL.
	return val;
};

/*
	Zeichnet den Würfel.

	res: Ergebnis.
*/
function DrawDice(res) {
	let element = document.getElementById("Dice");
	let drawContext = element.getContext('2d');

	drawContext.drawImage(Dices[res], 0, 0);
};

/* Reinigt den Würfel. */
export function ClearDice() {
	const element = document.getElementById("Dice");
	const drawContext = element.getContext('2d');
	drawContext.clearRect(0, 0, element.width, element.height);
};


/*
	Die Eingangs-Felder Positionen für die Figuren.

	Spieler * 4.. von 0 - 3.
*/
const EingangField = [
	[ 96, 172 ],
	[ 96, 153 ],
	[ 96, 134 ],
	[ 96, 115 ],

	[ 20, 96 ],
	[ 39, 96 ],
	[ 58, 96 ],
	[ 77, 96 ],

	[ 96, 20 ],
	[ 96, 39 ],
	[ 96, 58 ],
	[ 96, 77 ],

	[ 172, 96 ],
	[ 153, 96 ],
	[ 134, 96 ],
	[ 115, 96 ]
];

/*
	Haus-Felder der Figuren.

	Spieler * 4.. von 0 - 3.
*/
const PlayerField = [
	[ 17, 151 ],
	[ 41, 151 ],
	[ 17, 175 ],
	[ 41, 175 ],

	[ 17, 17 ],
	[ 41, 17 ],
	[ 17, 41 ],
	[ 41, 41 ],

	[ 151, 17 ],
	[ 175, 17 ],
	[ 151, 41 ],
	[ 175, 41 ],

	[ 151, 151 ],
	[ 175, 151 ],
	[ 151, 175 ],
	[ 175, 175 ]
];

/*
	Haupt-Feld Positionen für die Figuren.

	Beinhaltet nur die Äußeren Felder.
*/
const MainFieldPos = [
	[ 77, 191 ],
	[ 77, 172 ],
	[ 77, 153 ],
	[ 77, 134 ],
	[ 77, 115 ],

	[ 58, 115 ],
	[ 39, 115 ],
	[ 20, 115 ],
	[ 1, 115 ],

	[ 1, 96 ],
	[ 1, 77 ],

	[ 20, 77 ],
	[ 39, 77 ],
	[ 58, 77 ],
	[ 77, 77 ],

	[ 77, 58 ],
	[ 77, 39 ],
	[ 77, 20 ],
	[ 77, 1 ],

	[ 96, 1 ],
	[ 115, 1 ],

	[ 115, 20 ],
	[ 115, 39 ],
	[ 115, 58 ],
	[ 115, 77 ],

	[ 134, 77 ],
	[ 153, 77 ],
	[ 172, 77 ],
	[ 191, 77 ],

	[ 191, 96 ],
	[ 191, 115 ],

	[ 172, 115 ],
	[ 153, 115 ],
	[ 134, 115 ],
	[ 115, 115 ],

	[ 115, 134 ],
	[ 115, 153 ],
	[ 115, 172 ],
	[ 115, 191 ],

	[ 96, 191 ]
];

/*
	Refresht das Spielfeld.

	Game: Das Spiel.
	selection: Die Figuren Selektion.
	drawSel: Ob die Selektion gezeichnet werden soll oder nicht.
*/
export function CoreHelper_RefreshField(Game, selection, drawSel) {
	let element = document.getElementById("GameField");
	let drawContext = element.getContext('2d');

	drawContext.drawImage(MainField, 0, 0); // Haupt-Feld.

	drawContext.drawImage(Haus[0], 0, 134); // Haus 1.
	drawContext.drawImage(Haus[1], 0, 0); // Haus 2.
	drawContext.drawImage(Haus[2], 134, 0); // Haus 3.
	drawContext.drawImage(Haus[3], 134, 134); // Haus 4.

	drawContext.drawImage(Fields[0], 77, 115); // Field 1.
	drawContext.drawImage(Fields[1], 1, 77); // Field 2.
	drawContext.drawImage(Fields[2], 96, 1); // Field 3.
	drawContext.drawImage(Fields[3], 115, 96); // Field 4.

	for (let i = 0; i < Game.GetPlayerAmount(); i++) {
		CoreHelper_DrawPlayer(i, Game, drawContext);
	}

	if (drawSel) CoreHelper_DrawSelection(Game, selection, drawContext);
};

/*
	Zeichnet den Spieler.

	player: Der Spieler.
	Game: Das Spiel.
	drawContext: Der Kontext zum zeichnen.
*/
export function CoreHelper_DrawPlayer(player, Game, drawContext) {
	for (let figur = 0; figur < Game.GetFigurAmount(); figur++) {
		const position = Game.GetPosition(player, figur);

		/* 0 --> Startfeld. */
		if (position == 0) {
			drawContext.drawImage(Chips[player],
				PlayerField[(player * 4) + figur][0], PlayerField[(player * 4) + figur][1]);

		} else if (position > 0 && position < 41) {
			drawContext.drawImage(Chips[player],
				MainFieldPos[GameHelper_PositionConvert(player, position) - 1][0],
				MainFieldPos[GameHelper_PositionConvert(player, position) - 1][1]);

		/* Falls wir in den Eingangs-Bereich kommen. */
		} else if (position > 40) {
			drawContext.drawImage(Chips[player],
				EingangField[(player * 4) + (position - 41)][0], EingangField[(player * 4) + (position - 41)][1]);
		}
	}
};

/*
	Zeichnet die Selektion.

	Game: Das Spiel.
	selection: Die Selektion.
	drawContext: Der Kontext zum zeichnen.
*/
export function CoreHelper_DrawSelection(Game, selection, drawContext) {
	const player = Game.GetCurrentPlayer();
	const figur = selection;
	const position = Game.GetPosition(player, figur);

	/* 0 --> Startfeld. */
	if (position == 0) {
		drawContext.drawImage(selector,
			PlayerField[(player * 4) + figur][0], PlayerField[(player * 4) + figur][1]);

	} else if (position > 0 && position < 41) {
		drawContext.drawImage(selector,
			MainFieldPos[GameHelper_PositionConvert(player, position) - 1][0],
			MainFieldPos[GameHelper_PositionConvert(player, position) - 1][1]);

	/* Falls wir in den Eingangs-Bereich kommen. */
	} else if (position > 40) {
		drawContext.drawImage(selector,
			EingangField[(player * 4) + (position - 41)][0], EingangField[(player * 4) + (position - 41)][1]);
	}
};