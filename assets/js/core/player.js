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

export class LudoPlayer {
	/*
		Erstellt einen Spieler und die Figuren.

		amount: Die Figuren-Anzahl.
	*/
	constructor(amount) {
		this.fAmount = amount;

		/* Initialisiere Figuren. */
		this.done = new Array();
		this.position = new Array();

		for (let i = 0; i < this.fAmount; i++) {
			this.done.push(false);
			this.position.push(0);
		}
	};

	/* Die Figuren-Anzahl. */
	GetAmount() { return this.fAmount; };

	/* Ob schon am Ziel. */
	GetDone(figur) { return this.done[Math.min(this.GetAmount() - 1, figur)]; };
	SetDone(figur, isDone) { this.done[Math.min(this.GetAmount() - 1, figur)] = isDone; };

	/* Die Position. */
	GetPosition(figur) { return this.position[Math.min(this.GetAmount() - 1, figur)]; };
	SetPosition(figur, pos) { this.position[Math.min(this.GetAmount() - 1, figur)] = Math.min(44, pos); };
};