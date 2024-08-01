async function initMap() {
    const mapOptions = {
        zoom: 5,
        disableDefaultUI: true,
        mapId: 'DEMO_MAP_ID'
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const bounds = new google.maps.LatLngBounds();
    
    destinations.forEach((destination, index) => {
        const pinBackground = new google.maps.marker.PinElement({
            background: "#4169E1",
            borderColor: "#4169E1",
            glyphColor: "white",
            scale: 1.5,
          });

        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: destination.lat, lng: destination.lng },
            map,
            content: pinBackground.element,
        });

        marker.addListener('click', () => {
            if (currentOpenDestination === destination) {
                closeInfoPanel();
            } else {
                updateInfoPanel(destination, index);
                currentOpenDestination = destination;
            }
        });

        bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));

        if (destination.attractions && destination.attractions.length > 0) {
            destination.attractions.forEach((attraction, attrIndex) => {
                const attractionMarker = new google.maps.marker.AdvancedMarkerElement({
                    position: { lat: attraction.lat, lng: attraction.lng },
                    map
                });

                attractionMarker.addListener('click', () => {
                    showAttractionDetails(attrIndex, index);
                });

                bounds.extend(new google.maps.LatLng(attraction.lat, attraction.lng));
            });
        }
    });

    map.fitBounds(bounds);

    const closeAttractionButton = document.getElementById('close-attraction-panel');
    if (closeAttractionButton) {
        closeAttractionButton.addEventListener('click', closeAttractionPanel);
    }
    
    const closeInfoButton = document.getElementById('close-info-panel');
    if (closeInfoButton) {
        closeInfoButton.addEventListener('click', closeInfoPanel);
    }
}


function removeAccents(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


function displayNames(value) {
    input.value = value;
    removeElements();
    
    const [destinationName, attractionName] = value.split(',').map(part => part.trim());

    const selectedDestination = destinations.find(d => removeAccents(d.locationName.toLowerCase()) === removeAccents(destinationName.toLowerCase()));

    if (selectedDestination) {
        if (attractionName) {
            const selectedAttraction = selectedDestination.attractions.find(a => removeAccents(a.locationName.toLowerCase()) === removeAccents(attractionName.toLowerCase()));
            if (selectedAttraction) {
                currentDestinationIndex = destinations.indexOf(selectedDestination);
                showAttractionDetails(selectedDestination.attractions.indexOf(selectedAttraction), currentDestinationIndex);
            } else {
                console.error('Atrativo não encontrada.');
            }
        } else {
            currentDestinationIndex = destinations.indexOf(selectedDestination);
            updateInfoPanel(selectedDestination, currentDestinationIndex);
        }
    } else {
        console.error('Destino não encontrado.');
    }
}


function removeElements() {
    let items = document.querySelectorAll('.list-items');
    items.forEach(item => {
        item.remove();
    });
}


function updateInfoPanel(destination, index) {
    currentDestinationIndex = index;

    document.getElementById('info-title').textContent = destination.locationName;
    document.getElementById('info-description').textContent = destination.description;

    const imageContainer = document.getElementById('info-images');
    imageContainer.innerHTML = '';

    if (destination.images && destination.images.length > 0) {
        destination.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = destination.locationName;
            img.style.width = '100%';
            imageContainer.appendChild(img);
        });
    } else {
        imageContainer.style.display = 'none';
    }

    const attractionsList = document.getElementById('info-attractions');
    attractionsList.innerHTML = '';
    
    const attractionsTitle = document.createElement('h3');
    attractionsTitle.textContent = 'Principais Atrativos:';
    attractionsList.appendChild(attractionsTitle);

    destination.attractions.forEach((attraction, attrIndex) => {
        const listItem = document.createElement('li');
        listItem.classList.add('attraction-item');

        const link = document.createElement('a');
        link.textContent = attraction.locationName;
        link.href = '#';
        link.classList.add('attraction-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showAttractionDetails(attrIndex, index);
        });

        listItem.appendChild(link);
        attractionsList.appendChild(listItem);
    });

    document.getElementById('info-panel').style.display = 'block';
    document.getElementById('attraction-panel').style.display = 'none';
}


function showAttractionDetails(attrIndex, destinationIndex) {
    if (destinationIndex === undefined) {
        console.error('currentDestinationIndex não está definido.');
        return;
    }

    const destination = destinations[destinationIndex];
    if (!destination || !destination.attractions || !destination.attractions[attrIndex]) {
        console.error('Atrativo não encontrada.');
        return;
    }

    const attraction = destination.attractions[attrIndex];

    document.getElementById('info-panel').style.display = 'none';

    document.getElementById('attraction-title').textContent = attraction.locationName;
    document.getElementById('attraction-description').textContent = attraction.description;

    const attractionImageContainer = document.getElementById('attraction-images');
    attractionImageContainer.innerHTML = '';

    if (attraction.images && attraction.images.length > 0) {
        attraction.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = attraction.locationName;
            img.style.width = '100%';
            attractionImageContainer.appendChild(img);
        });
    } else {
        attractionImageContainer.style.display = 'none';
    }

    document.getElementById('attraction-type').textContent = `Tipo: ${attraction.type}`;
    document.getElementById('attraction-tips').textContent = `Dicas de Visitação: ${attraction.visitationTips}`;

    document.getElementById('attraction-panel').style.display = 'block';
}


function closeAttractionPanel() {
    document.getElementById('attraction-panel').style.display = 'none';
    document.getElementById('info-panel').style.display = 'block';
}


function closeInfoPanel() {
    document.getElementById('info-panel').style.display = 'none';
    document.getElementById('attraction-panel').style.display = 'none';
    currentOpenDestination = null;
    currentDestinationIndex = null;
}



const destinations = [
    new Destino(
        'São Luís',
        -2.5306762,
        -44.2988843,
        `São Luís é uma cidade no nordeste do Brasil, na ilha de São Luís, no Oceano Atlântico. No centro histórico da cidade encontra-se o bairro de Praia Grande, na área circundante da rua de Portugal, marcado por edifícios coloniais com azulejos distintos e varandas em ferro fundido. O Palácio dos Leões, onde reside o governador do estado, exibe arte e mobiliário franceses. Nas proximidades, encontra-se o grande Palácio La Ravardière, do século XVII.`,
        ['images/sao-luis-1.jpg', 'images/sao-luis-2.jpg'],
        [
            new Atrativo(
                'Centro Histórico',
                -2.5293701,
                -44.3042411,
                'O Centro Histórico de São Luís é famoso por seus azulejos portugueses e arquitetura colonial.',
                ['images/centro-historico-1.jpg'],
                'Histórico',
                'Explore as ruas à pé para aproveitar a arquitetura.'
            ),
            new Atrativo(
                'Palácio dos Leões',
                -2.5274621,
                -44.3067553,
                'Residência do governador do estado, com arte e mobiliário franceses.',
                ['images/palacio-dos-leoes-1.jpg'],
                'Palácio',
                'Visite durante o horário de funcionamento para tours guiados.'
            ),
            new Atrativo(
                'Teatro Arthur Azevedo',
                -2.5290161,
                -44.3024733,
                'Um dos teatros mais antigos do Brasil, com apresentações culturais regulares.',
                ['images/teatro-arthur-azevedo-1.jpg'],
                'Cultural',
                'Assista a uma apresentação para uma experiência completa.'
            )
        ]
    ),
    new Destino(
        'Alcântara',
        -2.4039211,
        -44.4153504,
        `Alcântara é um município da Região Metropolitana de São Luís, no estado do Maranhão, no Brasil. Sua população estimada em 2021 era de 21.126 habitantes e possui uma área de 1457,96 km².`,
        ['images/alcantara-1.jpg', 'images/alcantara-2.jpg'],
        [
            new Atrativo(
                'Ruínas da Igreja de São Matias',
                -2.408808,
                -44.4172198,
                'Ruínas de uma igreja histórica que é um importante ponto turístico de Alcântara.',
                ['images/sao-matias-1.jpg'],
                'Histórico',
                'Visite ao entardecer para vistas deslumbrantes.'
            ),
            new Atrativo(
                'Museu Casa Histórica de Alcântara',
                -2.4081294,
                -44.417655,
                'Museu que preserva a história local com exposições sobre a vida e eventos da região em uma residência colonial antiga.',
                ['images/museu-casa-1.jpg'],
                'Histórico',
                'Faça a visita no início do dia para aproveitar a menor movimentação e explore as exposições com calma.'
            ),
            new Atrativo(
                'Pelourinho',
                -2.4085656,
                -44.4179597,
                'Monumento histórico.',
                ['images/pelourinho-1.jpg'],
                'Histórico',
                'Visite o Pelourinho ao amanhecer para evitar as multidões.'
            )
        ]
    ),
    new Destino(
        'Barreirinhas',
        -2.7590107,
        -42.8236298,
        `O município é conhecido como "Portal dos Lençóis maranhenses" pelo fato de abrigar o Parque Nacional dos Lençóis Maranhenses, uma vasta área de altas dunas de areia branca e de lagos e lagoas, também conhecido como "Deserto Brasileiro".`,
        ['images/barreirinhas-1.jpg', 'images/barreirinhas-2.jpg'],
        [
            new Atrativo(
                'Lagoa Bonita',
                -2.6765961,
                -42.9418169,
                'Uma das lagoas mais bonitas dos Lençóis Maranhenses, com águas cristalinas.',
                ['images/lagoa-bonita-1.jpg'],
                'Natureza',
                'Visite durante a estação das chuvas para ver as lagoas cheias.'
            ),
            new Atrativo(
                'Mandacaru',
                -2.5954951,
                -42.7066167,
                'Pequena vila com um farol que oferece uma vista panorâmica da região.',
                ['images/mandacaru-1.jpg'],
                'Vila',
                'Suba no farol para uma vista panorâmica incrível.'
            ),
            new Atrativo(
                'Porto de Atins',
                -2.572163,
                -42.7359567,
                'Porto tranquila próxima aos Lençóis Maranhenses, ideal para relaxar.',
                ['images/porto-atins-1.jpg'],
                'Porto',
                'Perfeito para relaxar após um dia de exploração.'
            )
        ]
    )
];

const options = [
    ...destinations.map(d => `${d.locationName}`),
    ...destinations.flatMap(d => d.attractions.map(a => `${d.locationName}, ${a.locationName}`))
];
const sortedNames = options.sort();

let currentOpenDestination = null;
let currentDestinationIndex = null;

const input = document.getElementById('search-input');

input.addEventListener('keyup', () => {
    removeElements();
    const inputValue = removeAccents(input.value.toLowerCase());
    sortedNames.forEach(name => {
        const optionValue = removeAccents(name.toLowerCase());
        if (optionValue.startsWith(inputValue) && inputValue !== '') {
            const listItem = document.createElement('li');
            listItem.classList.add('list-items');
            listItem.style.cursor = 'pointer';
            listItem.setAttribute('onclick', `displayNames('${name}')`);
            const highlightedPart = '<b>' + name.substring(0, input.value.length) + '</b>';
            const restOfWord = name.substring(input.value.length);
            listItem.innerHTML = highlightedPart + restOfWord;
            document.querySelector('#suggestions-list').appendChild(listItem);
        }
    });
});

window.onload = initMap;