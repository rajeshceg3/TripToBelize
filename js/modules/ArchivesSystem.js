class ArchivesSystem {
    constructor(decisionSupport, expeditionManager, uiRefs) {
        this.decisionSupport = decisionSupport;
        this.expeditionManager = expeditionManager;
        this.ui = uiRefs; // { modal, list, details, openBtn, closeBtn }

        this.init();
    }

    init() {
        if (this.ui.openBtn) {
            this.ui.openBtn.addEventListener('click', () => this.open());
        }
        if (this.ui.closeBtn) {
            this.ui.closeBtn.addEventListener('click', () => this.close());
        }

        // Modal Backdrop Click
        this.ui.modal.addEventListener('click', (e) => {
            if (e.target === this.ui.modal) {
                this.close();
            }
        });

        // Focus Trap
        this.ui.modal.addEventListener('keydown', (e) => {
            if (this.ui.modal.classList.contains('visible')) {
                Utils.handleFocusTrap(e, this.ui.modal);
            }
        });
    }

    open() {
        const scenarios = this.decisionSupport.getScenarios();
        this.renderList(scenarios);

        // Reset Details
        this.ui.details.replaceChildren();
        const defaultMsg = document.createElement('span');
        defaultMsg.classList.add('text-tertiary');
        defaultMsg.textContent = 'Select a mission profile to analyze.';
        this.ui.details.appendChild(defaultMsg);

        this.ui.modal.classList.add('visible');
        this.ui.modal.setAttribute('aria-hidden', 'false');
    }

    close() {
        this.ui.modal.classList.remove('visible');
        this.ui.modal.setAttribute('aria-hidden', 'true');
    }

    renderList(scenarios) {
        this.ui.list.replaceChildren(); // Secure clearing

        if (scenarios.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.padding = '20px';
            emptyMsg.classList.add('text-tertiary');
            emptyMsg.textContent = 'No archives found.';
            this.ui.list.appendChild(emptyMsg);
            return;
        }

        scenarios.forEach(s => {
            const item = document.createElement('div');
            item.className = 'target-row'; // Reuse style
            item.style.cursor = 'pointer';
            item.style.marginBottom = '8px';

            const date = new Date(s.timestamp).toLocaleDateString();

            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.flexDirection = 'column';

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('text-cyan', 'font-bold');
            nameSpan.textContent = s.name; // Secure text content

            const metaSpan = document.createElement('span');
            metaSpan.style.fontSize = '0.75rem';
            metaSpan.classList.add('text-tertiary');
            metaSpan.textContent = `${date} • ${s.analysis.riskLabel}`;

            contentDiv.appendChild(nameSpan);
            contentDiv.appendChild(metaSpan);

            const arrowDiv = document.createElement('div');
            arrowDiv.style.fontSize = '1.2rem';
            arrowDiv.textContent = '›';

            item.appendChild(contentDiv);
            item.appendChild(arrowDiv);

            item.addEventListener('click', () => this.showDetails(s));
            this.ui.list.appendChild(item);
        });
    }

    showDetails(scenario) {
        const a = scenario.analysis;

        // Securely build the DOM instead of using innerHTML with user input
        this.ui.details.textContent = ''; // Clear existing

        const title = document.createElement('h3');
        title.className = 'archives-details-title';
        title.textContent = scenario.name;

        const uuid = document.createElement('div');
        uuid.className = 'archives-uuid';
        uuid.textContent = `UUID: ${scenario.id.substring(0,8)}...`;

        const grid = document.createElement('div');
        grid.className = 'archives-grid';

        const createCard = (label, val, color = null) => {
            const card = document.createElement('div');
            card.className = 'archives-card';
            const l = document.createElement('span');
            l.className = 'archives-card-label';
            l.textContent = label;
            const v = document.createElement('span');
            v.className = 'archives-card-value';
            if (color) v.style.color = color;
            v.textContent = val;
            card.appendChild(l);
            card.appendChild(v);
            return card;
        };

        grid.appendChild(createCard("DURATION", `${Math.floor(a.durationHours)}h ${Math.round((a.durationHours%1)*60)}m`));
        grid.appendChild(createCard("RISK SCORE", `${a.riskScore}/100`, a.riskColor));

        const metrics = document.createElement('div');
        metrics.className = 'archives-metrics';

        const metricTitle = document.createElement('span');
        metricTitle.className = 'archives-metric-title';
        metricTitle.textContent = "PREDICTED RESOURCE DRAIN";
        metrics.appendChild(metricTitle);

        const createBar = (label, val, color) => {
            const wrap = document.createElement('div');
            wrap.className = 'archives-metric-wrap';

            const meta = document.createElement('div');
            meta.className = 'archives-metric-meta';
            const l = document.createElement('span'); l.textContent = label;
            const v = document.createElement('span'); v.textContent = `${val}%`;
            meta.appendChild(l); meta.appendChild(v);

            const track = document.createElement('div');
            track.className = 'archives-metric-track';
            const fill = document.createElement('div');
            fill.className = 'archives-metric-fill';
            fill.style.width = `${Math.min(val, 100)}%`;
            fill.style.backgroundColor = color;
            track.appendChild(fill);

            wrap.appendChild(meta);
            wrap.appendChild(track);
            return wrap;
        };

        metrics.appendChild(createBar("Supplies", a.predictedSupplies, "var(--glow-cyan)"));
        metrics.appendChild(createBar("Fatigue", a.predictedFatigue, "var(--warning-gold)"));

        const btnGroup = document.createElement('div');
        btnGroup.className = 'archives-btn-group';

        const loadBtn = document.createElement('button');
        loadBtn.className = "btn-action";
        loadBtn.textContent = "Load & Deploy";
        loadBtn.addEventListener('click', () => {
            this.loadScenarioIntoExpedition(scenario);
            this.close();
        });

        const delBtn = document.createElement('button');
        delBtn.className = "btn-action secondary archives-btn-delete";
        delBtn.textContent = "Delete";
        delBtn.addEventListener('click', () => {
            if(confirm('Confirm deletion of tactical record?')) {
                this.decisionSupport.deleteScenario(scenario.id);
                this.open(); // Refresh list
            }
        });

        btnGroup.appendChild(loadBtn);
        btnGroup.appendChild(delBtn);

        this.ui.details.appendChild(title);
        this.ui.details.appendChild(uuid);
        this.ui.details.appendChild(grid);
        this.ui.details.appendChild(metrics);
        this.ui.details.appendChild(btnGroup);
    }

    loadScenarioIntoExpedition(scenario) {
        // Clear current
        this.expeditionManager.clear();

        // Restore locations (Sequentially to maintain order)
        // We have the raw location objects in scenario.locations.
        // ExpeditionManager.addLocation expects a location object.
        scenario.locations.forEach(loc => {
            this.expeditionManager.addLocation(loc);
        });

        // Restore gear
        // Dispatch event or callback to update UI checkboxes
        // Since we don't have direct access to selectedGear from here easily without refactoring more,
        // we will emit a custom event that app.js listens to, OR we rely on a shared state.
        // Ideally, ExpeditionManager should manage gear too, but it doesn't currently.
        // Workaround: Emit event.
        const event = new CustomEvent('restoreGear', { detail: { gear: scenario.gear } });
        window.dispatchEvent(event);

        Utils.showToast(`Mission Profile "${scenario.name}" Loaded.`, "success");
    }
}
