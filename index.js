const characters = ['Lady Winslow', 'Doctor Marcolla', 'Countess Contee', 'Madam Natsiou', 'Baroness Finch'];
const cities = ['Baleton', 'Dunwall', 'Fraeport', 'Dabokva', 'Karnaca'];
const colors = ['green', 'white', 'blue', 'red', 'purple'];
const drinks = ['absinthe', 'beer', 'wine', 'rum', 'whiskey'];
const heirlooms = ['Snuff Tin', 'War Medal', 'Diamond', 'Bird Pendant', 'Ring'];

init();

function init() {
	const riddleText = document.getElementById('riddleText');

	const arrays = {
		'character': characters,
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
	<select id="${placeholder}Select${ids[placeholder]++}" class="form-control form-control-sm d-inline w-auto ${placeholder}-select">
		<option value="" disabled selected hidden>${placeholder}</option>
		${options[placeholder]}
	</select>
	`);
}
