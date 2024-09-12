let allPokemon = [];

// Cargar todos los Pokémon al inicio
window.onload = async function () {
    await fetchAllPokemon();
};

// 1. Función para obtener todos los Pokémon (primer endpoint)
async function fetchAllPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const { results } = await response.json();

        const pokemonPromises = results.map(fetchPokemonData);

        allPokemon = await Promise.all(pokemonPromises);
        displayPokemonList(allPokemon);
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

// Función para obtener los datos de un solo Pokémon
async function fetchPokemonData(pokemon) {
    const response = await fetch(pokemon.url);
    return response.json();
}

// Función para mostrar la lista de Pokémon en la página
function displayPokemonList(pokemonArray) {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '';

    pokemonArray.forEach((pokemon) => {
        const pokemonCard = createPokemonCard(pokemon);
        pokemonCard.addEventListener('click', () => displayPokemonDetails(pokemon));
        pokemonList.appendChild(pokemonCard);
    });
}

// Función para crear una tarjeta de Pokémon
function createPokemonCard(pokemon) {
    const pokemonCard = document.createElement('article');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name.toUpperCase()}</h2>
        <p><strong>Weight:</strong> ${(pokemon.weight / 10)} kg</p>
        <p><strong>ID:</strong> ${pokemon.id}</p>
    `;
    return pokemonCard;
}

// 2. Función para mostrar detalles de un Pokémon
async function displayPokemonDetails(pokemon) {
    const pokemonDetails = document.getElementById('pokemon-details');
    pokemonDetails.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name.toUpperCase()}</h2>
        <p><strong>Weight:</strong> ${(pokemon.weight / 10)} kg</p>
        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.map((a) => a.ability.name).join(', ')}</p>
    `;

    pokemonDetails.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. Filtros con diferentes endpoints
document.getElementById('apply-filters-btn').addEventListener('click', async function () {
    const weightFilter = document.getElementById('filter-weight').value;
    const typeFilter = document.getElementById('filter-type').value;
    const nameFilter = document.getElementById('filter-name').value.toLowerCase();

    let filteredPokemon = allPokemon;

    if (weightFilter) {
        filteredPokemon = filteredPokemon.filter((pokemon) => pokemon.weight / 10 >= weightFilter);
    }

    if (typeFilter) {
        const typeData = await fetchTypeData(typeFilter);
        const pokemonOfType = typeData.pokemon.map((p) => p.pokemon.name);

        filteredPokemon = filteredPokemon.filter((pokemon) =>
            pokemonOfType.includes(pokemon.name)
        );
    }

    if (nameFilter) {
        filteredPokemon = filteredPokemon.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(nameFilter)
        );
    }

    displayPokemonList(filteredPokemon);
});

// Función para obtener los datos de un tipo de Pokémon (segundo endpoint)
async function fetchTypeData(typeFilter) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`);
    return response.json();
}

// 4. Función para refrescar los filtros y detalles
document.getElementById('refresh-btn').addEventListener('click', function () {
    document.getElementById('filter-weight').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-name').value = '';

    const pokemonDetails = document.getElementById('pokemon-details');
    pokemonDetails.innerHTML = '';
    pokemonDetails.classList.remove('active');

    displayPokemonList(allPokemon);
});
