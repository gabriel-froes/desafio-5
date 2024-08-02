let destinations = [];
let currentOpenDestination = null;
let currentDestinationIndex = null;
const optionsSet = new Set();

async function initMap() {
    const mapOptions = {
        zoom: 5,
        disableDefaultUI: true,
        mapId: 'DEMO_MAP_ID'
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    const bounds = new google.maps.LatLngBounds();

    try {
        const response = await fetch('/destinations');
        destinations = await response.json();

        destinations.forEach(destination => {
            optionsSet.add(destination.locationName);

            if (destination.attractions && destination.attractions.length > 0) {
                destination.attractions.forEach(attraction => {
                    optionsSet.add(`${destination.locationName}, ${attraction.locationName}`);
                });
            }
        });

        const options = Array.from(optionsSet);

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
                updateInfoPanel(destination, index);
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

        document.getElementById('close-attraction-panel').addEventListener('click', closeAttractionPanel);
        document.getElementById('close-info-panel').addEventListener('click', closeInfoPanel);

    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
    }
}

function removeAccents(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function displayNames(value) {
    input.value = value;
    removeElements();

    const [destinationName, attractionName] = value.split(',').map(part => part.trim());

    if (attractionName) {
        const selectedDestination = destinations.find(d => removeAccents(d.locationName.toLowerCase()) === removeAccents(destinationName.toLowerCase()));
        if (selectedDestination) {
            const selectedAttraction = selectedDestination.attractions.find(a => removeAccents(a.locationName.toLowerCase()) === removeAccents(attractionName.toLowerCase()));
            if (selectedAttraction) {
                currentDestinationIndex = destinations.indexOf(selectedDestination);
                showAttractionDetails(selectedDestination.attractions.indexOf(selectedAttraction), currentDestinationIndex);
            } else {
                console.error('Atrativo não encontrado.');
            }
        } else {
            console.error('Destino não encontrado.');
        }
    } else {
        const selectedDestination = destinations.find(d => removeAccents(d.locationName.toLowerCase()) === removeAccents(destinationName.toLowerCase()));
        if (selectedDestination) {
            currentDestinationIndex = destinations.indexOf(selectedDestination);
            updateInfoPanel(selectedDestination, currentDestinationIndex);
        } else {
            console.error('Destino não encontrado.');
        }
    }
}

function removeElements() {
    document.querySelectorAll('.list-items').forEach(item => item.remove());
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
        console.error('Atrativo não encontrado.');
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

    if (currentOpenDestination) {
        document.getElementById('info-panel').style.display = 'block';
    } else {
        document.getElementById('info-panel').style.display = 'none';
    }
    
    currentOpenDestination = null;
    currentDestinationIndex = null;
}


function closeInfoPanel() {
    document.getElementById('info-panel').style.display = 'none';
    document.getElementById('attraction-panel').style.display = 'none';
    currentOpenDestination = null;
    currentDestinationIndex = null;
}

const input = document.getElementById('search-input');

input.addEventListener('keyup', () => {
    removeElements();
    const inputValue = removeAccents(input.value.toLowerCase());

    Array.from(optionsSet).forEach(name => {
        const optionValue = removeAccents(name.toLowerCase());

        if(inputValue !== '' && optionValue.includes(inputValue)) {
            const listItem = document.createElement('li');
            listItem.classList.add('list-items');
            listItem.style.cursor = 'pointer';
            listItem.setAttribute('onclick', `displayNames('${name}')`);

            const startIndex = optionValue.indexOf(inputValue);
            const highlightedPart = name.slice(startIndex, startIndex + input.value.length);
            const restOfWord = name.slice(startIndex + input.value.length);

            listItem.innerHTML = name.slice(0, startIndex) + '<b>' + highlightedPart + '</b>' + restOfWord;
            document.querySelector('#suggestions-list').appendChild(listItem);
        }
    });
});

window.onload = initMap;
