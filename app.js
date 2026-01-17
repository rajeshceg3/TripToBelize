// The narrative begins here. Data is not just data; it is a collection of stories.
// Images are summoned from the ether, ensuring the experience is light and immediate.
// ENHANCEMENT: Operational metrics added for Tactical Logistics System.

// locations are now loaded from js/data.js

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
    const btnSimulateMission = document.getElementById('btn-simulate-mission');

    // Mission Control elements
    const missionControlPanel = document.getElementById('mission-control');
    const mcTimer = document.getElementById('mc-timer');
    const barIntegrity = document.getElementById('bar-integrity');
    const barSupplies = document.getElementById('bar-supplies');
    const barFatigue = document.getElementById('bar-fatigue');
    const valIntegrity = document.getElementById('val-integrity');
    const valSupplies = document.getElementById('val-supplies');
    const valFatigue = document.getElementById('val-fatigue');
    const mcLogContainer = document.getElementById('mc-log-container');
    const btnMcPause = document.getElementById('btn-mc-pause');
    const btnMcAbort = document.getElementById('btn-mc-abort');

    // Briefing Modal elements
    const briefingModal = document.getElementById('briefing-modal');
    const closeBriefing = document.getElementById('close-briefing');
    const btnSaveScenario = document.getElementById('btn-save-scenario');
    const btnBriefExecute = document.getElementById('btn-brief-execute');
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
    const decisionSupport = new DecisionSupport(logisticsCore);
    let tacticalOverlay;
    let missionSimulator;
    let strategicPathfinder;
    let telemetryStream;
    let overwatch;

    // Architecture Hardening: Robustness Check
    if (typeof Overwatch === 'undefined' || typeof TelemetryStream === 'undefined') {
        console.error("CRITICAL: Tactical Modules (Overwatch/Telemetry) failed to initialize. UMD/Global scope mismatch detected.");
        // We can add a user-facing toast here if desired, but for now we ensure it doesn't crash later.
    }

    // SYSTEM INTEGRITY CHECK
    // Robustness: Check global scope explicitly and handle potential race conditions
    const getLocations = () => window.locations || (typeof locations !== 'undefined' ? locations : null);

    if (!getLocations() || !Array.isArray(getLocations())) {
        console.error("CRITICAL: Geospatial Data (locations) failed to load.");
        // Attempt to recover or notify
        Utils.showToast("SYSTEM FAILURE: Geospatial Data Corrupted. Please refresh.", "critical");
        // In a real scenario, we might retry fetch here.
        return; // Halt execution
    }
    // Ensure local reference is valid
    const validLocations = getLocations();

    // Initialize Expedition Manager
    const expeditionManager = new ExpeditionManager();
    let routeLayer = null;
    let selectedGear = []; // Track selected gear

    const filterContainer = document.getElementById('filter-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Create Archives Button dynamically
    const archivesButton = document.createElement('button');
    archivesButton.className = 'filter-btn archives-btn';
    archivesButton.textContent = 'Archives';
    archivesButton.setAttribute('aria-label', 'Open Tactical Archives');
    filterContainer.appendChild(archivesButton);

    // Archives System Integration
    const archivesModal = document.getElementById('archives-modal');
    const closeArchives = document.getElementById('close-archives');
    const archivesList = document.getElementById('archives-list');
    const archivesDetails = document.getElementById('archives-details');

    // Defer initialization to ensure DOM and classes are ready
    let archivesSystem;
    if (typeof ArchivesSystem !== 'undefined') {
        archivesSystem = new ArchivesSystem(decisionSupport, expeditionManager, {
            modal: archivesModal,
            list: archivesList,
            details: archivesDetails,
            openBtn: archivesButton,
            closeBtn: closeArchives
        });
    } else {
        console.error("ArchivesSystem module failed to load.");
    }

    // Listen for Gear Restoration from Archives
    window.addEventListener('restoreGear', (e) => {
        selectedGear = [...e.detail.gear];
        updateExpeditionUI();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            // A11y update
            const activeBtn = filterContainer.querySelector('.active');
            if (activeBtn) {
                activeBtn.classList.remove('active');
                activeBtn.setAttribute('aria-pressed', 'false');
            }
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

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

    // Mobile Drag Support
    setupMobileDrag(infoPanel, closeInfoPanel);
    setupMobileDrag(expeditionHud, () => expeditionHud.classList.remove('visible'));

    function setupMobileDrag(panel, closeCallback) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        const threshold = 100; // px to close

        panel.addEventListener('touchstart', (e) => {
            // Only trigger if at top of scroll or strictly on the handle area (top 40px)
            // Fix: Check if target is a descendant of the handle or header area to prevent accidental drags
            // For now, simple scrollTop check is okay but let's make it robust
            if (panel.scrollTop <= 0) {
                startY = e.touches[0].clientY;
                isDragging = true;
                panel.style.transition = 'none'; // Disable transition for direct tracking
            }
        }, { passive: true });

        panel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;

            if (deltaY > 0) { // Dragging down
                 // Prevent default scroll if we are dragging the panel itself
                 if (e.cancelable) e.preventDefault();
                 panel.style.transform = `translateY(${deltaY}px)`;
            }
        }, { passive: false });

        panel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            panel.style.transition = 'transform 0.6s var(--ease-fluid), opacity 0.6s ease'; // Restore transition

            const deltaY = currentY - startY;
            if (deltaY > threshold) {
                closeCallback();
                // Reset transform after animation (handled by CSS class toggle usually, but ensure cleanup)
                setTimeout(() => { panel.style.transform = ''; }, 600);
            } else {
                // Snap back
                panel.style.transform = '';
            }
        });
    }

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
                iconSize: [20, 20]
            });
            const marker = L.marker(location.coords, { icon: icon, keyboard: false }).addTo(map);

            marker.on('click', () => {
                handleMarkerClick(marker, location);
            });

            // Add keyboard support to the custom div icon
            const el = marker.getElement();
            if (el) {
                el.tabIndex = 0;
                el.setAttribute('role', 'button');
                el.setAttribute('aria-label', location.name);
                el.addEventListener('keydown', (e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                         handleMarkerClick(marker, location);
                         e.preventDefault();
                     }
                });
            }

            markers.push({marker, location});
        });

        constellation = new Constellation('constellation-canvas', map, locations);
        constellation.start();

        initTacticalOverlay();
        initMissionSimulator();

        // Initialize Expedition Route Visualization
        updateExpeditionUI();
    }

    // --- EXPEDITION LOGIC START ---

    // Initialize Tactical Overlay
    function initTacticalOverlay() {
        if (map && !tacticalOverlay) {
            tacticalOverlay = new TacticalOverlay(map);

            // Initialize Pathfinder with map bounds
            const bounds = map.getBounds();
            const mapBounds = {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
            };
            strategicPathfinder = new StrategicPathfinder(mapBounds, 0.01);

            // Create some simulated risk zones
            const riskZones = [
                { coords: [17.5, -88.0], radius: 10, risk: 80 }, // High risk marine
                { coords: [16.8, -88.8], radius: 15, risk: 60 }  // High risk jungle
            ];

            strategicPathfinder.initializeGrid(riskZones);
            tacticalOverlay.setRiskZones(riskZones);

            const toggleHandler = () => {
                const isVisible = tacticalOverlay.toggle();
                if (isVisible) {
                    tacticalToggle.classList.add('active');
                    tacticalToggle.setAttribute('aria-pressed', 'true');
                } else {
                    tacticalToggle.classList.remove('active');
                    tacticalToggle.setAttribute('aria-pressed', 'false');
                }
            };

            tacticalToggle.addEventListener('click', toggleHandler);
            tacticalToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    toggleHandler();
                }
            });
        }
    }

    // --- MISSION SIMULATOR INTEGRATION START ---

    function initMissionSimulator() {
        missionSimulator = new MissionSimulator(
            map,
            logisticsCore,
            tacticalOverlay,
            updateMissionControlUI, // onUpdate
            logMissionEvent,        // onEvent
            handleSimulationComplete // onComplete
        );

        // Inject Pathfinder
        missionSimulator.setPathfinder(strategicPathfinder);

        // --- OVERWATCH & TELEMETRY INTEGRATION ---
        // Robustness Check: Ensure modules are available
        if (typeof TelemetryStream !== 'undefined' && typeof Overwatch !== 'undefined') {
            telemetryStream = new TelemetryStream();
            overwatch = new Overwatch(missionSimulator, strategicPathfinder, tacticalOverlay);

            // Connect streams
            telemetryStream.subscribe((intel) => {
                overwatch.processIntel(intel);
            });
        } else {
            console.warn("Tactical systems offline due to missing dependencies.");
        }

        // Listen for Overwatch Alerts
        window.addEventListener('overwatch-alert', (e) => {
            const threat = e.detail.threat;
            const action = e.detail.action;

            // Show alert in log
            logMissionEvent(`ALERT: ${threat.message} (${threat.severity})`, 'critical');
            Utils.showToast(`ALERT: ${threat.message}`, 'critical');

            if (action === 'REROUTE_REQUIRED') {
                // Auto-confirm for this prototype, or show a modal
                // Ideally, we pause and ask user.
                // REFACTOR: Replaced blocking confirm with auto-reroute + toast for flow
                Utils.showToast("Initiating Evasive Maneuvers...", "warning");

                setTimeout(() => {
                    overwatch.executeReroute();
                    // Resume automatically or wait?
                    // overwatch.executeReroute leaves it paused.
                    setTimeout(() => {
                        missionSimulator.resume(); // Explicitly resume
                    }, 1000);
                }, 1500);
            }
        });
        // -----------------------------------------

        btnSimulateMission.addEventListener('click', () => {
            const list = expeditionManager.getExpedition();
            if (list.length < 2) {
                Utils.showToast("MISSION ABORTED: Minimum 2 targets required.", "critical");
                return;
            }

            // Hide other panels
            expeditionHud.classList.remove('visible');
            briefingModal.classList.remove('visible');

            // Show Mission Control
            missionControlPanel.classList.add('visible');
            mcLogContainer.replaceChildren(); // Secure clearing

            // Start
            missionSimulator.start(list);

            // Activate Overwatch and Telemetry
            if (overwatch) overwatch.engage();
            if (telemetryStream) telemetryStream.connect();

            // Auto-enable tactical overlay
            if (tacticalOverlay && !tacticalOverlay.isVisible) {
                tacticalOverlay.show();
                tacticalToggle.classList.add('active');
            }
        });

        btnMcPause.addEventListener('click', () => {
            if (missionSimulator.state.status === 'RUNNING') {
                missionSimulator.pause();
            } else if (missionSimulator.state.status === 'PAUSED') {
                missionSimulator.resume();
            }
            btnMcPause.textContent = missionSimulator.state.status === 'PAUSED' ? "Resume" : "Pause";
        });

        btnMcAbort.addEventListener('click', () => {
            // Replaced blocking confirm
            missionSimulator.abort();
            Utils.showToast("Mission Aborted by Command.", "warning");
        });
    }

    function updateMissionControlUI(state) {
        // Time
        mcTimer.textContent = state.currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Bars
        updateBar(barIntegrity, valIntegrity, state.integrity);
        updateBar(barSupplies, valSupplies, state.supplies);
        updateBar(barFatigue, valFatigue, state.fatigue, true);
    }

    function updateBar(bar, val, value, isInverse = false) {
        bar.style.width = `${Math.round(value)}%`;
        val.textContent = `${Math.round(value)}%`;

        if (isInverse) {
            // High is bad (Fatigue)
            if (value > 80) bar.style.backgroundColor = '#ff6b6b';
            else if (value > 50) bar.style.backgroundColor = '#ffd93d';
            else bar.style.backgroundColor = '#7fffd4';
        } else {
            // Low is bad (Supplies/Integrity)
            if (value < 20) bar.style.backgroundColor = '#ff6b6b';
            else if (value < 50) bar.style.backgroundColor = '#ffd93d';
            else bar.style.backgroundColor = '#7fffd4';
        }
    }

    function logMissionEvent(msg, type) {
        const div = document.createElement('div');
        div.className = `log-entry ${type}`;

        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        div.textContent = `[${time}] ${msg}`;

        mcLogContainer.appendChild(div);
        mcLogContainer.scrollTop = mcLogContainer.scrollHeight;
    }

    function handleSimulationComplete(success) {
        btnMcPause.textContent = "Pause"; // Reset

        // Deactivate Overwatch
        if (overwatch) overwatch.disengage();
        if (telemetryStream) telemetryStream.disconnect();

        setTimeout(() => {
             // Non-blocking transition
             Utils.showToast(success ? "Mission Complete." : "Mission Failed.", success ? "success" : "critical");

             setTimeout(() => {
                 missionControlPanel.classList.remove('visible');
                 expeditionHud.classList.add('visible');
             }, 2000);
        }, 1000);
    }

    // --- MISSION SIMULATOR INTEGRATION END ---

    function updateExpeditionUI() {
        const list = expeditionManager.getExpedition();
        expeditionList.replaceChildren(); // Secure clearing

        if (list.length > 0) {
            expeditionHud.classList.add('visible');
            expeditionCount.textContent = `${list.length} Target${list.length > 1 ? 's' : ''}`;
        } else {
            expeditionHud.classList.remove('visible');
            expeditionCount.textContent = '0 Targets';
        }

        // UX: Disable simulate if insufficient targets
        // REFACTOR: Keep button enabled to allow feedback toast on click, but visually indicate invalid state
        if (list.length < 2) {
             btnSimulateMission.setAttribute('aria-disabled', 'true');
             btnSimulateMission.style.opacity = '0.5';
             btnSimulateMission.style.cursor = 'not-allowed';
             btnSimulateMission.style.borderColor = 'var(--text-tertiary)';
             btnSimulateMission.title = "Minimum 2 targets required";
        } else {
             btnSimulateMission.setAttribute('aria-disabled', 'false');
             btnSimulateMission.style.opacity = '1';
             btnSimulateMission.style.cursor = 'pointer';
             btnSimulateMission.style.borderColor = ''; // Reset to default
             btnSimulateMission.title = "Start Mission Simulation";
        }

        list.forEach(loc => {
            const div = document.createElement('div');
            div.className = 'expedition-item';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = loc.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn btn-reset';
            removeBtn.title = 'Remove Target';
            removeBtn.textContent = '×';
            removeBtn.setAttribute('aria-label', `Remove ${loc.name}`);

            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                expeditionManager.removeLocation(loc.name);
            });

            removeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    expeditionManager.removeLocation(loc.name);
                }
            });

            div.appendChild(nameSpan);
            div.appendChild(removeBtn);
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

        gearContainer.replaceChildren(); // Secure clearing

        if (required.length === 0) {
            const span = document.createElement('span');
            span.style.fontSize = '0.7rem';
            span.style.color = '#aaa';
            span.style.fontStyle = 'italic';
            span.textContent = 'No special gear required.';
            gearContainer.appendChild(span);
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
        expeditionManager.clear();
        Utils.showToast("Expedition Plan Cleared.", "info");
    });

    // Staging for current briefing data
    let currentBriefingData = null;

    // Handle "Generate Brief"
    btnGenerateBrief.addEventListener('click', () => {
        const list = expeditionManager.getExpedition();
        const analysis = expeditionManager.analyzeComposition();
        if (!analysis) {
             Utils.showToast("DATA INSUFFICIENT: Select at least one target.", "warning");
             return;
        }

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

        // Store data for saving
        currentBriefingData = {
            name: codeName,
            locations: list,
            gear: selectedGear,
            metrics: {
                totalDistance: analysis.totalDistance
            }
        };

        briefCodename.textContent = codeName;
        briefDistance.textContent = `${analysis.totalDistance} km`;
        briefTerrain.textContent = dominant.charAt(0).toUpperCase() + dominant.slice(1);
        briefCount.textContent = analysis.totalLocations;

        // New Data
        briefEta.textContent = eta;
        briefRisk.textContent = risk.label;
        briefRisk.style.color = risk.color;

        // Security Patch: Prevent XSS by using textContent and child elements
        briefText.textContent = ''; // Clear previous
        const introText = document.createTextNode(loadout.valid
            ? "All systems nominal. Gear check complete. Intel suggests a highly optimized route through "
            : "Intel suggests a route through ");
        briefText.appendChild(introText);

        const countSpan = document.createElement('span');
        countSpan.style.color = '#7fffd4';
        countSpan.textContent = `${analysis.totalLocations} strategic locations.`;
        briefText.appendChild(countSpan);

        if (loadout.valid) {
            briefWarnings.style.display = 'none';
        } else {
            const warningText = document.createElement('div');
            // Cleaner approach for the second part:
            briefText.appendChild(document.createElement('br'));
            const strong = document.createElement('strong');
            strong.textContent = "CAUTION: Logistical gaps identified.";
            briefText.appendChild(strong);

            briefWarnings.style.display = 'block';
            briefWarnings.textContent = `WARNING: Missing Critical Gear: ${loadout.missing.map(m => m.replace('_', ' ')).join(', ')}`;
        }

        briefingModal.classList.add('visible');
        briefingModal.setAttribute('aria-hidden', 'false');
        btnBriefExecute.focus(); // Set initial focus
    });

    btnBriefExecute.addEventListener('click', () => {
         // Execute Mission
         closeBriefingModal();
         // Simulate button logic
         const list = expeditionManager.getExpedition();
         if (list.length < 2) return;
         expeditionHud.classList.remove('visible');
         missionControlPanel.classList.add('visible');
         mcLogContainer.replaceChildren(); // Secure clearing
         missionSimulator.start(list);
         if (!tacticalOverlay.isVisible) {
             tacticalOverlay.show();
             tacticalToggle.classList.add('active');
         }
    });

    btnSaveScenario.addEventListener('click', () => {
        if (!currentBriefingData) return;
        const saved = decisionSupport.saveScenario(
            currentBriefingData.name,
            currentBriefingData.locations,
            currentBriefingData.gear,
            currentBriefingData.metrics
        );
        if (saved) {
            Utils.showToast(`Scenario "${saved.name}" Archived.`, "success");
            closeBriefingModal();
        }
    });

    closeBriefing.addEventListener('click', () => {
        closeBriefingModal();
    });

    // Archives Focus Trap (Delegated to ArchivesSystem but we might have a listener here still)
    // Removed duplicate listeners as ArchivesSystem handles them now.

    // --- EXPEDITION LOGIC END ---

    // Token for managing race conditions
    let currentImageRequestId = 0;

    function handleMarkerClick(marker, location) {
        // A fluid transition to the point of interest.
        // CHECK: Reduced Motion
        const animate = !Utils.prefersReducedMotion();
        map.flyTo(location.coords, 11, {
            animate: animate,
            duration: animate ? 1.5 : 0
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

        // Generate a new Request ID for this specific interaction
        currentImageRequestId++;
        const requestId = currentImageRequestId;

        // A brief pause allows the map to settle before the panel presentation begins.
        // OPTIMIZATION: Reduced delay from 500ms to 200ms to improve perceived responsiveness
        // while still allowing the map flyTo animation to initiate clearly.
        setTimeout(() => {
            // Check if this request is still valid
            if (requestId !== currentImageRequestId) return;

            panelTitle.textContent = location.name;
            panelType.textContent = location.type;
            panelDescription.textContent = location.description;
            panelAtmosphere.textContent = location.atmosphere;

            // UX Enhancement: Loading State
            panelImage.classList.add('loading');
            panelImage.style.opacity = '0';

            // Performance: Responsive Image Loading
            const width = window.innerWidth > 768 ? 800 : 400; // Load appropriate size
            // Append Unsplash width param or replace existing
            let imageUrl = location.image;
            if (imageUrl.includes('unsplash.com')) {
                if (imageUrl.includes('&w=')) {
                    imageUrl = imageUrl.replace(/&w=\d+/, `&w=${width}`);
                } else {
                    // Safe append check
                    const separator = imageUrl.includes('?') ? '&' : '?';
                    imageUrl += `${separator}w=${width}`;
                }
            }

            const img = new Image();
            img.onload = () => {
                // Check again before applying changes
                if (requestId !== currentImageRequestId) return;

                panelImage.src = imageUrl;
                panelImage.alt = location.name;
                panelImage.classList.remove('loading');
                panelImage.style.opacity = '1';
            };
            img.onerror = () => {
                if (requestId !== currentImageRequestId) return;
                // Use the fallback logic
                panelImage.src = location.image; // Trigger the fallback handler on panelImage
                panelImage.alt = location.name;
            };
            img.src = imageUrl;

            updateAddButtonState(); // Update button state based on selection
            infoPanel.classList.add('visible');

            // Accessibility: Move focus to the panel
            // We need to wait for the transition or force focus
            // Using a shorter delay matched to CSS transitions if needed, or immediate.
            setTimeout(() => {
                infoPanel.setAttribute('tabindex', '-1'); // Ensure focusable
                infoPanel.focus();
            }, 50);

        }, 200);
    }

    function closeInfoPanel() {
        infoPanel.classList.remove('visible');
        const prevMarker = activeMarker; // Store ref

        if (activeMarker) {
            activeMarker.getElement().classList.remove('active');
            activeMarker = null;
        }
        if (constellation) {
            constellation.setActiveLocation(null);
        }
        // A gentle retreat, returning focus to the whole.
        const animate = !Utils.prefersReducedMotion();
        map.flyTo([17.1899, -88.4976], 8, {
            animate: animate,
            duration: animate ? 1.0 : 0
        });

        // Accessibility: Return focus to marker
        if (prevMarker) {
            const el = prevMarker.getElement();
            if (el) el.focus();
        }
    }

    // The experience begins with a single, intentional gesture.
    function startExperience() {
        if (introduction.classList.contains('hidden')) return;
        introduction.classList.add('hidden');
        // The map should not exist until it is summoned.
        setTimeout(initializeMap, 500);
    }

    introduction.addEventListener('click', startExperience, { once: true });
    introduction.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            startExperience();
        }
    });

    closePanelButton.addEventListener('click', closeInfoPanel);
    closePanelButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            closeInfoPanel();
        }
    });

    // Close modal keyboard support
    closeBriefing.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
             closeBriefingModal();
        }
    });

    // Archives Focus Trap
    archivesModal.addEventListener('keydown', (e) => {
        if (!archivesModal.classList.contains('visible')) return;
        Utils.handleFocusTrap(e, archivesModal);
    });

    function closeBriefingModal() {
        briefingModal.classList.remove('visible');
        briefingModal.setAttribute('aria-hidden', 'true');
        btnGenerateBrief.focus(); // Restore focus to trigger
    }

    // Modal Focus Trap (Delegated to Utils)
    briefingModal.addEventListener('keydown', (e) => {
        if (!briefingModal.classList.contains('visible')) return;
        Utils.handleFocusTrap(e, briefingModal, closeBriefingModal);
    });

    // Image error handling
    panelImage.onerror = () => {
        panelImage.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill%3A%23001a29%3B%7D.cls-2%7Bfill%3A%2300384d%3B%7D.cls-3%7Bfill%3A%237fffd4%3Bfont-size%3A20px%3Bfont-family%3Amonospace%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Crect%20class%3D%22cls-1%22%20width%3D%22200%22%20height%3D%22200%22%2F%3E%3Crect%20class%3D%22cls-2%22%20x%3D%2280%22%20y%3D%2260%22%20width%3D%2240%22%20height%3D%2260%22%2F%3E%3Ctext%20class%3D%22cls-3%22%20x%3D%2250%22%20y%3D%22150%22%3ENO%20SIGNAL%3C%2Ftext%3E%3C%2Fsvg%3E';
        panelImage.classList.remove('loading');
        panelImage.style.opacity = '1';
    };

    mapContainer.addEventListener('click', (e) => {
        // If one clicks away from a beacon, the focus should return to the whole.
        if (e.target.classList.contains('leaflet-container')) {
            closeInfoPanel();
        }
    });
});
