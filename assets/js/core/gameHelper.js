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

/*
	Der komplette code stammt von Ludo3DS.
	Ich habe den code zu Javascript portiert.
*/

/*
	Konvertiere die Position eines Spielers zu der Haupt-Perspektive.

	Player: Der Spieler-Index. ( 0 - 3 ).
	Position: Die Position.
*/
export function GameHelper_PositionConvert(Player, Position) {
	if (Position == 0) return 0; // 0.. ist immer 0.
	if (Position > 40) return Position; // Über 40.. ist immer über 40.

	switch(Player) {
		case 0:
			return Position; // Wir haben die Haupt-Position von der Spieler 1 Perspektive.

		case 1:
			if (Position < 31) return 10 + Position;
			else if (Position > 30 && Position < 41) return Position - 30;

		case 2:
			if (Position < 21) return 20 + Position;
			else if (Position > 20 && Position < 41) return Position - 20;

		case 3:
			if (Position < 11) return 30 + Position;
			else if (Position > 10 && Position < 41) return Position - 10;
	}

	return 0;
};

/*
	Wiedergebe, ob ein Spieler schon gewonnen hat.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
*/
export function GameHelper_HasFinished(game, player) {
	if (!game) return false; // Spiel ist nicht gültig.

	for (let figur = 0; figur < game.GetFigurAmount(); figur++) {
		if (!game.GetDone(player, figur)) return false; // Ein Spieler ist nocht nicht am Ende.
	}

	return true;
};

/*
	Wiedergebe, ob die eigene Figur einen blockiert.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
	figur: Der Figuren-Index.
	ergebnis: Das Ergebnis des Würfels, welches überprüft werden soll.
*/
export function GameHelper_DoesOwnFigurBlock(game, player, figur, ergebnis) {
	if (!game) return true; // Spiel ist nicht gültig.

	const Position = GameHelper_PositionConvert(player, game.GetPosition(player, figur) + ergebnis);

	/* Überprüfe für alle Figuren eines Spielers. */
	for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
		if (figur2 != figur) {
			const Position2 = GameHelper_PositionConvert(player, game.GetPosition(player, figur2));

			if (Position == Position2) return true; // Position passt zu Position2. Blockiert!
		}
	}

	return false;
};

/*
	Wiedergebe, ob alle Spieler am Anfangs-Bereich sind. (Haus)

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
*/
export function GameHelper_AllFiguresInHouse(game, player) {
	if (!game) return true; // Spiel ist nicht gültig.

	for (let figur = 0; figur < game.GetFigurAmount(); figur++) {
		if (game.GetPosition(player, figur) != 0) return false; // Mindestens ein Spieler ist nicht am Anfang.
	}

	return true;
};

/*
	Die Kick Aktion!

	Kicke Spieler ins eigene Startfeld zurück, falls sie auf dem aktuellen Feld standen.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
	figur: Der Figuren-Index.
*/
export function GameHelper_KickAction(game, player, figur) {
	if (!game) return; // Spiel ist nicht gültig.
	const test = game.GetPosition(player, figur);
	if (test == 0 || test > 40) return; // 0 und 40 + können nicht gekickt werden.


	const Position = GameHelper_PositionConvert(player, game.GetPosition(player, figur));

	for (let player2 = 0; player2 < game.GetPlayerAmount(); player2++) {
		if (player2 != player) {
			for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
				const Position2 = GameHelper_PositionConvert(player2, game.GetPosition(player2, figur2));

				if (Position2 < 41) {
					if (Position == Position2) {
						game.SetPosition(player2, figur2, 0);
						break; // Nur ein Spieler kann jeweils draufgewesen sein.
					}
				}
			}
		}
	}
};

/*
	Wiedergebe, ob ein handle vom Spieler-Haus getätigt werden muss.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
*/
export function GameHelper_NeedsToHandleFromHouse(game, player) {
	if (!game) return true; // Spiel ist nicht gültig.

	for (let figur = 0; figur < game.GetFigurAmount(); figur++) {
		if (!game.GetDone(player, figur)) {
			const position = game.GetPosition(player, figur);

			if (position > 0 && position < 44) return false; // Die Figur lässt sich noch außerhalb steuern.
		}
	}

	return true;
};

/*
	Markiere als "Fertig", wenn möglich.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
	figur: Der Figuren-Index.
*/
export function GameHelper_MarkAsDone(game, player, figur) {
	if (!game) return; // Spiel ist nicht gültig.
	if (game.GetDone(player, figur)) return; // Bereits am Ziel.
	if (game.GetPosition(player, figur) < 41) return; // Erst ab 41 überprüfen!!!

	const Position = game.GetPosition(player, figur);
	let alreadyUsed = false; // Check variable.

	/* Checke für 44. */
	for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
		if (figur2 != figur) {
			const Position2 = game.GetPosition(player, figur2);

			if (Position2 == 44) {
				alreadyUsed = true; // Position bereits benutzt.
				break;
			}
		}
	}

	if (!alreadyUsed) {
		if (Position == 44) {
			game.SetDone(player, figur, true); // Wir sind fertig.
			return;

		} else {
			return;
		}
	}

	alreadyUsed = false; // Setze status zurück.
	/* Checke für 43. */
	for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
		if (figur2 != figur) {
			const Position2 = game.GetPosition(player, figur2);

			if (Position2 == 43) {
				alreadyUsed = true; // Position bereits benutzt.
				break;
			}
		}
	}

	if (!alreadyUsed) {
		if (Position == 43) {
			game.SetDone(player, figur, true); // Wir sind fertig.
			return;

		} else {
			return;
		}
	}

	alreadyUsed = false; // Setze status zurück.
	/* Checke für 42. */
	for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
		if (figur2 != figur) {
			const Position2 = game.GetPosition(player, figur2);

			if (Position2 == 42) {
				alreadyUsed = true; // Position bereits benutzt.
				break;
			}
		}
	}

	if (!alreadyUsed) {
		if (Position == 42) {
			game.SetDone(player, figur, true); // Wir sind fertig.
			return;

		} else {
			return;
		}
	}


	if (Position == 41) game.SetDone(player, figur, true); // Wir sind fertig.
};

/*
	Wiedergebe, ob die Figur sich bewegen kann.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
	figur: Der Figuren-Index.
	ergebnis: Das Ergebnis des Würfels, welche überprüft werden soll.
*/
export function GameHelper_CanMove(game, player, figur, ergebnis) {
	if (!game) return false; // Spiel ist nicht gültig.
	if (game.GetDone(player, figur)) return false; // Bereits am Ziel.
	if (game.GetPosition(player, figur) + ergebnis > 44) return false; // Größer als 44.

	/* Überprüfe vom Haus. */
	if (game.GetPosition(player, figur) == 0) {
		if (ergebnis == 6) {
			const TempPos = GameHelper_PositionConvert(player, game.GetPosition(player, figur) + 1);

			/* Überprüfe für alle Figuren. */
			for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
				if (figur2 != figur) { // Überprüfe nicht die aktuell benutzte Figur!
					const Position = GameHelper_PositionConvert(player, game.GetPosition(player, figur2));

					if (TempPos == Position) return false; // TempPos passt zu Position. Blockiert!
				}
			}

			return true;

		} else {
			return false;
		}
	}

	/* Überprüfe Innerhalb des Außen-Feldes. */
	if (game.GetPosition(player, figur) + ergebnis < 41) {
		const Position = GameHelper_PositionConvert(player, game.GetPosition(player, figur) + ergebnis);

		/* Überprüfe außerhalb des Hauses. */
		for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
			if (figur2 != figur) { // Überprüfe nicht die aktuell benutzte Figur!
				const Position2 = GameHelper_PositionConvert(player, game.GetPosition(player, figur2));

				if (Position == Position2) return false; // Position passt zu Position2. Blockiert!
			}
		}

		return true;
	}

	/* Überprüfe im Eingang. */
	if (game.GetPosition(player, figur) + ergebnis > 40) {
		const Position = game.GetPosition(player, figur) + ergebnis;

		for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
			if (figur2 != figur) {
				const Position2 = game.GetPosition(player, figur2);

				if (Position2 == Position) return false; // Position bereits benutzt.
			}
		}

		return true;
	}

	return false;
};

/*
	Wiedergebe, ob eine Figur gekickt werden kann.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
	figur: Der Figuren-Index.
*/
export function GameHelper_CanKick(game, player, figur) {
	if (!game) return false; // Spiel ist nicht gültig.
	const test = game.GetPosition(player, figur);
	if (test == 0 || test > 40) return false; // 0 und 40 + können nicht gekickt werden.


	const Position = GameHelper_PositionConvert(player, game.GetPosition(player, figur));

	for (let pl = 0; pl < game.GetPlayerAmount(); pl++) {
		if (pl != player) {
			for (let fg = 0; fg < game.GetFigurAmount(); fg++) {
				const Position2 = GameHelper_PositionConvert(pl, game.GetPosition(pl, fg));

				if (Position2 < 41) {
					if (Position == Position2) return true;
				}
			}
		}
	}

	return false;
};

/*
	Additionale Checks, ob eine Figur fertig ist.

	Dies wird benutzt, falls eine Figur eventuell eine überspringt.

	game: Eine Referenz zum aktuellen Spiel.
	player: Der Spieler-Index.
	figur: Der Figuren-Index.
*/
export function GameHelper_AdditionalDoneCheck(game, player, figur) {
	if (!game) return; // Spiel ist nicht gültig.
	if (game.GetDone(player, figur)) return; // Bereits am Ziel.
	if (game.GetPosition(player, figur) < 41) return; // Erst ab 41 überprüfen!!!

	const Position = game.GetPosition(player, figur);
	let alreadyUsed = false; // Check variable.

	/* Checke für 44. */
	for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
		if (figur2 != figur) {
			const Position2 = game.GetPosition(player, figur2);

			if (Position2 == 44) {
				alreadyUsed = true; // Position bereits benutzt.
				break;
			}
		}
	}

	if (!alreadyUsed) {
		if (Position == 44) {
			game.SetDone(player, figur, true); // Wir sind fertig.
			return;

		} else {
			return;
		}
	}


	alreadyUsed = false; // Setze status zurück.
	/* Checke für 43. */
	for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
		if (figur2 != figur) {
			const Position2 = game.GetPosition(player, figur2);

			if (Position2 == 43) {
				alreadyUsed = true; // Position bereits benutzt.
				break;
			}
		}
	}

	if (!alreadyUsed) {
		if (Position == 43) {
			game.SetDone(player, figur, true); // Wir sind fertig.
			return;

		} else {
			return;
		}
	}


	alreadyUsed = false; // Setze status zurück.
	/* Checke für 42. */
	for (let figur2 = 0; figur2 < game.GetFigurAmount(); figur2++) {
		if (figur2 != figur) {
			const Position2 = game.GetPosition(player, figur2);

			if (Position2 == 42) {
				alreadyUsed = true; // Position bereits benutzt.
				break;
			}
		}
	}

	if (!alreadyUsed) {
		if (Position == 42) {
			game.SetDone(player, figur, true); // Wir sind fertig.
			return;

		} else {
			return;
		}
	}

	if (Position == 41) game.SetDone(player, figur, true); // Wir sind fertig.
};

/*
	Dies ist dazu gedacht, um den Fortsetzungs-status zu setzen, falls man fortfahren kann.
	Hauptsächlich für die Würfel-Züge.

	game: Das aktuelle Spiel.
	player: Der aktuelle Spieler.
*/
export function GameHelper_SetContinue(game, player) {
	/* Sollte NICHT passieren, aber man weiss ja nie, LoL. */
	if (game.GetAVLDiceRolls() == 0) {
		game.SetCanContinue(false);
		return;
	}

	game.SetAVLDiceRolls(game.GetAVLDiceRolls() - 1); // Reduziere um 1.

	if (game.GetAVLDiceRolls() > 0) {
		for (let fg = 0; fg < game.GetFigurAmount(); fg++) {
			/* Überprüfe ob mindestens eine Figur außer Haus ist und noch nicht am Ziel ist. */
			if (game.GetPosition(player, fg) > 0) {
				if (!game.GetDone(player, fg)) {
					game.SetCanContinue(false); // Da der aktuelle Spieler noch eine Figur draußen hat, die noch nicht am Ziel ist.
					return;
				}
			}
		}
	}

	game.SetCanContinue(game.GetAVLDiceRolls() > 0);
}