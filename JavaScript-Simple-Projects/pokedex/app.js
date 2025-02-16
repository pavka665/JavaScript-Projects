// Get all elements
const pokemonCards = document.getElementById('pokemon-cards');
const categoriesContainer = document.getElementById('categories');
const modal = document.getElementById('pokemon-modal');
const modalTitle = document.getElementById('modal-title');
const modalInfo = document.getElementById('modal-info');
const closeModal = document.getElementById('close-modal');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Base config
const API_BASE_URL = 'https://pokeapi.co/api/v2';

let currentPage = 1;
const limit = 6;

async function loadCategories() {
    try {
        const response = await fetch(`${ API_BASE_URL }/type`);
        const data = await response.json();
        
        data['results'].forEach((type) => {
            const button = document.createElement('button');
            button.textContent = type.name;
            button.className = 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500';
            button.addEventListener('click', () => {
                loadPokemonByType(type.name)
            });
            categoriesContainer.appendChild(button);
        });
    } catch (error) {
        console.log(error);
    }
}

async function loadPokemons(page=1) {
    try {
        const offset = (page - 1) * limit;
        const response = await fetch(`${ API_BASE_URL }/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        
        renderPokemonCards(data['results']);
    } catch (error) {
        console.log(error);
    }
}

async function renderPokemonCards(pokemons) {
    pokemonCards.innerHTML = '';

    for (const pokemon of pokemons) {
        const response = await fetch(pokemon['url']);
        const data = await response.json();
        
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-lg p-4 flex flex-col items-center';

        const img = document.createElement('img');
        img.src = data['sprites']['front_default'];
        img.alt = data['name'];
        img.className = 'w-32 h-32 mb-2 cursor-pointer';
        img.addEventListener('click', () => {
            playPokemonSound(data['cries']['latest']);
        });

        const name = document.createElement('h3');
        name.textContent = data.name;
        name.className = 'text-lg font-bold cursor-pointer';
        name.addEventListener('click', () => {
            showPokemonModal(data);
        });

        const info = document.createElement('p');
        info.textContent = `Height: ${ data.height }, Weight ${ data.weight }`;
        info.className = 'text-gray-700';

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(info);
        pokemonCards.appendChild(card);
    }
}

async function loadPokemonByType(type) {
    try {
        const response = await fetch(`${ API_BASE_URL }/type/${ type }`);
        const data = await response.json();
        const pokemons = data.pokemon.map((p) => p.pokemon);
        renderPokemonCards(pokemons);
    } catch (error) {
        console.log(error);
    }
}

function playPokemonSound(sound) {
    const audio = new Audio(sound);
    audio.play();
}

function showPokemonModal(data) {
    modalTitle.textContent = data.name;
    modalInfo.textContent = `Height: ${ data.height }, Weight ${ data.weight }`;
    modal.classList.remove('hidden')
}

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage --;
        loadPokemons(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    loadPokemons(currentPage);
});

loadCategories();
loadPokemons()
