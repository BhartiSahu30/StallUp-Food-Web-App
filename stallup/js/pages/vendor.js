/* ============================================================
   StallUp — Vendor Dashboard & Proposal Pages
   ============================================================ */

const VendorPage = {
  _section: 'overview',
  _proposalSubmitted: false,

  render(section) {
    if (section) this._section = section;
    const user = State.currentUser;
    const proposal = DATA.proposals.find(p => p.id === DATA.vendorProposal.proposalId);

    return `
      <div class="dashboard-layout">
        ${this.renderSidebar()}
        <div class="dashboard-content page-enter" id="vendor-main">
          ${this._section === 'overview' ? this.renderOverview(user, proposal) : ''}
          ${this._section === 'proposal' ? this.renderProposalForm(proposal) : ''}
          ${this._section === 'interests' ? this.renderInterests(proposal) : ''}
          ${this._section === 'profile' ? this.renderProfile(user) : ''}
        </div>
      </div>
    `;
  },

  renderSidebar() {
    const links = [
      { key: 'overview', icon: '📊', label: 'Dashboard' },
      { key: 'proposal', icon: '📝', label: 'My Proposal' },
      { key: 'interests', icon: '🤝', label: 'Interests Received' },
      { key: 'profile', icon: '👤', label: 'My Profile' },
    ];
    return `
      <aside class="sidebar">
        <div class="sidebar-section-label">Vendor</div>
        ${links.map(l => `
          <button class="sidebar-link ${this._section === l.key ? 'active' : ''}"
            onclick="VendorPage.switchSection('${l.key}')">
            <span class="sidebar-link-icon">${l.icon}</span>
            ${l.label}
          </button>
        `).join('')}
        <div class="sidebar-section-label" style="margin-top:auto">Account</div>
        <button class="sidebar-link" onclick="State.logout()">
          <span class="sidebar-link-icon">🚪</span> Sign Out
        </button>
      </aside>
    `;
  },

  switchSection(key) {
    this._section = key;
    const user = State.currentUser;
    const proposal = DATA.proposals.find(p => p.id === DATA.vendorProposal.proposalId);
    const main = document.getElementById('vendor-main');
    if (!main) return;
    main.innerHTML = '';
    main.classList.add('page-enter');

    if (key === 'overview') main.innerHTML = this.renderOverview(user, proposal);
    if (key === 'proposal') main.innerHTML = this.renderProposalForm(proposal);
    if (key === 'interests') main.innerHTML = this.renderInterests(proposal);
    if (key === 'profile') main.innerHTML = this.renderProfile(user);

    // Sync sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      const map = { overview: 'dashboard', proposal: 'my proposal', interests: 'interests received', profile: 'my profile' };
      el.classList.toggle('active', txt.includes(map[key] || '__none__'));
    });

    if (key === 'overview') setTimeout(() => this.initCharts(), 100);
  },

  renderOverview(user, proposal) {
    const ve = proposal.monthlyExpenses;
    const totalExpenses = Object.values(ve).reduce((a,b) => a+b, 0);

    return `
      <div>
        <div class="dashboard-title">Good morning, ${user.name.split(' ')[0]} 👋</div>
        <div class="dashboard-sub">Here's how your business is performing</div>

        <div class="grid-4" style="margin-bottom:var(--sp-8)">
          <div class="stat-card">
            <div class="stat-label">Capital Requested</div>
            <div class="stat-value">${Components.formatRupees(proposal.capitalRequired)}</div>
            <div class="stat-delta neutral">Pending support match</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Interests Received</div>
            <div class="stat-value" style="color:var(--saffron)">${proposal.interests}</div>
            <div class="stat-delta up">↑ 2 this week</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Est. Monthly Profit</div>
            <div class="stat-value" style="color:var(--green)">${Components.formatRupees(proposal.monthlyProfit)}</div>
            <div class="stat-delta up">↑ Based on your data</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Verification Status</div>
            <div class="stat-value" style="font-size:var(--text-xl)">
              <span class="verify-badge verified" style="font-size:14px">✓ Verified</span>
            </div>
            <div class="stat-delta neutral">All docs approved</div>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom:var(--sp-8)">
          <div class="card">
            <div class="card-header">
              <span class="card-title">Business Overview</span>
              <span class="badge badge-green">Active</span>
            </div>
            <div class="card-body">
              <div style="display:flex;align-items:center;gap:var(--sp-4);margin-bottom:var(--sp-5)">
                <div style="width:56px;height:56px;background:var(--saffron-pale);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;font-size:28px">${proposal.categoryEmoji}</div>
                <div>
                  <div style="font-size:var(--text-xl);font-weight:800;color:var(--navy)">${proposal.businessName}</div>
                  <div style="font-size:var(--text-sm);color:var(--muted)">${proposal.neighborhood}, ${proposal.city} · ${proposal.category}</div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4)">
                ${[
                  ['Daily Customers', proposal.dailyCustomers + ' avg'],
                  ['Avg Order Value', Components.formatRupeesExact(proposal.avgOrderValue)],
                  ['Experience', proposal.experience + ' years'],
                  ['Break-even', proposal.breakEvenMonths + ' months'],
                ].map(([l,v]) => `
                  <div>
                    <div style="font-size:var(--text-xs);color:var(--muted);margin-bottom:2px">${l}</div>
                    <div style="font-size:var(--text-base);font-weight:700;color:var(--charcoal)">${v}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline btn-sm" onclick="VendorPage.switchSection('proposal')">Edit Proposal</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">Financial Summary</span>
              <span class="text-xs text-muted">Monthly estimates</span>
            </div>
            <div class="card-body" style="padding:0">
              <div style="padding:var(--sp-4) var(--sp-5)">
                ${[
                  ['Revenue', proposal.monthlyRevenue, 'green'],
                  ['Total Expenses', totalExpenses, 'red'],
                  ['Net Profit', proposal.monthlyProfit, 'green'],
                ].map(([l,v,c]) => `
                  <div style="display:flex;justify-content:space-between;padding:var(--sp-3) 0;border-bottom:1px solid var(--border-light)">
                    <span style="font-size:var(--text-sm);color:var(--muted)">${l}</span>
                    <span style="font-size:var(--text-sm);font-weight:700;color:var(--${c})">${Components.formatRupeesExact(v)}</span>
                  </div>
                `).join('')}
              </div>
              <div style="padding:var(--sp-4) var(--sp-5)">
                <canvas id="vendor-chart" height="120"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Verification Checklist</span>
            ${Components.renderTrustScore(proposal.trustScore)}
          </div>
          <div class="card-body">
            ${Components.renderVerifyChecklist(proposal.verifiedItems, proposal.pendingItems)}
          </div>
        </div>
      </div>
    `;
  },

  renderProposalForm(proposal) {
    const ve = proposal.monthlyExpenses;
    return `
      <div>
        <div class="dashboard-title">My Business Proposal</div>
        <div class="dashboard-sub">Edit and update your business profile. Changes go through re-verification.</div>

        <div style="display:grid;grid-template-columns:1fr 300px;gap:var(--sp-8);align-items:flex-start">
          <div>
            <form id="proposal-form" onsubmit="VendorPage.saveProposal(event)">

              <div class="proposal-form-section">
                <div class="proposal-form-section-title">
                  <div class="proposal-form-section-num">1</div>
                  Business Information
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Business Name</label>
                    <input class="form-input" id="biz-name" value="${proposal.businessName}" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Food Category</label>
                    <select class="form-select" id="biz-category">
                      ${['Momos & Dumplings','Chaat & Street Snacks','South Indian','Breakfast Specials','North Indian / Dhaba','Beverages & Juices','Biryani & Rice','Chinese / Indo-Chinese','Sweets & Desserts','Other'].map(c =>
                        `<option ${c === proposal.category ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">City</label>
                    <input class="form-input" id="biz-city" value="${proposal.city}" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Neighborhood / Area</label>
                    <input class="form-input" id="biz-area" value="${proposal.neighborhood}" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Years of Experience</label>
                  <input class="form-input" type="number" id="biz-experience" value="${proposal.experience}" min="0" max="50" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Vendor Story</label>
                  <textarea class="form-textarea" id="biz-story" rows="4">${proposal.description}</textarea>
                  <div class="form-hint">Tell supporters about your journey, what makes your food special, and your vision.</div>
                </div>
              </div>

              <div class="proposal-form-section">
                <div class="proposal-form-section-title">
                  <div class="proposal-form-section-num">2</div>
                  Capital & Funding
                </div>
                <div class="form-group">
                  <label class="form-label">Capital Required</label>
                  <div class="input-prefix-wrapper">
                    <span class="input-prefix">₹</span>
                    <input class="form-input" type="number" id="capital-required" value="${proposal.capitalRequired}"
                      oninput="VendorPage.recalc()" min="10000" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Purpose of Funds</label>
                  <textarea class="form-textarea" id="capital-purpose">${proposal.fundingPurpose}</textarea>
                </div>
              </div>

              <div class="proposal-form-section">
                <div class="proposal-form-section-title">
                  <div class="proposal-form-section-num">3</div>
                  Business Metrics
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Avg Daily Customers</label>
                    <input class="form-input" type="number" id="daily-customers" value="${proposal.dailyCustomers}"
                      oninput="VendorPage.recalc()" min="1" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Avg Order Value (₹)</label>
                    <div class="input-prefix-wrapper">
                      <span class="input-prefix">₹</span>
                      <input class="form-input" type="number" id="avg-order" value="${proposal.avgOrderValue}"
                        oninput="VendorPage.recalc()" min="1" required />
                    </div>
                  </div>
                </div>
              </div>

              <div class="proposal-form-section">
                <div class="proposal-form-section-title">
                  <div class="proposal-form-section-num">4</div>
                  Monthly Costs
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Raw Material Cost</label>
                    <div class="input-prefix-wrapper">
                      <span class="input-prefix">₹</span>
                      <input class="form-input" type="number" id="cost-raw" value="${ve.rawMaterial}" oninput="VendorPage.recalc()" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Rent</label>
                    <div class="input-prefix-wrapper">
                      <span class="input-prefix">₹</span>
                      <input class="form-input" type="number" id="cost-rent" value="${ve.rent}" oninput="VendorPage.recalc()" />
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Staff Cost</label>
                    <div class="input-prefix-wrapper">
                      <span class="input-prefix">₹</span>
                      <input class="form-input" type="number" id="cost-staff" value="${ve.staff}" oninput="VendorPage.recalc()" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Utilities</label>
                    <div class="input-prefix-wrapper">
                      <span class="input-prefix">₹</span>
                      <input class="form-input" type="number" id="cost-utilities" value="${ve.utilities}" oninput="VendorPage.recalc()" />
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Marketing</label>
                    <div class="input-prefix-wrapper">
                      <span class="input-prefix">₹</span>
                      <input class="form-input" type="number" id="cost-marketing" value="${ve.marketing}" oninput="VendorPage.recalc()" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Miscellaneous</label>
                    <div class="input-prefix-wrapper">
                      <span class="input-prefix">₹</span>
                      <input class="form-input" type="number" id="cost-misc" value="${ve.misc}" oninput="VendorPage.recalc()" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="proposal-form-section">
                <div class="proposal-form-section-title">
                  <div class="proposal-form-section-num">5</div>
                  Documents & Photos
                </div>
                <div class="form-row">
                  <div class="upload-zone" onclick="VendorPage.mockUpload('photos')">
                    <div class="upload-zone-icon">📷</div>
                    <div class="upload-zone-text"><strong>Upload food photos</strong><br>JPG, PNG up to 5MB each</div>
                  </div>
                  <div class="upload-zone" onclick="VendorPage.mockUpload('docs')">
                    <div class="upload-zone-icon">📄</div>
                    <div class="upload-zone-text"><strong>Upload documents</strong><br>Aadhar, FSSAI, GST (PDF/JPG)</div>
                  </div>
                </div>
                <div id="upload-status" style="margin-top:var(--sp-3)"></div>
              </div>

              <div class="disclaimer">
                <strong>⚠️ Important Disclaimer:</strong> The financial figures shown below are estimates based solely on the data you have provided. They do not account for seasonal variations, market conditions, or unforeseen costs. These are <em>not guaranteed returns</em> and should not be treated as financial advice. StallUp does not facilitate real lending or investment.
              </div>

              <div style="margin-top:var(--sp-6);display:flex;gap:var(--sp-3)">
                <button type="submit" class="btn btn-primary btn-lg">Save & Submit Proposal</button>
                <button type="button" class="btn btn-ghost btn-lg" onclick="VendorPage.switchSection('overview')">Cancel</button>
              </div>
            </form>
          </div>

          <!-- Financial Preview Sidebar -->
          <div>
            <div class="fin-preview" id="fin-preview">
              ${this.renderFinPreview(proposal)}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderFinPreview(data) {
    const customers = data.dailyCustomers || 0;
    const orderVal = data.avgOrderValue || 0;
    const revenue = customers * orderVal * 30;

    const costs = data.monthlyExpenses || {};
    const totalCosts = Object.values(costs).reduce((a,b) => a + (parseInt(b)||0), 0);
    const profit = revenue - totalCosts;
    const capital = data.capitalRequired || 0;
    const breakEven = profit > 0 ? (capital / profit).toFixed(1) : '—';

    return `
      <div class="fin-preview-title">📊 Live Financial Preview</div>
      <div class="fin-row">
        <span class="fin-row-label">Daily Revenue</span>
        <span class="fin-row-value">${Components.formatRupees(customers * orderVal)}</span>
      </div>
      <div class="fin-row highlight">
        <span class="fin-row-label">Est. Monthly Revenue</span>
        <span class="fin-row-value">${Components.formatRupees(revenue)}</span>
      </div>
      <div class="fin-divider"></div>
      <div class="fin-row">
        <span class="fin-row-label">Total Monthly Costs</span>
        <span class="fin-row-value">${Components.formatRupees(totalCosts)}</span>
      </div>
      <div class="fin-divider"></div>
      <div class="fin-row ${profit >= 0 ? 'profit' : 'loss'} highlight">
        <span class="fin-row-label">Est. Monthly Profit</span>
        <span class="fin-row-value">${Components.formatRupees(Math.abs(profit))} ${profit < 0 ? '(loss)' : ''}</span>
      </div>
      <div class="fin-row">
        <span class="fin-row-label">Break-even Period</span>
        <span class="fin-row-value">${breakEven} months</span>
      </div>
      <div style="margin-top:var(--sp-4);padding:var(--sp-3);background:rgba(255,255,255,0.06);border-radius:var(--r-md);font-size:var(--text-xs);color:#8CA0C8;line-height:1.6">
        Figures update automatically as you type. These are projections only.
      </div>
    `;
  },

  recalc() {
    const get = (id) => parseInt(document.getElementById(id)?.value) || 0;
    const customers = get('daily-customers');
    const orderVal = get('avg-order');
    const revenue = customers * orderVal * 30;
    const costs = get('cost-raw') + get('cost-rent') + get('cost-staff') + get('cost-utilities') + get('cost-marketing') + get('cost-misc');
    const profit = revenue - costs;
    const capital = get('capital-required');
    const breakEven = profit > 0 ? (capital / profit).toFixed(1) : '—';

    const preview = document.getElementById('fin-preview');
    if (!preview) return;

    preview.innerHTML = `
      <div class="fin-preview-title">📊 Live Financial Preview</div>
      <div class="fin-row">
        <span class="fin-row-label">Daily Revenue</span>
        <span class="fin-row-value">${Components.formatRupees(customers * orderVal)}</span>
      </div>
      <div class="fin-row highlight">
        <span class="fin-row-label">Est. Monthly Revenue</span>
        <span class="fin-row-value">${Components.formatRupees(revenue)}</span>
      </div>
      <div class="fin-divider"></div>
      <div class="fin-row">
        <span class="fin-row-label">Total Monthly Costs</span>
        <span class="fin-row-value">${Components.formatRupees(costs)}</span>
      </div>
      <div class="fin-divider"></div>
      <div class="fin-row ${profit >= 0 ? 'profit' : 'loss'} highlight">
        <span class="fin-row-label">Est. Monthly Profit</span>
        <span class="fin-row-value">${Components.formatRupees(Math.abs(profit))} ${profit < 0 ? '(loss)' : ''}</span>
      </div>
      <div class="fin-row">
        <span class="fin-row-label">Break-even Period</span>
        <span class="fin-row-value">${breakEven} months</span>
      </div>
      <div style="margin-top:var(--sp-4);padding:var(--sp-3);background:rgba(255,255,255,0.06);border-radius:var(--r-md);font-size:var(--text-xs);color:#8CA0C8;line-height:1.6">
        Figures update automatically as you type. These are projections only.
      </div>
    `;
  },

  mockUpload(type) {
    const status = document.getElementById('upload-status');
    const msg = type === 'photos'
      ? '📷 3 photos uploaded successfully'
      : '📄 Documents uploaded: Aadhar, FSSAI License';
    if (status) {
      status.innerHTML = `<div class="badge badge-green" style="font-size:12px">${msg}</div>`;
    }
    Components.toast('success', 'Uploaded successfully', msg);
  },

  saveProposal(e) {
    e.preventDefault();
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Saving...';
    setTimeout(() => {
      Components.toast('success', 'Proposal updated!', 'Your changes have been submitted for review.');
      this.switchSection('overview');
    }, 1000);
  },

  renderInterests(proposal) {
    const mockFunders = [
      { name: 'Arjun Mehta', city: 'Mumbai', initials: 'AM', interest: 'Expressed interest on 18 Nov 2024', note: 'Looking forward to connecting further' },
      { name: 'Nandita Roy', city: 'Pune', initials: 'NR', interest: 'Expressed interest on 20 Nov 2024', note: 'Would like to discuss milestones' },
      { name: 'Sameer Khan', city: 'Delhi', initials: 'SK', interest: 'Expressed interest on 21 Nov 2024', note: 'Impressed by the trust score' },
      { name: 'Priya Iyer', city: 'Bangalore', initials: 'PI', interest: 'Expressed interest on 22 Nov 2024', note: '' },
    ];
    return `
      <div>
        <div class="dashboard-title">Interests Received</div>
        <div class="dashboard-sub">${proposal.interests} people have expressed interest in supporting ${proposal.businessName}</div>
        <div style="display:flex;flex-direction:column;gap:var(--sp-4)">
          ${mockFunders.map(f => `
            <div class="card">
              <div class="card-body" style="display:flex;align-items:center;gap:var(--sp-4)">
                <div class="nav-avatar" style="width:48px;height:48px;font-size:16px;font-weight:800;flex-shrink:0;">${f.initials}</div>
                <div style="flex:1">
                  <div style="font-weight:700;color:var(--navy)">${f.name}</div>
                  <div style="font-size:var(--text-xs);color:var(--muted)">${f.city} · ${f.interest}</div>
                  ${f.note ? `<div style="font-size:var(--text-sm);color:var(--charcoal-mid);margin-top:4px;font-style:italic">"${f.note}"</div>` : ''}
                </div>
                <span class="badge badge-green badge-dot">Interested</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderProfile(user) {
    return `
      <div>
        <div class="dashboard-title">My Profile</div>
        <div class="dashboard-sub">Your account information</div>
        <div class="card" style="max-width:600px">
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:var(--sp-5);margin-bottom:var(--sp-6)">
              <div class="nav-avatar" style="width:64px;height:64px;font-size:22px;font-weight:800;">${user.initials}</div>
              <div>
                <div style="font-size:var(--text-2xl);font-weight:800;color:var(--navy)">${user.name}</div>
                <div style="color:var(--muted)">${user.email}</div>
                <div style="margin-top:var(--sp-2)"><span class="badge badge-amber">Vendor</span></div>
              </div>
            </div>
            <div class="divider"></div>
            ${[
              ['City', user.city],
              ['Member Since', user.joined],
              ['Account Type', 'Food Entrepreneur'],
              ['Verification', 'ID Verified'],
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

  initCharts() {
    const ctx = document.getElementById('vendor-chart');
    if (!ctx) return;
    const proposal = DATA.proposals.find(p => p.id === DATA.vendorProposal.proposalId);
    const ve = proposal.monthlyExpenses;
    const totalExp = Object.values(ve).reduce((a,b) => a+b, 0);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Revenue', 'Expenses', 'Profit'],
        datasets: [{
          data: [proposal.monthlyRevenue, totalExp, proposal.monthlyProfit],
          backgroundColor: ['#1C7C4A', '#C0392B', '#E8651A'],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11, family: "'Plus Jakarta Sans'" } } },
          y: {
            grid: { color: '#F0EFE8' },
            ticks: {
              font: { size: 10 },
              callback: v => '₹' + (v/1000).toFixed(0) + 'K'
            }
          }
        }
      }
    });
  },
};
