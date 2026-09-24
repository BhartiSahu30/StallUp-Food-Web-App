/* ============================================================
   StallUp — Funder Dashboard (Browse, Matches, Saved)
   ============================================================ */

const FunderPage = {
  _section: 'browse',
  _activeFilter: '',

  render(section) {
    if (section) this._section = section;
    return `
      <div class="dashboard-layout">
        ${this.renderSidebar()}
        <div class="dashboard-content page-enter" id="funder-main">
          ${this.renderSection()}
        </div>
      </div>
    `;
  },

  renderSidebar() {
    const links = [
      { key: 'browse', icon: '🔍', label: 'Browse Businesses' },
      { key: 'matches', icon: '✨', label: 'AI Matches for You' },
      { key: 'saved', icon: '🔖', label: 'Saved Opportunities' },
      { key: 'profile', icon: '👤', label: 'My Profile' },
    ];
    return `
      <aside class="sidebar">
        <div class="sidebar-section-label">Funder</div>
        ${links.map(l => `
          <button class="sidebar-link ${this._section === l.key ? 'active' : ''}"
            onclick="FunderPage.switchSection('${l.key}')">
            <span class="sidebar-link-icon">${l.icon}</span>
            ${l.label}
          </button>
        `).join('')}
        <div class="sidebar-section-label">Discover</div>
        <button class="sidebar-link" onclick="Router.navigate('map')">
          <span class="sidebar-link-icon">🗺️</span> Discovery Map
        </button>
        <div style="margin-top:auto">
          <button class="sidebar-link" onclick="State.logout()">
            <span class="sidebar-link-icon">🚪</span> Sign Out
          </button>
        </div>
      </aside>
    `;
  },

  switchSection(key) {
    this._section = key;
    const main = document.getElementById('funder-main');
    main.innerHTML = '';
    main.classList.add('page-enter');
    main.innerHTML = this.renderSection();
    document.querySelectorAll('.sidebar-link').forEach(el => {
      const active = el.textContent.trim().toLowerCase().includes(
        { browse: 'browse', matches: 'ai matches', saved: 'saved', profile: 'profile' }[key] || ''
      );
      el.classList.toggle('active', active);
    });
    if (key === 'browse') setTimeout(() => this.initSearchHandlers(), 50);
  },

  renderSection() {
    if (this._section === 'browse') return this.renderBrowse();
    if (this._section === 'matches') return this.renderMatches();
    if (this._section === 'saved') return this.renderSaved();
    if (this._section === 'profile') return this.renderProfile();
    return '';
  },

  renderBrowse() {
    const proposals = DATA.proposals;
    return `
      <div>
        <div class="dashboard-title">Browse Businesses</div>
        <div class="dashboard-sub">Discover verified food businesses looking for support</div>

        <!-- Search & Filters -->
        <div style="background:var(--white);border:1px solid var(--border-light);border-radius:var(--r-xl);padding:var(--sp-5);margin-bottom:var(--sp-6)">
          <div class="search-bar" style="margin-bottom:var(--sp-4)">
            <span class="search-bar-icon">🔍</span>
            <input type="text" id="browse-search" placeholder="Search by business name, food type, or city..."
              oninput="FunderPage.applyFilters()" />
          </div>
          <div style="display:flex;gap:var(--sp-5);flex-wrap:wrap">
            <div style="flex:1;min-width:140px">
              <label style="font-size:var(--text-xs);font-weight:700;color:var(--muted);display:block;margin-bottom:4px">Category</label>
              <select class="form-select" id="filter-category" style="font-size:var(--text-sm)" onchange="FunderPage.applyFilters()">
                <option value="">All Categories</option>
                ${['Momos & Dumplings','Chaat & Street Snacks','South Indian','Breakfast Specials','North Indian / Dhaba','Beverages & Juices'].map(c =>
                  `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;min-width:120px">
              <label style="font-size:var(--text-xs);font-weight:700;color:var(--muted);display:block;margin-bottom:4px">City</label>
              <select class="form-select" id="filter-city" style="font-size:var(--text-sm)" onchange="FunderPage.applyFilters()">
                <option value="">All Cities</option>
                <option value="Indore">Indore</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Ujjain">Ujjain</option>
              </select>
            </div>
            <div style="flex:1;min-width:120px">
              <label style="font-size:var(--text-xs);font-weight:700;color:var(--muted);display:block;margin-bottom:4px">Stage</label>
              <select class="form-select" id="filter-stage" style="font-size:var(--text-sm)" onchange="FunderPage.applyFilters()">
                <option value="">All Stages</option>
                <option value="Early Stage">Early Stage</option>
                <option value="Growing">Growing</option>
                <option value="Expansion">Expansion</option>
                <option value="Established">Established</option>
              </select>
            </div>
            <div style="flex:1;min-width:120px">
              <label style="font-size:var(--text-xs);font-weight:700;color:var(--muted);display:block;margin-bottom:4px">Max Capital (₹)</label>
              <select class="form-select" id="filter-capital" style="font-size:var(--text-sm)" onchange="FunderPage.applyFilters()">
                <option value="">Any Amount</option>
                <option value="50000">Up to ₹50K</option>
                <option value="75000">Up to ₹75K</option>
                <option value="100000">Up to ₹1L</option>
                <option value="150000">Up to ₹1.5L</option>
              </select>
            </div>
            <div style="flex:1;min-width:120px">
              <label style="font-size:var(--text-xs);font-weight:700;color:var(--muted);display:block;margin-bottom:4px">Verification</label>
              <select class="form-select" id="filter-verify" style="font-size:var(--text-sm)" onchange="FunderPage.applyFilters()">
                <option value="">All</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-4)">
          <div id="browse-count" style="font-size:var(--text-sm);color:var(--muted)">
            Showing <strong>${proposals.length}</strong> businesses
          </div>
          <div class="filter-chips" id="active-filters"></div>
        </div>

        <div class="browse-grid" id="browse-grid">
          ${proposals.map(p => Components.renderBizCard(p)).join('')}
        </div>
      </div>
    `;
  },

  initSearchHandlers() {
    // Already wired via oninput/onchange
  },

  applyFilters() {
    const search = (document.getElementById('browse-search')?.value || '').toLowerCase();
    const category = document.getElementById('filter-category')?.value || '';
    const city = document.getElementById('filter-city')?.value || '';
    const stage = document.getElementById('filter-stage')?.value || '';
    const maxCapital = parseInt(document.getElementById('filter-capital')?.value) || Infinity;
    const verify = document.getElementById('filter-verify')?.value || '';

    const filtered = DATA.proposals.filter(p => {
      if (search && !p.businessName.toLowerCase().includes(search) &&
          !p.category.toLowerCase().includes(search) &&
          !p.city.toLowerCase().includes(search) &&
          !p.vendor.toLowerCase().includes(search)) return false;
      if (category && p.category !== category) return false;
      if (city && p.city !== city) return false;
      if (stage && p.stage !== stage) return false;
      if (p.capitalRequired > maxCapital) return false;
      if (verify && p.verificationStatus !== verify) return false;
      return true;
    });

    const grid = document.getElementById('browse-grid');
    const count = document.getElementById('browse-count');

    if (grid) {
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-title">No results found</div>
            <div class="empty-state-desc">Try adjusting your filters or search terms</div>
            <button class="btn btn-outline" onclick="FunderPage.clearFilters()">Clear Filters</button>
          </div>
        `;
      } else {
        grid.innerHTML = filtered.map(p => Components.renderBizCard(p)).join('');
      }
    }
    if (count) count.innerHTML = `Showing <strong>${filtered.length}</strong> businesses`;
  },

  clearFilters() {
    ['browse-search','filter-category','filter-city','filter-stage','filter-capital','filter-verify'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this.applyFilters();
  },

  handleExpressInterest(proposalId) {
    const proposal = DATA.proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    Components.showModal(`
      <div class="modal-header">
        <span class="modal-title">Express Interest</span>
        <button class="modal-close" onclick="Components.closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:var(--sp-4);margin-bottom:var(--sp-5)">
          <div style="width:52px;height:52px;background:var(--saffron-pale);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;font-size:26px">${proposal.categoryEmoji}</div>
          <div>
            <div style="font-size:var(--text-lg);font-weight:800;color:var(--navy)">${proposal.businessName}</div>
            <div style="font-size:var(--text-sm);color:var(--muted)">${proposal.vendor} · ${proposal.city}</div>
          </div>
        </div>
        <div style="background:var(--off-white);border-radius:var(--r-lg);padding:var(--sp-4);margin-bottom:var(--sp-5)">
          <div style="font-size:var(--text-xs);font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:var(--sp-3)">What you're expressing interest in</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3)">
            ${[
              ['Capital Required', Components.formatRupees(proposal.capitalRequired)],
              ['Est. Monthly Profit', Components.formatRupees(proposal.monthlyProfit)],
              ['Break-even', proposal.breakEvenMonths + ' months'],
              ['Trust Score', proposal.trustScore + '/100'],
            ].map(([l,v]) => `
              <div>
                <div style="font-size:var(--text-xs);color:var(--muted)">${l}</div>
                <div style="font-size:var(--text-sm);font-weight:700;color:var(--charcoal)">${v}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="disclaimer" style="margin-bottom:var(--sp-4)">
          <strong>This is not a financial commitment.</strong> Expressing interest notifies the vendor and allows them to connect with you. No money transfers, investments, or obligations are created by this action. StallUp is a discovery and matching platform only.
        </div>
        <div class="form-group">
          <label class="form-label">Add a note for the vendor (optional)</label>
          <textarea class="form-textarea" id="interest-note" rows="3" placeholder="Tell the vendor why you're interested, what questions you have, or how you'd like to connect..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Components.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="FunderPage.confirmInterest('${proposalId}')">
          ✓ Confirm Interest
        </button>
      </div>
    `);
  },

  confirmInterest(proposalId) {
    State.expressInterest(proposalId);
    Components.closeModal();
    Components.toast('success', 'Interest expressed!', 'The vendor has been notified. They may reach out to you directly.');
    // Re-render the grid to show updated state
    const main = document.getElementById('funder-main');
    if (main) {
      main.innerHTML = this.renderBrowse();
    }
  },

  renderMatches() {
    const prefs = DATA.funderPreferences;
    const matches = [
      {
        proposalId: 'p1',
        score: 94,
        scoreLevel: 'high',
        why: `Strong match: ₹80K fits your ₹50K–₹1L budget · Momos & Dumplings aligns with your fast-food preference · Indore matches your city interest · 87/100 trust score`,
      },
      {
        proposalId: 'p2',
        score: 91,
        scoreLevel: 'high',
        why: `Strong match: ₹60K within your budget range · Chaat & Street Snacks is your preferred category · Indore · Established business with 92 trust score`,
      },
      {
        proposalId: 'p4',
        score: 88,
        scoreLevel: 'high',
        why: `Strong match: ₹35K well within budget · Breakfast Specials matches preferences · 12-year legacy business with highest trust score (95)`,
      },
      {
        proposalId: 'p6',
        score: 72,
        scoreLevel: 'medium',
        why: `Moderate match: ₹55K fits budget · Beverages not in your top categories, but healthy-food trend aligns · Good 83 trust score`,
      },
      {
        proposalId: 'p3',
        score: 68,
        scoreLevel: 'medium',
        why: `Moderate match: ₹45K fits budget · South Indian food is outside your stated preferences but growing demand in Indore · Decent 79 trust score`,
      },
    ];

    return `
      <div>
        <div class="dashboard-title">AI Matches for You</div>
        <div class="dashboard-sub">Personalised recommendations based on your budget, preferences, and city</div>

        <div class="card" style="margin-bottom:var(--sp-6);border-left:4px solid var(--saffron)">
          <div class="card-body" style="display:flex;gap:var(--sp-4);align-items:flex-start">
            <div style="font-size:32px">✨</div>
            <div>
              <div style="font-size:var(--text-base);font-weight:700;color:var(--navy);margin-bottom:4px">Your Matching Criteria</div>
              <div style="font-size:var(--text-sm);color:var(--muted)">
                Budget: <strong style="color:var(--charcoal)">₹50K – ₹1L</strong> ·
                Categories: <strong style="color:var(--charcoal)">Fast food, Chaat, Breakfast</strong> ·
                City: <strong style="color:var(--charcoal)">Indore</strong>
              </div>
              <div style="margin-top:8px;font-size:var(--text-xs);color:var(--muted)">Match scores are based on budget fit, category alignment, location, business stage, and trust score.</div>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--sp-4)">
          ${matches.map((m, i) => {
            const p = DATA.proposals.find(x => x.id === m.proposalId);
            if (!p) return '';
            return `
              <div class="match-card" onclick="Router.navigate('business-detail', '${p.id}')">
                <div class="match-score-ring ${m.scoreLevel}">${m.score}%</div>
                <div class="match-body">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                    <div class="match-title">${p.categoryEmoji} ${p.businessName} · ${p.city}</div>
                    <div style="display:flex;gap:6px;align-items:center">
                      <span class="badge ${p.verificationStatus === 'verified' ? 'badge-green' : 'badge-amber'}">${p.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}</span>
                      <span class="badge badge-gray">${Components.formatRupees(p.capitalRequired)}</span>
                    </div>
                  </div>
                  <div class="match-why">${m.why}</div>
                  <div style="margin-top:var(--sp-3);display:flex;gap:var(--sp-3);align-items:center">
                    ${State.expressedInterests.has(p.id)
                      ? `<span class="badge badge-green badge-dot">Interest Expressed</span>`
                      : `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); FunderPage.handleExpressInterest('${p.id}')">Express Interest</button>`
                    }
                    <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); Components.toggleSaveProposal('${p.id}', this)">
                      ${State.savedOpportunities.has(p.id) ? '🔖 Saved' : '☆ Save'}
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderSaved() {
    const saved = DATA.proposals.filter(p => State.savedOpportunities.has(p.id));
    return `
      <div>
        <div class="dashboard-title">Saved Opportunities</div>
        <div class="dashboard-sub">${saved.length} businesses saved for later</div>
        ${saved.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">🔖</div>
            <div class="empty-state-title">No saved opportunities yet</div>
            <div class="empty-state-desc">Browse businesses and click the Save button to keep track of your favourites.</div>
            <button class="btn btn-primary" onclick="FunderPage.switchSection('browse')">Browse Businesses</button>
          </div>
        ` : `
          <div class="browse-grid">
            ${saved.map(p => Components.renderBizCard(p)).join('')}
          </div>
        `}
      </div>
    `;
  },

  renderProfile() {
    const user = State.currentUser;
    return `
      <div>
        <div class="dashboard-title">My Profile</div>
        <div class="dashboard-sub">Your funder account details</div>
        <div class="card" style="max-width:600px">
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:var(--sp-5);margin-bottom:var(--sp-6)">
              <div class="nav-avatar" style="width:64px;height:64px;font-size:22px;font-weight:800;">${user.initials}</div>
              <div>
                <div style="font-size:var(--text-2xl);font-weight:800;color:var(--navy)">${user.name}</div>
                <div style="color:var(--muted)">${user.email}</div>
                <div style="margin-top:var(--sp-2)"><span class="badge badge-saffron">Funder</span></div>
              </div>
            </div>
            <div class="divider"></div>
            ${[
              ['City', user.city],
              ['Member Since', user.joined],
              ['Budget Range', '₹50,000 – ₹1,00,000'],
              ['Interests Expressed', [...State.expressedInterests].length],
              ['Opportunities Saved', [...State.savedOpportunities].length],
            ].map(([l,v]) => `
              <div style="display:flex;justify-content:space-between;padding:var(--sp-3) 0;border-bottom:1px solid var(--border-light)">
                <span style="font-size:var(--text-sm);color:var(--muted)">${l}</span>
                <span style="font-size:var(--text-sm);font-weight:600;color:var(--charcoal)">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
};

// Alias for routing
const Pages = { funder: FunderPage };
