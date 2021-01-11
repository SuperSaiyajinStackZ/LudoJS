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
	Wiedergebe, ob die position berührt wurde.

	x: X Position.
	y: Y Position.
	width: Breite.
	height: Höhe.
	event: Das Event zum Klick-Call.
*/
export function touching(x, y, width, height, event) {
	const P = [ event.offsetX, event.offsetY ];

	if (P[0] >= x && P[0] <= x + width && P[1] >= y && P[1] <= y + height) return true;
	return false;
};