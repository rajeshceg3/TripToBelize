// The narrative begins here. Data is not just data; it is a collection of stories.
// Images are summoned from the ether, ensuring the experience is light and immediate.
// ENHANCEMENT: Operational metrics added for Tactical Logistics System.
const locations = [
    {
        name: "Great Blue Hole",
        type: "Marine Sinkhole",
        type_category: "marine",
        coords: [17.316, -87.535],
        description: "A colossal marine sinkhole, a portal to the ocean's underworld. Its perfect circular shape is a profound statement of geological time, inviting divers to explore its silent, ancient depths.",
        atmosphere: "Deep azure silence, the weight of water, a sense of falling into the earth's core.",
        image: "https://images.unsplash.com/photo-1587870529598-a893e4a2c161?q=80&w=1964",
        risk_level: 5,
        access_complexity: 5,
        required_gear: ["scuba_kit", "boat_transport", "first_aid"]
    },
    {
        name: "Hol Chan Marine Reserve",
        type: "Barrier Reef",
        type_category: "marine",
        coords: [17.861, -87.962],
        description: "A vibrant underwater thoroughfare, teeming with life. Here, the barrier reef parts, creating a channel where rays, sharks, and countless species congregate in a dazzling display of biodiversity.",
        atmosphere: "Sun-dappled water, a kaleidoscope of life, the gentle current a silent conductor.",
        image: "https://images.unsplash.com/photo-1552569434-53634a873894?q=80&w=1935",
        risk_level: 3,
        access_complexity: 3,
        required_gear: ["snorkel_gear", "boat_transport"]
    },
    {
        name: "Cockscomb Basin",
        type: "Wildlife Sanctuary",
        type_category: "nature",
        coords: [16.76, -88.58],
        description: "The world's first jaguar preserve. A sanctuary of dense jungle, cascading waterfalls, and the elusive spirits of the wild. The air is thick with the scent of earth and the sound of life.",
        atmosphere: "Humid air, the scent of damp earth and unseen blossoms, the distant call of a bird.",
        image: "https://images.unsplash.com/photo-1547847055-a01b4991206c?q=80&w=1974",
        risk_level: 4,
        access_complexity: 4,
        required_gear: ["hiking_boots", "navigation_kit", "hydration_pack"]
    },
    {
        name: "Xunantunich",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [17.089, -89.141],
        description: "The 'Stone Woman' stands sentinel over the jungle. Ascend El Castillo to touch the sky and gaze upon a kingdom reclaimed by nature, a silent testament to a civilization's profound connection to the cosmos.",
        atmosphere: "Sun-baked stone, a breeze whispering through ancient plazas, the vast green ocean of jungle below.",
        image: "https://images.unsplash.com/photo-1628160049448-b39178199344?q=80&w=1974",
        risk_level: 2,
        access_complexity: 2,
        required_gear: ["hiking_boots", "sun_protection"]
    },
    {
        name: "ATM Cave",
        type: "Archaeological Site",
        type_category: "ruins",
        coords: [17.186, -88.948],
        description: "Actun Tunichil Muknal. A journey into the Mayan underworld, a living museum of sacred ceremony. Traverse through water and darkness to find crystalized skeletons and echoes of ancient rituals.",
        atmosphere: "Cool, damp air, the echo of dripping water, the profound silence of a sacred, hidden world.",
        image: "https://images.unsplash.com/photo-1565017240312-326b58e72764?q=80&w=2070",
        risk_level: 5,
        access_complexity: 5,
        required_gear: ["helmet", "tactical_light", "water_shoes"]
    },
    {
        name: "Caracol",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [16.76389, -89.11750],
        description: "A large ancient Maya archaeological site, located in the Cayo District. It was one of the most important regional political centers of the Maya Lowlands during the Classic Period.",
        atmosphere: "The grandeur of a lost city, the oppressive heat of the day giving way to the cool of stone.",
        image: "https://images.unsplash.com/photo-1517581179733-39a2b3cba3c2?q=80&w=1974",
        risk_level: 3,
        access_complexity: 4,
        required_gear: ["hiking_boots", "hydration_pack", "all_terrain_vehicle"]
    },
    {
        name: "Lubaantun",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [16.28165, -88.95945],
        description: "A Late Classic Maya site known for its unusual construction of rounded stone blocks laid without mortar. The name means 'place of fallen stones' in the local Maya language.",
        atmosphere: "Rounded stones beneath your fingers, the mystery of a people who needed no mortar to build their world.",
        image: "https://images.unsplash.com/photo-1581219803359-24285b7336dc?q=80&w=1974",
        risk_level: 2,
        access_complexity: 3,
        required_gear: ["hiking_boots", "sun_protection"]
    },
    {
        name: "Nim Li Punit",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [16.317, -88.800],
        description: "A Maya Classic Period site known for its numerous stelae, including one with a large headdress that gives the site its name, which means 'Big Hat' in the Kekchi Maya language.",
        atmosphere: "Intricate carvings telling forgotten stories, the shade of a giant stone hat in the tropical sun.",
        image: "https://images.unsplash.com/photo-1601643157324-159b2d043e4f?q=80&w=1974",
        risk_level: 2,
        access_complexity: 3,
        required_gear: ["hiking_boots", "sun_protection"]
    },
    {
        name: "Barton Creek Cave",
        type: "Cave / Archaeological Site",
        type_category: "nature",
        coords: [17.11278, -88.92806],
        description: "A large river cave that can be explored by canoe, featuring Maya artifacts and human remains, offering a glimpse into ancient rituals.",
        atmosphere: "The gentle splash of a paddle in a subterranean river, beams of light revealing ancient secrets.",
        image: "https://images.unsplash.com/photo-1589417937332-992ab4f28b34?q=80&w=2070",
        risk_level: 3,
        access_complexity: 3,
        required_gear: ["tactical_light", "canoe_access"]
    },
    {
        name: "Nohoch Che'en Caves Branch",
        type: "Cave System",
        type_category: "nature",
        coords: [17.195, -88.688],
        description: "An extensive cave system perfect for cave tubing adventures, floating through underground rivers and past stunning rock formations.",
        atmosphere: "The thrill of floating into darkness, the cool water a contrast to the jungle's heat.",
        image: "https://images.unsplash.com/photo-1614865993946-7a659042b4d4?q=80&w=1974",
        risk_level: 2,
        access_complexity: 2,
        required_gear: ["water_shoes", "tactical_light", "flotation_device"]
    },
    {
        name: "Community Baboon Sanctuary",
        type: "Wildlife Sanctuary",
        type_category: "nature",
        coords: [17.5560361, -88.5349778],
        description: "A community-managed sanctuary for the Yucatán black howler monkey, known locally as the 'baboon', where you can see these fascinating creatures in their natural habitat.",
        atmosphere: "A guttural roar from the canopy, the rustle of leaves, the feeling of being watched by curious eyes.",
        image: "https://images.unsplash.com/photo-1579273166180-0a25b3a2b464?q=80&w=1974",
        risk_level: 1,
        access_complexity: 2,
        required_gear: ["optics", "sun_protection"]
    },
    {
        name: "Glover's Reef",
        type: "Atoll / Marine Reserve",
        type_category: "marine",
        coords: [16.823, -87.791],
        description: "A pristine atoll and marine reserve, part of the Belize Barrier Reef, offering world-class diving and snorkeling in a remote and beautiful setting.",
        atmosphere: "The feeling of being at the edge of the world, surrounded by a universe of coral and turquoise water.",
        image: "https://images.unsplash.com/photo-1596424594398-639d336044a2?q=80&w=1932",
        risk_level: 4,
        access_complexity: 5,
        required_gear: ["scuba_kit", "boat_transport", "first_aid"]
    },
    {
        name: "Laughing Bird Caye",
        type: "National Park / Island",
        type_category: "marine",
        coords: [16.443443, -88.197250],
        description: "A beautiful island national park, named for the laughing gulls that once bred there, offering great snorkeling and diving on a faro, a type of shelf atoll.",
        atmosphere: "White sand, the cry of gulls, the gentle lapping of waves on a jewel-like island.",
        image: "https://images.unsplash.com/photo-1574512241380-5a3317734a75?q=80&w=1974",
        risk_level: 2,
        access_complexity: 4,
        required_gear: ["snorkel_gear", "boat_transport", "sun_protection"]
    },
    {
        name: "St. Herman's Blue Hole National Park",
        type: "National Park",
        type_category: "nature",
        coords: [17.156, -88.685],
        description: "An inland blue hole and cave system, perfect for a cool dip in the jungle, with hiking trails and the impressive St. Herman's Cave to explore.",
        atmosphere: "The sudden, shocking blue of the water in a jungle clearing, a cool respite from the tropical heat.",
        image: "https://images.unsplash.com/photo-1507525428034-b723a996f3d4?q=80&w=2070",
        risk_level: 3,
        access_complexity: 3,
        required_gear: ["hiking_boots", "swimwear", "tactical_light"]
    },
    {
        name: "Caye Caulker",
        type: "Island Village",
        type_category: "marine",
        coords: [17.7425, -88.025],
        description: "A laid-back island with a 'go slow' vibe, perfect for snorkeling, diving, and relaxing. The island is split by 'The Split', a narrow waterway.",
        atmosphere: "The rhythm of reggae music, the smell of barbecue, the warm embrace of a Caribbean breeze.",
        image: "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=2070",
        risk_level: 1,
        access_complexity: 2,
        required_gear: ["swimwear", "boat_transport", "casual_attire"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const introduction = document.getElementById('introduction');
    const mapContainer = document.getElementById('map');
    const infoPanel = document.getElementById('info-panel');
    const closePanelButton = document.getElementById('close-panel');
    const panelImage = document.getElementById('panel-image');
    const panelTitle = document.getElementById('panel-title');
    const panelType = document.getElementById('panel-type');
    const panelDescription = document.getElementById('panel-description');
    const panelAtmosphere = document.getElementById('panel-atmosphere');
    const btnAddExpedition = document.getElementById('btn-add-expedition');

    // Expedition HUD elements
    const expeditionHud = document.getElementById('expedition-hud');
    const expeditionCount = document.getElementById('expedition-count');
    const expeditionList = document.getElementById('expedition-list');
    const btnGenerateBrief = document.getElementById('btn-generate-brief');
    const btnClearExpedition = document.getElementById('btn-clear-expedition');

    // Briefing Modal elements
    const briefingModal = document.getElementById('briefing-modal');
    const closeBriefing = document.getElementById('close-briefing');
    const briefCodename = document.getElementById('brief-codename');
    const briefDistance = document.getElementById('brief-distance');
    const briefTerrain = document.getElementById('brief-terrain');
    const briefCount = document.getElementById('brief-count');
    const briefEta = document.getElementById('brief-eta');
    const briefRisk = document.getElementById('brief-risk');
    const briefText = document.getElementById('brief-text');
    const briefWarnings = document.getElementById('brief-warnings');

    // New UI Elements
    const tacticalToggle = document.getElementById('tactical-toggle');
    const gearContainer = document.getElementById('gear-container');
    const riskDisplay = document.getElementById('risk-display');

    let map;
    let activeMarker = null;
    const markers = [];
    let currentFilter = 'all';
    let constellation;

    // Modules
    const logisticsCore = new LogisticsCore();
    let tacticalOverlay;

    // Initialize Expedition Manager
    const expeditionManager = new ExpeditionManager();
    let routeLayer = null;
    let selectedGear = []; // Track selected gear

    const filterContainer = document.getElementById('filter-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterContainer.querySelector('.active').classList.remove('active');
            button.classList.add('active');
            currentFilter = filter;
            filterLocations(filter);
        });
    });

    function filterLocations(filter) {
        markers.forEach(m => {
            const markerEl = m.marker.getElement();
            if (filter === 'all' || m.location.type_category === filter) {
                markerEl.classList.remove('dimmed');
            } else {
                markerEl.classList.add('dimmed');
            }
        });
    }

    const panelContent = document.getElementById('panel-content');
    panelContent.addEventListener('scroll', () => {
        const scrollTop = panelContent.scrollTop;
        const scrollFraction = scrollTop / (panelContent.scrollHeight - panelContent.clientHeight);
        const scale = 1.1 - (scrollFraction * 0.1);
        const translateY = scrollFraction * -20;
        panelImage.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    });

    document.addEventListener('keydown', (e) => {
        if (!activeMarker || infoPanel.classList.contains('visible') === false) return;

        const visibleMarkers = markers.filter(m => !m.marker.getElement().classList.contains('dimmed'));
        if (visibleMarkers.length <= 1) return;

        const currentIndex = visibleMarkers.findIndex(m => m.marker === activeMarker);

        let nextIndex;
        if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % visibleMarkers.length;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + visibleMarkers.length) % visibleMarkers.length;
        } else {
            return;
        }

        const nextMarker = visibleMarkers[nextIndex];
        handleMarkerClick(nextMarker.marker, nextMarker.location);
    });

    function initializeMap() {
        // The map is centered to reveal the whole of Belize, a gesture of presentation.
        map = L.map(mapContainer, {
            zoomControl: false,
            attributionControl: false,
        }).setView([17.1899, -88.4976], 8);

        // The tile layer is the very fabric of our canvas. We chose one that is clean and unobtrusive.
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

        // We now place our beacons onto the canvas.
        locations.forEach(location => {
            const icon = L.divIcon({
                className: 'leaflet-marker-icon',
                iconSize: [200, 200]
            });
            const marker = L.marker(location.coords, { icon: icon }).addTo(map);

            marker.on('click', () => {
                handleMarkerClick(marker, location);
            });

            markers.push({marker, location});
        });

        constellation = new Constellation('constellation-canvas', map, locations);
        constellation.start();

        initTacticalOverlay();

        // Initialize Expedition Route Visualization
        updateExpeditionUI();
    }

    // --- EXPEDITION LOGIC START ---

    // Initialize Tactical Overlay
    function initTacticalOverlay() {
        if (map && !tacticalOverlay) {
            tacticalOverlay = new TacticalOverlay(map);

            tacticalToggle.addEventListener('click', () => {
                const isVisible = tacticalOverlay.toggle();
                if (isVisible) {
                    tacticalToggle.classList.add('active');
                } else {
                    tacticalToggle.classList.remove('active');
                }
            });
        }
    }

    function updateExpeditionUI() {
        const list = expeditionManager.getExpedition();
        expeditionList.innerHTML = '';

        if (list.length > 0) {
            expeditionHud.classList.add('visible');
            expeditionCount.textContent = `${list.length} Target${list.length > 1 ? 's' : ''}`;
        } else {
            expeditionHud.classList.remove('visible');
            expeditionCount.textContent = '0 Targets';
        }

        list.forEach(loc => {
            const div = document.createElement('div');
            div.className = 'expedition-item';
            div.innerHTML = `
                <span>${loc.name}</span>
                <span class="remove-btn" title="Remove Target">×</span>
            `;
            div.querySelector('.remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                expeditionManager.removeLocation(loc.name);
            });
            expeditionList.appendChild(div);
        });

        drawExpeditionRoute();
        updateAddButtonState();
        updateMissionAnalysis();
        updateGearCheckboxes();
    }

    function updateMissionAnalysis() {
        const list = expeditionManager.getExpedition();
        const riskAnalysis = logisticsCore.assessRisk(list);

        riskDisplay.textContent = riskAnalysis.label;
        riskDisplay.style.color = riskAnalysis.color;
    }

    function updateGearCheckboxes() {
        // Get all required gear for current mission
        const list = expeditionManager.getExpedition();
        const required = logisticsCore.getRequiredGearList(list);

        // Preserve selections that are still relevant
        // If a new item appears, it starts unchecked

        gearContainer.innerHTML = '';

        if (required.length === 0) {
            gearContainer.innerHTML = '<span style="font-size:0.7rem; color:#aaa; font-style:italic;">No special gear required.</span>';
            return;
        }

        required.forEach(item => {
            const label = item.replace('_', ' ').toUpperCase();
            const div = document.createElement('div');
            div.className = 'gear-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item;
            checkbox.id = `gear-${item}`;

            if (selectedGear.includes(item)) {
                checkbox.checked = true;
            }

            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!selectedGear.includes(item)) selectedGear.push(item);
                } else {
                    selectedGear = selectedGear.filter(g => g !== item);
                }
            });

            const lbl = document.createElement('label');
            lbl.htmlFor = `gear-${item}`;
            lbl.textContent = label;
            lbl.style.cursor = "pointer";

            div.appendChild(checkbox);
            div.appendChild(lbl);
            gearContainer.appendChild(div);
        });
    }

    function drawExpeditionRoute() {
        if (!map) return;

        if (routeLayer) {
            map.removeLayer(routeLayer);
            routeLayer = null;
        }

        const list = expeditionManager.getExpedition();
        if (list.length < 2) return;

        const latlngs = list.map(l => l.coords);

        // We use a distinct style: Aqua dashed line.
        routeLayer = L.polyline(latlngs, {
            color: '#7fffd4', // glow-cyan
            weight: 3,
            opacity: 0.8,
            dashArray: '10, 10',
            lineCap: 'round'
        }).addTo(map);
    }

    function updateAddButtonState() {
        if (!activeMarker) return;

        // Find the location object associated with the active marker
        // The handleMarkerClick function sets activeMarker but we also need the location object
        // We can find it by comparing coordinates or we can store currentActiveLocation globally
        // For now, let's look it up from markers array
        const activeLocObj = markers.find(m => m.marker === activeMarker)?.location;

        if (!activeLocObj) return;

        if (expeditionManager.isSelected(activeLocObj.name)) {
            btnAddExpedition.textContent = "Remove Target";
            btnAddExpedition.classList.add('secondary');
        } else {
            btnAddExpedition.textContent = "Initialize Target";
            btnAddExpedition.classList.remove('secondary');
        }
    }

    // Listen for storage updates (in case of multiple tabs) or local updates
    window.addEventListener('expeditionUpdated', () => {
        updateExpeditionUI();
    });

    // Handle "Add/Remove" button click
    btnAddExpedition.addEventListener('click', () => {
        const activeLocObj = markers.find(m => m.marker === activeMarker)?.location;
        if (!activeLocObj) return;

        if (expeditionManager.isSelected(activeLocObj.name)) {
            expeditionManager.removeLocation(activeLocObj.name);
        } else {
            expeditionManager.addLocation(activeLocObj);
        }
    });

    // Handle "Clear"
    btnClearExpedition.addEventListener('click', () => {
        if(confirm('Abort current mission planning?')) {
            expeditionManager.clear();
        }
    });

    // Handle "Generate Brief"
    btnGenerateBrief.addEventListener('click', () => {
        const list = expeditionManager.getExpedition();
        const analysis = expeditionManager.analyzeComposition();
        if (!analysis) return;

        // Perform Advanced Logistics Analysis
        const eta = logisticsCore.calculateETA(list, analysis.totalDistance);
        const risk = logisticsCore.assessRisk(list);
        const loadout = logisticsCore.validateLoadout(list, selectedGear);

        // Generate a cool codename
        const themes = {
            'marine': ['NEPTUNE', 'TRIDENT', 'ABYSS', 'TIDE'],
            'nature': ['JAGUAR', 'CANOPY', 'WILD', 'ROOT'],
            'ruins':  ['OBSIDIAN', 'TEMPLE', 'TIME', 'STONE'],
            'other':  ['VECTOR', 'PATH', 'HORIZON']
        };
        const dominant = analysis.dominantType || 'other';
        const themeList = themes[dominant] || themes['other'];
        const randomTheme = themeList[Math.floor(Math.random() * themeList.length)];
        const codeName = `OP: ${randomTheme} ${Math.floor(Math.random() * 90 + 10)}`;

        briefCodename.textContent = codeName;
        briefDistance.textContent = `${analysis.totalDistance} km`;
        briefTerrain.textContent = dominant.charAt(0).toUpperCase() + dominant.slice(1);
        briefCount.textContent = analysis.totalLocations;

        // New Data
        briefEta.textContent = eta;
        briefRisk.textContent = risk.label;
        briefRisk.style.color = risk.color;

        if (loadout.valid) {
            briefText.innerHTML = `All systems nominal. Gear check complete. Intel suggests a highly optimized route through <span style="color:#7fffd4">${analysis.totalLocations}</span> strategic locations.`;
            briefWarnings.style.display = 'none';
        } else {
            briefText.innerHTML = `Intel suggests a route through <span style="color:#7fffd4">${analysis.totalLocations}</span> strategic locations. <br><strong>CAUTION: Logistical gaps identified.</strong>`;
            briefWarnings.style.display = 'block';
            briefWarnings.innerHTML = `WARNING: Missing Critical Gear: ${loadout.missing.map(m => m.replace('_', ' ')).join(', ')}`;
        }

        briefingModal.classList.add('visible');
    });

    closeBriefing.addEventListener('click', () => {
        briefingModal.classList.remove('visible');
    });

    // --- EXPEDITION LOGIC END ---

    function handleMarkerClick(marker, location) {
        // A fluid transition to the point of interest.
        map.flyTo(location.coords, 11, {
            animate: true,
            duration: 1.5
        });

        // Manage the state of the beacons. Only one may be fully illuminated at a time.
        if (activeMarker) {
            activeMarker.getElement().classList.remove('active');
        }
        marker.getElement().classList.add('active');
        activeMarker = marker;

        if (constellation) {
            constellation.setActiveLocation(location);
        }

        // The reveal of information is a choreographed sequence.
        // First, reset the state to ensure a clean animation every time.
        infoPanel.classList.remove('visible');

        panelContent.scrollTop = 0;
        panelImage.style.transform = 'scale(1.1)';

        // A brief pause allows the map to settle before the panel presentation begins.
        setTimeout(() => {
            panelTitle.textContent = location.name;
            panelType.textContent = location.type;
            panelDescription.textContent = location.description;
            panelAtmosphere.textContent = location.atmosphere;
            panelImage.src = location.image;
            panelImage.alt = location.name;
            updateAddButtonState(); // Update button state based on selection
            infoPanel.classList.add('visible');
        }, 500);
    }

    function closeInfoPanel() {
        infoPanel.classList.remove('visible');
        if (activeMarker) {
            activeMarker.getElement().classList.remove('active');
            activeMarker = null;
        }
        if (constellation) {
            constellation.setActiveLocation(null);
        }
        // A gentle retreat, returning focus to the whole.
        map.flyTo([17.1899, -88.4976], 8, {
            animate: true,
            duration: 1.0
        });
    }

    // The experience begins with a single, intentional gesture.
    introduction.addEventListener('click', () => {
        introduction.classList.add('hidden');
        // The map should not exist until it is summoned.
        setTimeout(initializeMap, 500);
    }, { once: true });

    closePanelButton.addEventListener('click', closeInfoPanel);

    mapContainer.addEventListener('click', (e) => {
        // If one clicks away from a beacon, the focus should return to the whole.
        if (e.target.classList.contains('leaflet-container')) {
            closeInfoPanel();
        }
    });
});
