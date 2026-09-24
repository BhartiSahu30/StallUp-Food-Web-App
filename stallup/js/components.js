/* ============================================================
   StallUp — Shared Component Builders
   ============================================================ */

const Components = {

  // ── Format helpers ──────────────────────────────────────
  formatRupees(n) {
    if (n >= 100000) return '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'K';
    return '₹' + n.toLocaleString('en-IN');
  },

  formatRupeesExact(n) {
    return '₹' + n.toLocaleString('en-IN');
  },

  // ── Toast ───────────────────────────────────────────────
  toast(type, title, msg) {
    const icons = { success: '✓', error: '✕', info: 'i', warning: '!' };
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `
      <div class="toast-icon">${icons[type] || 'i'}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
    `;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('removing');
      setTimeout(() => el.remove(), 250);
    }, 4000);
  },

  // ── Modal ───────────────────────────────────────────────
  showModal(html, id = 'modal-content') {
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `<div class="modal" id="${id}">${html}</div>`;
    overlay.classList.remove('hidden');
    overlay.onclick = (e) => { if (e.target === overlay) this.closeModal(); };
  },

  showModalLg(html, id = 'modal-content') {
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `<div class="modal modal-lg" id="${id}">${html}</div>`;
    overlay.classList.remove('hidden');
    overlay.onclick = (e) => { if (e.target === overlay) this.closeModal(); };
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  },

  // ── Nav ─────────────────────────────────────────────────
  renderNav() {
    const nav = document.getElementById('main-nav');
    const user = State.currentUser;

    if (!user) {
      // Show minimal public nav on landing/auth pages
      if (State.currentPage === 'landing' || State.currentPage === 'auth') {
        nav.classList.remove('hidden');
        nav.innerHTML = `
          <div class="container">
            <div class="nav-inner">
              <div class="nav-logo" onclick="Router.navigate('landing')">
                <div class="nav-logo-icon">🥘</div>
                <span class="nav-logo-text">Stall<span>Up</span></span>
              </div>
              <div class="nav-actions">
                <button class="btn btn-ghost btn-sm" onclick="Router.navigate('auth','vendor')">Sign In</button>
                <button class="btn btn-primary btn-sm" onclick="Router.navigate('auth','funder')">Get Started</button>
              </div>
            </div>
          </div>
        `;
      } else {
        nav.classList.add('hidden');
      }
      return;
    }

    nav.classList.remove('hidden');

    const roleLinks = {
      vendor: [
        { label: 'Dashboard', page: 'vendor-dashboard' },
        { label: 'My Proposal', page: 'vendor-proposal' },
        { label: 'Discover', page: 'map' },
      ],
      funder: [
        { label: 'Browse', page: 'funder-browse' },
        { label: 'AI Matches', page: 'funder-matches' },
        { label: 'Saved', page: 'funder-saved' },
        { label: 'Map', page: 'map' },
      ],
      admin: [
        { label: 'Overview', page: 'admin-overview' },
        { label: 'Verifications', page: 'admin-verify' },
        { label: 'Proposals', page: 'admin-proposals' },
      ],
    };

    const links = roleLinks[user.role] || [];
    const badgeClass = user.role;

    nav.innerHTML = `
      <div class="container">
        <div class="nav-inner">
          <div class="nav-logo" onclick="Router.navigate('landing')">
            <div class="nav-logo-icon">🥘</div>
            <span class="nav-logo-text">Stall<span>Up</span></span>
          </div>
          <div class="nav-links">
            ${links.map(l => `
              <button class="nav-link ${State.currentPage === l.page ? 'active' : ''}"
                onclick="Router.navigate('${l.page}')">${l.label}</button>
            `).join('')}
          </div>
          <div class="nav-actions">
            <span class="nav-role-badge ${badgeClass}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            <div class="nav-user" onclick="Components.showUserMenu()">
              <div class="nav-avatar">${user.initials}</div>
              <div class="nav-user-info">
                <div class="nav-user-name">${user.name.split(' ')[0]}</div>
                <div class="nav-user-role">${user.city}</div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="State.logout()">Sign out</button>
          </div>
        </div>
      </div>
    `;
  },

  showUserMenu() {
    const user = State.currentUser;
    Components.showModal(`
      <div class="modal-header">
        <span class="modal-title">Account</span>
        <button class="modal-close" onclick="Components.closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="flex items-center gap-4 mb-6">
          <div class="nav-avatar" style="width:52px;height:52px;font-size:18px;font-weight:800;background:var(--saffron);">${user.initials}</div>
          <div>
            <div style="font-weight:700;font-size:var(--text-lg);color:var(--navy)">${user.name}</div>
            <div style="color:var(--muted);font-size:var(--text-sm)">${user.email}</div>
            <div style="margin-top:4px"><span class="badge badge-saffron">${user.role}</span></div>
          </div>
        </div>
        <div class="divider"></div>
        <div style="color:var(--muted);font-size:var(--text-sm)">Member since ${user.joined} · ${user.city}</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Components.closeModal()">Close</button>
        <button class="btn btn-danger btn-sm" onclick="Components.closeModal(); State.logout();">Sign Out</button>
      </div>
    `);
  },

  // ── Business card (funder grid) ─────────────────────────
  renderBizCard(p) {
    const hasInterest = State.expressedInterests.has(p.id);
    const isSaved = State.savedOpportunities.has(p.id);
    const vBadge = p.verificationStatus === 'verified'
      ? `<span class="verify-badge verified">✓ Verified</span>`
      : `<span class="verify-badge pending">⏳ Pending</span>`;

    return `
      <div class="biz-card" onclick="Router.navigate('business-detail', '${p.id}')">
        <div class="biz-card-thumb" style="background:${this.categoryBg(p.category)}">
          <div class="biz-card-thumb-emoji">${p.categoryEmoji}</div>
          <div class="biz-card-thumb-overlay"></div>
          <div class="biz-card-thumb-badges">${vBadge}</div>
          <div class="biz-card-thumb-amount">
            <span class="amount-value">${this.formatRupees(p.capitalRequired)}</span>
            <span class="amount-label">capital required</span>
          </div>
        </div>
        <div class="biz-card-body">
          <div class="biz-card-title">${p.businessName}</div>
          <div class="biz-card-vendor">
            <span>👤</span> ${p.vendor} · ${p.neighborhood}, ${p.city}
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="badge badge-gray">${p.category}</span>
            <span class="badge badge-navy">${p.experience}y exp</span>
            <span class="badge ${p.stage === 'Established' ? 'badge-green' : p.stage === 'Expansion' ? 'badge-saffron' : 'badge-amber'}">${p.stage}</span>
          </div>
          <div class="biz-card-metrics">
            <div>
              <div class="biz-card-metric-label">Est. Monthly Revenue</div>
              <div class="biz-card-metric-value" style="color:var(--green)">${this.formatRupees(p.monthlyRevenue)}</div>
            </div>
            <div>
              <div class="biz-card-metric-label">Est. Monthly Profit</div>
              <div class="biz-card-metric-value">${this.formatRupees(p.monthlyProfit)}</div>
            </div>
            <div>
              <div class="biz-card-metric-label">Break-even</div>
              <div class="biz-card-metric-value">${p.breakEvenMonths} months</div>
            </div>
            <div>
              <div class="biz-card-metric-label">Interests</div>
              <div class="biz-card-metric-value">${p.interests} ${hasInterest ? '<span style="color:var(--green)">✓</span>' : ''}</div>
            </div>
          </div>
        </div>
        <div class="card-footer flex items-center justify-between">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); Components.toggleSaveProposal('${p.id}', this)">
            ${isSaved ? '🔖 Saved' : '☆ Save'}
          </button>
          ${hasInterest
            ? `<span class="badge badge-green badge-dot">Interest Expressed</span>`
            : `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); Pages.funder.handleExpressInterest('${p.id}')">Express Interest</button>`
          }
        </div>
      </div>
    `;
  },

  toggleSaveProposal(id, btn) {
    State.toggleSave(id);
    const isSaved = State.savedOpportunities.has(id);
    btn.textContent = isSaved ? '🔖 Saved' : '☆ Save';
    Components.toast(isSaved ? 'success' : 'info', isSaved ? 'Opportunity saved' : 'Removed from saved', '');
  },

  categoryBg(cat) {
    const map = {
      'Momos & Dumplings': '#FFF0E6',
      'Chaat & Street Snacks': '#FFF9E6',
      'South Indian': '#E6F0FF',
      'Breakfast Specials': '#E6FFEE',
      'North Indian / Dhaba': '#FFE6E6',
      'Beverages & Juices': '#E6F9FF',
    };
    return map[cat] || '#F5F4F0';
  },

  // ── Trust Score Ring ────────────────────────────────────
  renderTrustScore(score) {
    const r = 18;
    const circ = 2 * Math.PI * r;
    const fill = (score / 100) * circ;
    const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--red)';
    return `
      <div class="trust-score">
        <div class="trust-rings">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="${r}" fill="none" stroke="var(--border-light)" stroke-width="4"/>
            <circle cx="24" cy="24" r="${r}" fill="none" stroke="${color}" stroke-width="4"
              stroke-dasharray="${fill} ${circ}" stroke-linecap="round"/>
          </svg>
          <div class="trust-score-value">${score}</div>
        </div>
        <div>
          <div style="font-size:var(--text-xs);font-weight:700;color:var(--charcoal)">Trust Score</div>
          <div style="font-size:var(--text-xs);color:var(--muted)">${score >= 80 ? 'High confidence' : score >= 60 ? 'Moderate' : 'Needs review'}</div>
        </div>
      </div>
    `;
  },

  // ── Verification Checklist ──────────────────────────────
  renderVerifyChecklist(verified, pending) {
    const items = [
      ...verified.map(v => ({ name: v, status: 'done' })),
      ...pending.map(v => ({ name: v, status: 'pending' })),
    ];
    return `
      <ul class="checklist">
        ${items.map(item => `
          <li>
            <div class="check-icon ${item.status}">
              ${item.status === 'done' ? '✓' : item.status === 'pending' ? '⏳' : '✕'}
            </div>
            <span style="font-weight:${item.status === 'done' ? '500' : '400'};color:${item.status === 'done' ? 'var(--charcoal)' : 'var(--muted)'}">${item.name}</span>
          </li>
        `).join('')}
      </ul>
    `;
  },
};
