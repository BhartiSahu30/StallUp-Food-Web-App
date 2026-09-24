/* ============================================================
   StallUp — Map / Discovery View
   ============================================================ */

const MapPage = {
  _selectedPin: null,

  render() {
    const proposals = DATA.proposals;
    return `
      <div class="map-page">
        <!-- Left sidebar: list -->
        <div class="map-sidebar">
          <div style="margin-bottom:var(--sp-4)">
            <div style="font-size:var(--text-lg);font-weight:800;color:var(--navy);margin-bottom:4px">Discovery Map</div>
            <div style="font-size:var(--text-sm);color:var(--muted)">Explore food businesses across Indore</div>
          </div>

          <div class="search-bar" style="margin-bottom:var(--sp-4)">
            <span class="search-bar-icon">🔍</span>
            <input type="text" placeholder="Search businesses..." oninput="MapPage.filterList(this.value)" />
          </div>

          <div id="map-list" style="display:flex;flex-direction:column;gap:var(--sp-2)">
            ${proposals.map(p => this.renderListItem(p)).join('')}
          </div>
        </div>

        <!-- Map visualization -->
        <div class="map-main" id="map-canvas">
          ${this.renderMap(proposals)}
        </div>
      </div>
    `;
  },

  renderListItem(p) {
    const isSelected = this._selectedPin === p.id;
    return `
      <div id="list-${p.id}" style="padding:var(--sp-3) var(--sp-4);border-radius:var(--r-lg);cursor:pointer;
        background:${isSelected ? 'var(--saffron-pale)' : 'var(--white)'};
        border:1.5px solid ${isSelected ? 'var(--saffron)' : 'var(--border-light)'};
        transition:all 0.15s ease"
        onclick="MapPage.selectPin('${p.id}')"
        onmouseenter="this.style.background='var(--off-white)'"
        onmouseleave="this.style.background='${isSelected ? 'var(--saffron-pale)' : 'var(--white)'}'">
        <div style="display:flex;align-items:center;gap:var(--sp-3)">
          <div style="font-size:22px;width:36px;height:36px;background:var(--off-white);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            ${p.categoryEmoji}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:var(--text-sm);color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.businessName}</div>
            <div style="font-size:var(--text-xs);color:var(--muted)">${p.neighborhood} · ${Components.formatRupees(p.capitalRequired)}</div>
          </div>
          <span class="verify-badge ${p.verificationStatus}" style="font-size:10px;padding:2px 8px">
            ${p.verificationStatus === 'verified' ? '✓' : '⏳'}
          </span>
        </div>
      </div>
    `;
  },

  renderMap(proposals) {
    // Indore-style schematic map with SVG pins
    // Map is 800x520 conceptual canvas
    const pins = proposals.map(p => {
      const x = p.mapPosition.x; // percent
      const y = p.mapPosition.y; // percent
      const isSelected = this._selectedPin === p.id;
      const color = p.verificationStatus === 'verified' ? '#1C7C4A' : '#D97706';

      return `
        <g class="map-pin" transform="translate(${x}%,${y}%)" onclick="MapPage.selectPin('${p.id}')" id="pin-${p.id}">
          <circle cx="0" cy="0" r="${isSelected ? 20 : 14}" fill="${color}" fill-opacity="${isSelected ? '0.15' : '0'}">
            <animate attributeName="r" values="${isSelected ? '18;24;18' : '0'}" dur="1.5s" repeatCount="indefinite"/>
          </circle>
          <path d="M0,-20 C-10,-20 -14,-10 -14,0 C-14,8 -7,16 0,24 C7,16 14,8 14,0 C14,-10 10,-20 0,-20 Z"
            fill="${color}" stroke="white" stroke-width="2"
            transform="${isSelected ? 'scale(1.2)' : 'scale(1)'}"
            style="transition:transform 0.2s ease"/>
          <text x="0" y="6" text-anchor="middle" font-size="12" fill="white" style="pointer-events:none">${p.categoryEmoji}</text>
        </g>
      `;
    });

    // Tooltip if selected
    const selected = this._selectedPin ? DATA.proposals.find(p => p.id === this._selectedPin) : null;

    return `
      <div style="width:100%;height:100%;position:relative;background:#E8EDF6">
        <!-- Schematic map background -->
        <svg width="100%" height="100%" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">
          <!-- Road network (schematic) -->
          <rect width="800" height="520" fill="#E8EDF6"/>

          <!-- Main roads -->
          <line x1="0" y1="260" x2="800" y2="260" stroke="#D4D9E6" stroke-width="10"/>
          <line x1="400" y1="0" x2="400" y2="520" stroke="#D4D9E6" stroke-width="10"/>
          <line x1="0" y1="100" x2="800" y2="420" stroke="#D4D9E6" stroke-width="6"/>
          <line x1="0" y1="420" x2="800" y2="100" stroke="#D4D9E6" stroke-width="6"/>
          <line x1="150" y1="0" x2="150" y2="520" stroke="#DDE3EF" stroke-width="4"/>
          <line x1="650" y1="0" x2="650" y2="520" stroke="#DDE3EF" stroke-width="4"/>
          <line x1="0" y1="150" x2="800" y2="150" stroke="#DDE3EF" stroke-width="4"/>
          <line x1="0" y1="380" x2="800" y2="380" stroke="#DDE3EF" stroke-width="4"/>

          <!-- Area blocks -->
          <rect x="60" y="50" width="180" height="120" rx="8" fill="#D8E4F5" fill-opacity="0.5"/>
          <rect x="300" y="200" width="200" height="140" rx="8" fill="#D8E4F5" fill-opacity="0.5"/>
          <rect x="520" y="60" width="220" height="160" rx="8" fill="#D8E4F5" fill-opacity="0.5"/>
          <rect x="100" y="320" width="160" height="120" rx="8" fill="#D8E4F5" fill-opacity="0.5"/>
          <rect x="530" y="300" width="200" height="150" rx="8" fill="#D8E4F5" fill-opacity="0.5"/>

          <!-- Area labels -->
          <text x="150" y="120" text-anchor="middle" font-size="11" fill="#8CA0C8" font-family="Plus Jakarta Sans, sans-serif" font-weight="600">Vijay Nagar</text>
          <text x="400" y="275" text-anchor="middle" font-size="11" fill="#8CA0C8" font-family="Plus Jakarta Sans, sans-serif" font-weight="600">Rajwada</text>
          <text x="630" y="145" text-anchor="middle" font-size="11" fill="#8CA0C8" font-family="Plus Jakarta Sans, sans-serif" font-weight="600">Palasia</text>
          <text x="180" y="385" text-anchor="middle" font-size="11" fill="#8CA0C8" font-family="Plus Jakarta Sans, sans-serif" font-weight="600">MG Road</text>
          <text x="630" y="380" text-anchor="middle" font-size="11" fill="#8CA0C8" font-family="Plus Jakarta Sans, sans-serif" font-weight="600">Scheme 54</text>
          <text x="450" y="435" text-anchor="middle" font-size="11" fill="#8CA0C8" font-family="Plus Jakarta Sans, sans-serif" font-weight="600">Chhappan Dukaan</text>

          <!-- City label -->
          <text x="400" y="30" text-anchor="middle" font-size="16" fill="#1A2340" font-family="Plus Jakarta Sans, sans-serif" font-weight="800">Indore</text>

          <!-- Pins -->
          ${pins.join('')}
        </svg>

        <!-- Selected tooltip -->
        ${selected ? `
          <div class="map-tooltip" style="
            left: calc(${selected.mapPosition.x}% + 20px);
            top: calc(${selected.mapPosition.y}% - 40px);
            opacity:1
          ">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <span style="font-size:18px">${selected.categoryEmoji}</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:var(--navy)">${selected.businessName}</div>
                <div style="font-size:11px;color:var(--muted)">${selected.neighborhood}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
              <span class="badge badge-gray" style="font-size:10px">${selected.category}</span>
              <span class="badge badge-saffron" style="font-size:10px">${Components.formatRupees(selected.capitalRequired)}</span>
              <span class="verify-badge ${selected.verificationStatus}" style="font-size:10px">${selected.verificationStatus === 'verified' ? '✓ Verified' : '⏳'}</span>
            </div>
            <button class="btn btn-primary btn-sm w-full" onclick="Router.navigate('business-detail', '${selected.id}')">
              View Details →
            </button>
          </div>
        ` : `
          <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(26,35,64,0.8);color:white;padding:8px 16px;border-radius:var(--r-full);font-size:12px;pointer-events:none">
            Click a pin to view business details
          </div>
        `}

        <!-- Legend -->
        <div style="position:absolute;top:16px;right:16px;background:white;border:1px solid var(--border-light);border-radius:var(--r-lg);padding:10px 14px">
          <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:6px;text-transform:uppercase">Legend</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <div style="width:10px;height:10px;border-radius:50%;background:#1C7C4A"></div>
            <span style="font-size:11px;color:var(--charcoal)">Verified</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:10px;height:10px;border-radius:50%;background:#D97706"></div>
            <span style="font-size:11px;color:var(--charcoal)">Pending</span>
          </div>
        </div>
      </div>
    `;
  },

  selectPin(id) {
    this._selectedPin = id;
    // Re-render map
    const canvas = document.getElementById('map-canvas');
    if (canvas) canvas.innerHTML = this.renderMap(DATA.proposals);

    // Update list selection
    const list = document.getElementById('map-list');
    if (list) {
      list.innerHTML = DATA.proposals.map(p => this.renderListItem(p)).join('');
    }

    // Scroll to item in list
    const listItem = document.getElementById(`list-${id}`);
    if (listItem) listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  filterList(query) {
    const q = query.toLowerCase();
    const filtered = DATA.proposals.filter(p =>
      p.businessName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q)
    );
    const list = document.getElementById('map-list');
    if (list) list.innerHTML = filtered.map(p => this.renderListItem(p)).join('');
  },
};
