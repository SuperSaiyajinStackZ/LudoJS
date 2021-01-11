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

import { GameHelper_CanMove, GameHelper_CanKick } from './core/gameHelper.js';
import { GameAction_GetFirstAvlFigur, GameAction_NextFigur, GameAction_PreviousFigur, GameAction_Play, GameAction_NextPHandle } from './gameAction.js';
import { CoreHelper_RefreshField, CoreHelper_RollDice, ClearDice, InitGraphics, CoreHelper_GetFigurTouchIndex } from './core/coreHelper.js';
import { LudoGame } from './core/game.js';
import { touching } from './utils.js';
let Game, UseAI = false;

/* Initialisiere die Grafiken. */
window.onload = function() {
	InitGraphics();
	document.getElementById("ExportGame").classList.add("showNone");
};

/* Computer checkbox. */
document.getElementById("EnableAI").onclick = () => UseAI = document.getElementById("EnableAI").checked;

/* Starte das Spiel. */
document.getElementById("GameStart").onclick = () => Init();

/* Gehe zur Hauptseite. */
document.getElementById("HomePage").onclick = () => window.location.href = "https://supersaiyajinstackz.github.io/";

/* Verstecke die Info box. */
document.getElementById("InfoBoxBtn").onclick = function() {
	document.getElementById("InfoBox").classList.add("showNone");
};

/* Würfel Roll checks. */
document.getElementById("Dice").onclick = function() {
	if (!document.getElementById("DiceRoll").classList.contains("showNone")) {
		Game.SetErgebnis(CoreHelper_RollDice()); // Roll den Würfel.
		GameAction_GetFirstAvlFigur(Game);

		if (Game.GetSelectedFigur() == -1) {
			GameAction_NextPHandle(Game);
			PlayerSwitchHandle();

		} else {
			document.getElementById("FigureSelection").classList.remove("showNone");
			document.getElementById("DiceRoll").classList.add("showNone");
			CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), true);
		}

	} else if (!document.getElementById("AIRound").classList.contains("showNone")) {
		AI_Handle();
	}
};

/* Würfel Roll checks. */
document.getElementById("RollDice").onclick = function() {
	Game.SetErgebnis(CoreHelper_RollDice()); // Roll den Würfel.
	GameAction_GetFirstAvlFigur(Game);

	if (Game.GetSelectedFigur() == -1) {
		GameAction_NextPHandle(Game);
		PlayerSwitchHandle();

	} else {
		document.getElementById("FigureSelection").classList.remove("showNone");
		document.getElementById("DiceRoll").classList.add("showNone");
		CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), true);
	}
};

/*
	Eine Alternative Steuerung für die Figuren.
	Anstatt auf "Figur Spielen" zu drücken, kann Sie direkt ausgewählt werden!
*/
document.getElementById("GameField").onclick = function(e) {
	if (!document.getElementById("FigureSelection").classList.contains("showNone")) {

		for (let i = 0; i < Game.GetFigurAmount(); i++) {
			const Pos = CoreHelper_GetFigurTouchIndex(Game, Game.GetCurrentPlayer(), i);

			if (touching(Pos[0], Pos[1], Pos[2], Pos[3], e)) {
				Game.SetSelectedFigur(i);

				if (GameAction_Play(Game)) {
					CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), false);

					let dones = 0;
					for (let i = 0; i < Game.GetFigurAmount(); i++) {
						if (Game.GetDone(Game.GetCurrentPlayer(), i)) dones++;
					}

					/* Falls alle am Ziel sind -> Fertig! */
					if (dones == Game.GetFigurAmount()) {
						let v = "player_" + (Game.GetCurrentPlayer() + 1) + "_won";
						alert(document.getElementById("STRINGS").dataset.v);
						ResetGame();

						document.getElementById("FigureSelection").classList.add("showNone");
						document.getElementById("DiceRoll").classList.remove("showNone");
						return;
					}

					GameAction_NextPHandle(Game);
					PlayerSwitchHandle();

					break;
				}
			}
		}
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
			let v = "player_" + (Game.GetCurrentPlayer() + 1) + "_won";
			alert(document.getElementById("STRINGS").dataset.v);
			ResetGame();

			document.getElementById("FigureSelection").classList.add("showNone");
			document.getElementById("DiceRoll").classList.remove("showNone");
			return;
		}

		GameAction_NextPHandle(Game);
		PlayerSwitchHandle();
	}
};

document.getElementById("AIClick").onclick = () => AI_Handle();

document.getElementById("NextFigur").onclick = function() {
	GameAction_NextFigur(Game);
	CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), true);
};

/* Initialisiert das Spiel. */
function Init() {
	/* Überprüfe Spieler Anzahl. */
	if (document.getElementById("PlayerAmount").value > 4 || document.getElementById("PlayerAmount").value <= 1) {
		alert(document.getElementById("STRINGS").dataset.player_amount_warn);
		return;
	}

	/* Überprüfe Figuren Anzahl. */
	if (document.getElementById("FigurAmount").value > 4 || document.getElementById("FigurAmount").value <= 0) {
		alert(document.getElementById("STRINGS").dataset.figure_amount_warn);
		return;
	}

	Game = new LudoGame(document.getElementById("PlayerAmount").value, document.getElementById("FigurAmount").value);
	LoadGame();
};


/* Lade das Spiel. */
function LoadGame() {
	/* Verstecke Einstellungs screen und zeige spiel screen an. */
	document.getElementById("ExportGame").classList.remove("showNone");
	document.getElementById("GamePrepare").classList.add("showNone");
	document.getElementById("GamePlay").classList.remove("showNone");
	document.getElementById("Dice").classList.remove("showNone");
	ClearDice();
	document.getElementById("CurrentPlayer").innerText = Game.GetCurrentPlayer() + 1; // + 1 weil 0.
	CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), false);
};

/* Setzt das Spiel zurück und kehrt zum Haupt-Menü zurück. */
function ResetGame() {
	Game = undefined; // Bereinige das Spiel.

	document.getElementById("PlayerAmount").value = 2;
	document.getElementById("FigurAmount").value = 1;

	/* Verstecke Spiel screen und gehe zurück zum Haupt-Bildschirm. */
	document.getElementById("GamePrepare").classList.remove("showNone");
	document.getElementById("GamePlay").classList.add("showNone");
	document.getElementById("Dice").classList.add("showNone");
	document.getElementById("AIRound").classList.add("showNone");
	document.getElementById("CurrentPlayer").innerText = 1; // Spieler 1.
	document.getElementById("ExportGame").classList.add("showNone");

	/* Setze die Schaltflächen Farbe zurück zu Rot. */
	document.getElementById("RollDice").className = "ButtonP1";
	document.getElementById("PreviousFigur").className = "ButtonP1";
	document.getElementById("PlayFigur").className = "ButtonP1";
	document.getElementById("NextFigur").className = "ButtonP1";
	document.getElementById("AIClick").className = "ButtonP1";
	document.getElementById("RollDice").className = "ButtonP1";
};

/* AI / Computer Handle. */
function AI_Handle() {
	Game.SetErgebnis(CoreHelper_RollDice());
	let canMove = false, res = -1;

	for (let figur = 0; figur < Game.GetFigurAmount(); figur++) {
		if (GameHelper_CanMove(Game, Game.GetCurrentPlayer(), figur, Game.GetErgebnis())) {
			/* Fokussiert aufs kicken. ;P */
			if (GameHelper_CanKick(Game, Game.GetCurrentPlayer(), figur)) {
				Game.SetSelectedFigur(figur);
				canMove = true;
				break;

			} else {
				res = figur;
			}
		}
	}

	if (!canMove) {
		if (res != -1) {
			Game.SetSelectedFigur(res);
			canMove = true;
		}
	}

	if (canMove) {
		if (GameAction_Play(Game)) {
			CoreHelper_RefreshField(Game, Game.GetSelectedFigur(), false);

			let dones = 0;
			for (let i = 0; i < Game.GetFigurAmount(); i++) {
				if (Game.GetDone(Game.GetCurrentPlayer(), i)) dones++;
			}

			/* Falls alle am Ziel sind -> Fertig! */
			if (dones == Game.GetFigurAmount()) {
				let v = "player_" + (Game.GetCurrentPlayer() + 1) + "_won";
				alert(document.getElementById("STRINGS").dataset.v);
				ResetGame();

				document.getElementById("FigureSelection").classList.add("showNone");
				document.getElementById("DiceRoll").classList.remove("showNone");
				return;
			}
		}
	}

	GameAction_NextPHandle(Game);
	PlayerSwitchHandle();
};

/* Handle den wechsel für den Spieler. */
function PlayerSwitchHandle() {
	SwitchBTNColor();

	if (UseAI) {
		if (Game.GetCurrentPlayer() != 0) {
			document.getElementById("CurrentPlayer").innerText = (Game.GetCurrentPlayer() + 1).toString();
			document.getElementById("FigureSelection").classList.add("showNone");
			document.getElementById("DiceRoll").classList.add("showNone");
			document.getElementById("AIRound").classList.remove("showNone");

		} else {
			document.getElementById("CurrentPlayer").innerText = (Game.GetCurrentPlayer() + 1).toString();
			document.getElementById("FigureSelection").classList.add("showNone");
			document.getElementById("AIRound").classList.add("showNone");
			document.getElementById("DiceRoll").classList.remove("showNone");
		}

	} else {
		document.getElementById("CurrentPlayer").innerText = (Game.GetCurrentPlayer() + 1).toString();
		document.getElementById("FigureSelection").classList.add("showNone");
		document.getElementById("DiceRoll").classList.remove("showNone");
	}
};

/*
	------------------------------------
			Speicherdaten.
	------------------------------------
*/

/*
	Speicher Struktur von Ludo3DS & LudoJS.
*/
const SavStruct = {
	Current_Player: 0x0,
	Player_Amount: 0x1,
	Figur_Amount: 0x2,

	Figur_Size: 0x2, // 0x0 -> Position, 0x1 -> ob fertig. 0x2 pro Figur.
	Player_Size: 0x8, // Jeweils 4 Figuren, was 0x8 entspricht.

	Player1: 0x3, // 0x3 - 0xA.
	Player2: 0xB, // 0xB - 0x12.
	Player3: 0x13, // 0x13 - 0x1A.
	Player4: 0x1B, // 0x1B - 0x22.

	DataSize: 0x23 // 0x23 --> 35 byte.
};


/* Importiere ein bereits gestartetes Spiel von Ludo3DS oder LudoJS. */
document.getElementById("ImportGame").onclick = function() {
	let input = document.createElement("input");
	input.type = "file";
	input.accept = ".dat";
	input.click(); // Führe Datei-Selektion aus.

	input.onchange = function(e) {
		if (!e.target.files[0]) {
			alert(document.getElementById("STRINGS").dataset.gamedata_not_selected);
			return false;
		}

		let fileSize = e.target.files[0].size;

		if (fileSize == SavStruct.DataSize) {
			let reader = new FileReader();

			reader.readAsArrayBuffer(e.target.files[0]);
			reader.onload = function() {
				let Data = new Uint8Array(this.result);

				let PAmount, FAmount, CPlayer;
				CPlayer = Data[SavStruct.Current_Player]; // Der Aktuelle Spieler.
				PAmount = Data[SavStruct.Player_Amount]; // Spieler Anzahl.
				FAmount = Data[SavStruct.Figur_Amount]; // Figuren Anzahl.

				if ((PAmount > 4) || (PAmount <= 1)) PAmount = 2; // Setze zu 2, weil 1- / 5+ verboten ist.
				if ((FAmount > 4) || (FAmount <= 0)) FAmount = 1; // Setze zu 1, weil 0 / 5+ verboten ist.
				if (CPlayer > PAmount) CPlayer = PAmount;

				Game = new LudoGame(PAmount, FAmount); // Erstelle ein Neues Spiel da wir die daten nun haben.

				/* Der Spieler Teil. */
				for (let player = 0; player < PAmount; player++) {
					for (let figur = 0; figur < FAmount; figur++) {
						/* Position. */
						Game.SetPosition(player, figur, Data[SavStruct.Player1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)]);

						/* Ziel. */
						Game.SetDone(player, figur, Data[SavStruct.Player1 + 1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)]);
					}
				}

				Game.SetCurrentPlayer(CPlayer);
				LoadGame();
				SwitchBTNColor();
			};

		} else {
			alert(document.getElementById("STRINGS").dataset.gamedata_invalid);
			return false;
		}
	};
};

/* Speichert das aktuelle Spiel zu einer Datei. Diese ist kompatibel mit Ludo3DS. */
document.getElementById("ExportGame").onclick = function() {
	let Data = new Uint8Array(SavStruct.DataSize);

	Data[SavStruct.Current_Player] = Game.GetCurrentPlayer();
	Data[SavStruct.Player_Amount] = Game.GetPlayerAmount();
	Data[SavStruct.Figur_Amount] = Game.GetFigurAmount();

	/* Der Spieler Teil. */
	for (let player = 0; player < 4; player++) {
		if (player < Game.GetPlayerAmount()) {

			for (let figur = 0; figur < 4; figur++) {
				if (figur < Game.GetFigurAmount()) {
					/* Position. */
					Data[SavStruct.Player1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)] = Game.GetPosition(player, figur);
					/* Ziel. */
					Data[SavStruct.Player1 + 1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)] = Game.GetDone(player, figur);

				} else {
					/* Position. */
					Data[SavStruct.Player1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)] = 0;
					/* Ziel. */
					Data[SavStruct.Player1 + 1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)] = 0;
				}
			}

		} else {
			for (let figur = 0; figur < 4; figur++) {
				/* Position. */
				Data[SavStruct.Player1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)] = 0;
				/* Ziel. */
				Data[SavStruct.Player1 + 1 + (figur * SavStruct.Figur_Size) + (player * SavStruct.Player_Size)] = 0;
			}
		}
	}

	let blob = new Blob([Data], { type: "application/octet-stream" });
	let a = document.createElement('a');
	let url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = "GameData.dat";
	a.click();
	alert(document.getElementById("STRINGS").dataset.export_game_msg);
};

/*
	Wiedergebe die Button Farbe.

	p: Der Spieler.
*/
function GetColor(p) {
	switch(p) {
		case 0:
			return "ButtonP1";

		case 1:
			return "ButtonP2";

		case 2:
			return "ButtonP3";

		case 3:
			return "ButtonP4";
	}

	return "ButtonP1";
};



/*
	Schaltflächen Farben Änderung.
*/
function SwitchBTNColor() {
	document.getElementById("RollDice").className = GetColor(Game.GetCurrentPlayer());
	document.getElementById("PreviousFigur").className = GetColor(Game.GetCurrentPlayer());
	document.getElementById("PlayFigur").className = GetColor(Game.GetCurrentPlayer());
	document.getElementById("NextFigur").className = GetColor(Game.GetCurrentPlayer());
	document.getElementById("AIClick").className = GetColor(Game.GetCurrentPlayer());
	document.getElementById("RollDice").className = GetColor(Game.GetCurrentPlayer());
};