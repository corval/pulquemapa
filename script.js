// =================================================================================
// 🎨 PASO 1: CONFIGURACIÓN DE GRÁFICOS
// =================================================================================
// Añade aquí las rutas a tus imágenes de máscaras. Puedes añadir cuantas quieras.
const MASK_ICONS = [
  'assets/images/avena.png',
  'assets/images/guava.png',
  'assets/images/uva.png',
  'assets/images/natural.png',
];
// Ruta al cinturón de campeón para la ubicación del usuario.
const CHAMPION_BELT_ICON = 'assets/images/champion_belt.png';


// =================================================================================
// 🔊 PASO 2: CONFIGURACIÓN DE SONIDOS
// =================================================================================
const SOUNDS = {
    bell: 'assets/sounds/bell_ring.mp3', // Sonido al hacer clic en un luchador
    crowd: 'assets/sounds/crowd_roar.mp3', // Sonido para buscar rings cercanos
    // Puedes añadir más aquí, por ejemplo: pow: 'assets/sounds/pow_sound.mp3'
};


// =================================================================================
// 🎬 COMIENZA LA LÓGICA DEL MAPA (No necesitas tocar mucho más abajo)
// =================================================================================

// Variables globales
let map;
let markers = [];
let locations = [];
let infoWindow;
let userMarker;
let isMuted = false;

// Inicialización del mapa
function initMap() {
    const mapStyles = [ { "featureType": "all", "elementType": "labels.text.fill", "stylers": [ { "color": "#ffffff" } ] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" }, { "color": "#3e3e3e" }, { "weight": 2 } ] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [ { "weight": 0.6 }, { "color": "#1a3541" } ] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#2c5a71" } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#406d80" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#2c5a71" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#29768a" }, { "lightness": -37 } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#406d80" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#193341" } ] } ];
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 36.7783, lng: -110.4179 },
        zoom: 5.5,
        styles: mapStyles,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    
    infoWindow = new google.maps.InfoWindow();
    generateLocations();
    displayStoreList(locations);

    document.getElementById('find-nearby-btn').addEventListener('click', getUserLocation);
    document.getElementById('sound-toggle-btn').addEventListener('click', toggleSound);
}

// Genera nombres de luchador y ubicaciones aleatorias
function generateLocations() {
    const LUCHADOR_NAMES = ["El Magnífico", "Rayo de Jalisco", "Psicodélico Jr.", "Furia Nocturna", "Ciclón Azteca", "Cometa de Oro", "El Inmortal", "Sombra Digital"];
    const cityBounds = { losAngeles: { lat: [33.7, 34.3], lng: [-118.6, -118.1] }, sanDiego: { lat: [32.5, 33.1], lng: [-117.3, -116.9] }, sanFrancisco: { lat: [37.7, 37.8], lng: [-122.5, -122.3] }, phoenix: { lat: [33.2, 33.8], lng: [-112.3, -111.9] } };
    function getRandomCoords(bounds) { const lat = Math.random() * (bounds.lat[1] - bounds.lat[0]) + bounds.lat[0]; const lng = Math.random() * (bounds.lng[1] - bounds.lng[0]) + bounds.lng[0]; return { lat, lng }; }
    const cities = Object.values(cityBounds);
    for (let i = 1; i <= 50; i++) {
        const randomCityBounds = cities[Math.floor(Math.random() * cities.length)];
        const randomName = LUCHADOR_NAMES[Math.floor(Math.random() * LUCHADOR_NAMES.length)];
        locations.push({ id: i, position: getRandomCoords(randomCityBounds), title: `${randomName} #${i}`, address: `Arena en Ciudad Principal` });
    }
}

// Muestra la lista de tiendas (La Cartelera)
function displayStoreList(stores) {
    const storeListElement = document.getElementById('store-list');
    storeListElement.innerHTML = '';
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    stores.forEach(loc => {
        const randomMask = MASK_ICONS[loc.id % MASK_ICONS.length];
        const marker = new google.maps.Marker({
            position: loc.position, map: map, title: loc.title,
            icon: { url: randomMask, scaledSize: new google.maps.Size(60, 60), anchor: new google.maps.Point(30, 30) },
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);

        const listItem = document.createElement('li');
        let distanceHTML = loc.distance ? `<div class="distance">A ${loc.distance.toFixed(1)} km del campeón</div>` : '';
        listItem.innerHTML = `<h3>${loc.title}</h3><p>${loc.address}</p>${distanceHTML}`;
        
        const handleClick = () => {
            playSound(SOUNDS.bell);
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            map.panTo(loc.position);
            setMarkerInfoWindow(marker, loc);
        };
        marker.addListener("click", handleClick);
        listItem.addEventListener('click', handleClick);
        storeListElement.appendChild(listItem);
    });
}

// Lógica de Geolocalización
function getUserLocation() {
    playSound(SOUNDS.crowd);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
            if (userMarker) userMarker.setMap(null);
            userMarker = new google.maps.Marker({
                position: userPos, map: map, title: "¡El Campeón está aquí!",
                icon: { url: CHAMPION_BELT_ICON, scaledSize: new google.maps.Size(70, 70) },
                zIndex: 999
            });
            calculateDistances(userPos);
            locations.sort((a, b) => a.distance - b.distance);
            displayStoreList(locations);
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(userPos);
            for (let i = 0; i < 4 && i < locations.length; i++) bounds.extend(locations[i].position);
            map.fitBounds(bounds);
        }, () => alert("¡El retador no aparece! Habilita los permisos de localización."));
    } else { alert("Esta arena no tiene tecnología de geolocalización."); }
}

// --- FUNCIONES AUXILIARES ---
function calculateDistances(userPos) { locations.forEach(loc => loc.distance = getDistanceInKm(userPos, loc.position)); }
function getDistanceInKm(pos1, pos2) { const R = 6371; const dLat = (pos2.lat - pos1.lat) * Math.PI / 180; const dLon = (pos2.lng - pos1.lng) * Math.PI / 180; const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2); const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; }
function setMarkerInfoWindow(marker, loc) { const content = `<div class="info-window-poster"><h3>${loc.title}</h3><p>${loc.address}</p></div>`; infoWindow.setContent(content); infoWindow.open(marker.getMap(), marker); }

// Lógica de Sonido
function toggleSound() {
    isMuted = !isMuted;
    document.getElementById('sound-toggle-btn').textContent = isMuted ? '🔇' : '🔊';
}
function playSound(soundFile) {
    if (isMuted) return;
    const audio = new Audio(soundFile);
    audio.play();
}