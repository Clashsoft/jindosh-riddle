const names = ['Lady Winslow', 'Doctor Marcolla', 'Countess Contee', 'Madam Natsiou', 'Baroness Finch'];
const cities = ['Baleton', 'Dunwall', 'Fraeport', 'Dabokva', 'Karnaca'];
const colors = ['green', 'white', 'blue', 'red', 'purple'];
const drinks = ['absinthe', 'beer', 'wine', 'rum', 'whiskey'];
const heirlooms = ['Snuff Tin', 'War Medal', 'Diamond', 'Bird Pendant', 'Ring'];

const resultTable = document.getElementById('resultTable');

init();

function init() {
	const riddleText = document.getElementById('riddleText');

	const arrays = {
		'character': names,
		'city': cities,
		'color': colors,
		'drink': drinks,
		'heirloom': heirlooms,
	};

	const options = Object.keys(arrays).reduce((result, key) => {
		result[key] = arrays[key].map(c => `
		<option value="${c}">${c}</option>
		`).join('\n');
		return result;
	}, {});

	const ids = Object.keys(arrays).reduce((result, key) => {
		result[key] = 0;
		return result;
	}, {});

	riddleText.innerHTML = riddleText.innerHTML.replace(/\[(\w+)]/g, (_, placeholder) => `
	<select id="${placeholder}Select${ids[placeholder]++}" class="form-control form-control-sm d-inline w-auto ${placeholder}-select" onchange="update(this)">
		<option value="" disabled selected hidden>${placeholder}</option>
		${options[placeholder]}
	</select>
	`);

	update();
}

Set.prototype.set = function set(value) {
	this.clear();
	this.add(value);
};

function update() {
	const values = [...riddleText.getElementsByTagName('select')].map(e => e.value);

	const characters = names.map(name => ({
		name: name,
		city: new Set(cities),
		color: new Set(colors),
		drink: new Set(drinks),
		heirloom: new Set(heirlooms),
		seat: new Set([1, 2, 3, 4, 5]),
	}));

	if (values[0] && values[1]) {
		setStatic(characters, values[0], c => c.color, values[1]);
	}
	if (values[12] && values[13]) {
		setStatic(characters, values[12], c => c.heirloom, values[13]);
	}
	if (values[19] && values[20]) {
		setStatic(characters, values[19], c => c.drink, values[20]);
	}
	if (values[24] && values[25]) {
		setStatic(characters, values[24], c => c.city, values[25]);
	}

	renderTable(characters);
}

function setStatic(characters, name, property, value) {
	for (let c of characters) {
		if (c.name === name) {
			property(c).set(value);
		} else {
			property(c).delete(value);
		}
	}
}

function renderTable(characters) {
	for (let i = 0; i < characters.length; i++) {
		const character = characters[i];
		const row = resultTable.rows[i + 1];
		row.cells[0].innerText = character.name;

		renderSet(character.city, row.cells[1]);
		renderSet(character.color, row.cells[2]);
		renderSet(character.drink, row.cells[3]);
		renderSet(character.heirloom, row.cells[4]);
		renderSet(character.seat, row.cells[5]);
	}
}

function renderSet(set, parent) {
	if (set.size === 1) {
		parent.innerText = [...set][0];
	} else {
		parent.innerHTML = `<span class="badge badge-secondary" data-toggle="tooltip" title="${[...set].join(
			', ')}">${set.size} possibilities</span>`;
		$(parent.children[0]).tooltip();
	}
}
