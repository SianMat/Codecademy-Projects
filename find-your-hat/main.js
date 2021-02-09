const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
	constructor(field) {
		this._field = field;
	}
	getLocationContents(pos) {
		return this._field[pos[0]][pos[1]];
	}
	setLocationVisited(pos) {
		this._field[pos[0]][pos[1]] = "*";
	}
	print() {
		for (let i = 0; i < this._field.length; i++) {
			console.log(this._field[i].join(" "));
		}
	}
	getFieldDimensions() {
		return [this._field.length, this._field[0].length];
	}
	checkMove(pos) {
		let nextSquare = this.getLocationContents(pos);
		if (nextSquare === "^") {
			console.log("You Win");
			return true;
		}
		if (nextSquare === "O") {
			console.log("You Lose");
			return true;
		} else {
			return false;
		}
	}
	static generateField(h, w) {
		let field = [];

		for (let i = 0; i < h; i++) {
			let row = [];
			for (let j = 0; j < w; j++) {
				row.push("░");
			}
			field.push(row);
		}
		const squares = w * h;
		const holes = Math.floor(0.4 * squares);

		for (let i = 0; i < holes; i++) {
			let r = Math.floor(Math.random() * h);
			let c = Math.floor(Math.random() * w);
			field[r][c] = "O";
		}
		field[0][0] = "*";
		field[2][2] = "^";
		return field;
	}
}
let field = Field.generateField(5, 4);
const myField = new Field(field);

myField.print();

let pos = [0, 0];
let ended = false;

do {
	let move = prompt("Move (u/d/l/r): ");
	if (move === "u" && pos[0] > 0) {
		pos[0] -= 1;
		ended = myField.checkMove(pos);
	} else if (move === "d" && pos[0] < myField.getFieldDimensions()[0]) {
		console.log("moving down");
		pos[0] += 1;
		ended = myField.checkMove(pos);
	} else if (move === "l" && pos[1] > 0) {
		pos[1] -= 1;
		ended = myField.checkMove(pos);
	} else if (move === "r" && pos[1] < myField.getFieldDimensions()[1]) {
		pos[1] += 1;
		ended = myField.checkMove(pos);
	} else {
		console.log("Not a valid move");
	}
	myField.setLocationVisited(pos);
	myField.print();
} while (!ended);
