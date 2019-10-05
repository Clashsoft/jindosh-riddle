const names = ['Lady Winslow', 'Doctor Marcolla', 'Countess Contee', 'Madam Natsiou', 'Baroness Finch'];
const cities = ['Baleton', 'Dunwall', 'Fraeport', 'Dabokva', 'Karnaca'];
const colors = ['green', 'white', 'blue', 'red', 'purple'];
const drinks = ['absinthe', 'beer', 'wine', 'rum', 'whiskey'];
const heirlooms = ['Snuff Tin', 'War Medal', 'Diamond', 'Bird Pendant', 'Ring'];

const characters = names.map(name => ({
	name: name,
	city: new Set(cities),
	color: new Set(colors),
	drink: new Set(drinks),
	heirloom: new Set(heirlooms),
}));

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

	renderTable();
}

function update() {

	renderTable();
}

function renderTable() {
	for (let i = 0; i < characters.length; i++) {
		const character = characters[i];
		const row = resultTable.rows[i + 1];
		row.cells[0].innerText = character.name;

		renderSet(character.city, row.cells[1]);
		renderSet(character.color, row.cells[2]);
		renderSet(character.drink, row.cells[3]);
		renderSet(character.heirloom, row.cells[4]);
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
