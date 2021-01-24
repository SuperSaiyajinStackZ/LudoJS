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


let gameShow = false, SelectingLang = false, CreditsHide = false;

/* Verstecke Informations box. */
document.getElementById("InfoBoxBtn").onclick = function() {
	document.getElementById("InfoBox").classList.add("showNone");
};

/* Verstecke Credits. */
document.getElementById("CreditsBtn").onclick = function() {
	document.getElementById("CreditsBox").classList.add("showNone");
	CreditsHide = true;
}

/* Sprachen Handler. */
document.getElementById("SwitchLang").onclick = function() {
	if (SelectingLang) {
		SelectingLang = false;
		document.getElementById("LangSelector").classList.add("showNone");

		if (gameShow) {
			document.getElementById("GamePlay").classList.remove("showNone");
			document.getElementById("ExportGame").classList.remove("showNone");

		} else {
			document.getElementById("GamePrepare").classList.remove("showNone");
		}

		if (!CreditsHide) document.getElementById("CreditsBox").classList.remove("showNone");

		document.getElementById("ImportGame").classList.remove("showNone");

	} else {
		SelectingLang = true;
		gameShow = !document.getElementById("GamePlay").classList.contains("showNone");

		document.getElementById("GamePlay").classList.add("showNone");
		document.getElementById("GamePrepare").classList.add("showNone");
		document.getElementById("ImportGame").classList.add("showNone");
		document.getElementById("ExportGame").classList.add("showNone");

		document.getElementById("CreditsBox").classList.add("showNone");
		document.getElementById("LangSelector").classList.remove("showNone");
	}
};

/* Sprachen Klick Handles. */
document.getElementById("Lang-DE").onclick = () => window.location.href = "de"; // Deutsch.
document.getElementById("Lang-EN").onclick = () => window.location.href = "en"; // Englisch.
document.getElementById("Lang-JA").onclick = () => window.location.href = "ja"; // Japanisch.