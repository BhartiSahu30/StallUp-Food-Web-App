/* ============================================================
   StallUp — Admin Dashboard
   ============================================================ */

const AdminPage = {
  _section: 'overview',

  render(section) {
    if (section) this._section = section;
    return `
      <div class="dashboard-layout">
        ${this.renderSidebar()}
        <div class="dashboard-content page-enter" id="admin-main">
          ${this.renderSection()}
        </div>
      </div>
    `;
  },

  renderSidebar() {
    const links = [
      { key: 'overview', icon: '📊', label: 'Platform Overview' },
      { key: 'verify', icon: '✅', label: 'Verifications' },
      { key: 'proposals', icon: '📋', label: 'Proposals' },
      { key: 'flagged', icon: '🚩', label: 'Flagged Reports' },
    ];
    return `
      <aside class="sidebar">
        <div class="sidebar-section-label">Admin</div>
        ${links.map(l => `
          <button class="sidebar-link ${this._section === l.key ? 'active' : ''}"
            onclick="AdminPage.switchSection('${l.key}')">
            <span class="sidebar-link-icon">${l.icon}</span>
            ${l.label}
            ${l.key === 'verify' ? `<span style="margin-left:auto;background:var(--amber);color:white;border-radius:var(--r-full);padding:1px 7px;font-size:10px;font-weight:700">${DATA.verificationQueue.length}</span>` : ''}
            ${l.key === 'flagged' ? `<span style="margin-left:auto;background:var(--red);color:white;border-radius:var(--r-full);padding:1px 7px;font-size:10px;font-weight:700">2</span>` : ''}
          </button>
        `).join('')}
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
    const main = document.getElementById('admin-main');
    main.innerHTML = '';
    main.classList.add('page-enter');
    main.innerHTML = this.renderSection();
    document.querySelectorAll('.sidebar-link').forEach(el => {
      const map = { overview: 'platform overview', verify: 'verifications', proposals: 'proposals', flagged: 'flagged' };
      el.classList.toggle('active', el.textContent.trim().toLowerCase().includes(map[key] || ''));
    });
  },

  renderSection() {
    if (this._section === 'overview') return this.renderOverview();
    if (this._section === 'verify') return this.renderVerify();
    if (this._section === 'proposals') return this.renderProposals();
    if (this._section === 'flagged') return this.renderFlagged();
    return '';
  },

  renderOverview() {
    const m = DATA.platformMetrics;
    return `
      <div>
        <div class="dashboard-title">Platform Overview</div>
        <div class="dashboard-sub">Real-time metrics across the StallUp network</div>

        <div class="grid-4" style="margin-bottom:var(--sp-8)">
          ${[
            { label: 'Total Vendors', value: m.totalVendors, delta: '↑ 12 this month', color: 'var(--navy)', dir: 'up' },
            { label: 'Verified Vendors', value: m.verifiedVendors, delta: `${Math.round(m.verifiedVendors/m.totalVendors*100)}% verification rate`, color: 'var(--green)', dir: 'up' },
            { label: 'Pending Verifications', value: m.pendingVerifications, delta: 'Requires action', color: 'var(--amber)', dir: 'down' },
            { label: 'Active Proposals', value: m.activeProposals, delta: '↑ 8 this week', color: 'var(--saffron)', dir: 'up' },
          ].map(s => `
            <div class="stat-card">
              <div class="stat-label">${s.label}</div>
              <div class="stat-value" style="color:${s.color}">${s.value}</div>
              <div class="stat-delta ${s.dir}">${s.delta}</div>
            </div>
          `).join('')}
        </div>

        <div class="grid-2" style="margin-bottom:var(--sp-8)">
          <div class="card">
            <div class="card-header"><span class="card-title">Quick Actions</span></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:var(--sp-3)">
              <button class="btn btn-outline w-full" style="justify-content:flex-start;gap:var(--sp-3)" onclick="AdminPage.switchSection('verify')">
                ✅ Review ${m.pendingVerifications} Pending Verifications
              </button>
              <button class="btn btn-ghost w-full" style="justify-content:flex-start;gap:var(--sp-3)" onclick="AdminPage.switchSection('proposals')">
                📋 Browse All Proposals (${m.activeProposals})
              </button>
              <button class="btn btn-ghost w-full" style="justify-content:flex-start;gap:var(--sp-3)" onclick="AdminPage.switchSection('flagged')">
                🚩 Review Flagged Reports (2)
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><span class="card-title">Network Stats</span></div>
            <div class="card-body" style="padding:0">
              ${[
                ['Total Interests Expressed', m.totalInterestsExpressed],
                ['Cities Covered', m.citiesCovered],
                ['Total Capital Requested', Components.formatRupees(m.capitalRequested)],
                ['Flagged Reports', m.flaggedReports],
              ].map(([l,v]) => `
                <div style="display:flex;justify-content:space-between;padding:var(--sp-3) var(--sp-5);border-bottom:1px solid var(--border-light)">
                  <span style="font-size:var(--text-sm);color:var(--muted)">${l}</span>
                  <span style="font-size:var(--text-sm);font-weight:700;color:var(--charcoal)">${v}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Recent Activity</span>
          </div>
          <div class="card-body" style="padding:0">
            ${[
              { time: '2 hours ago', action: 'New vendor registration', detail: 'Sunita Devi — Sunita Bhajji Stall, Ujjain', type: 'info' },
              { time: '5 hours ago', action: 'Verification completed', detail: 'Riya Sharma — Momo Junction · All documents approved', type: 'success' },
              { time: '1 day ago', action: 'New proposal submitted', detail: 'Gurpreet Singh — Punjabi Dhaba Express · ₹1.2L requested', type: 'info' },
              { time: '2 days ago', action: 'Proposal interest milestone', detail: 'Sharma Ji Ka Poha reached 10 interests expressed', type: 'success' },
              { time: '3 days ago', action: 'Flag raised', detail: 'Anonymous report on RV Rolls & Wraps — Under review', type: 'warning' },
            ].map(item => `
              <div style="display:flex;align-items:flex-start;gap:var(--sp-4);padding:var(--sp-4) var(--sp-5);border-bottom:1px solid var(--border-light)">
                <div style="width:8px;height:8px;border-radius:50%;background:${item.type === 'success' ? 'var(--green)' : item.type === 'warning' ? 'var(--amber)' : 'var(--saffron)'};margin-top:6px;flex-shrink:0"></div>
                <div>
                  <div style="font-size:var(--text-sm);font-weight:600;color:var(--charcoal)">${item.action}</div>
                  <div style="font-size:var(--text-xs);color:var(--muted)">${item.detail}</div>
                </div>
                <div style="margin-left:auto;font-size:var(--text-xs);color:var(--muted-light);white-space:nowrap">${item.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderVerify() {
    return `
      <div>
        <div class="dashboard-title">Verification Queue</div>
        <div class="dashboard-sub">Review vendor documents and approve or reject verification requests</div>

        ${DATA.verificationQueue.map(v => {
          const action = State.verificationActions[v.id];
          return `
            <div class="card" style="margin-bottom:var(--sp-5)">
              <div class="card-header">
                <div>
                  <div style="font-weight:700;font-size:var(--text-md);color:var(--navy)">${v.businessName}</div>
                  <div style="font-size:var(--text-sm);color:var(--muted)">${v.vendorName} · ${v.city} · Submitted ${new Date(v.submittedDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</div>
                </div>
                ${action
                  ? `<span class="badge ${action === 'approved' ? 'badge-green' : 'badge-red'}">${action === 'approved' ? '✓ Approved' : '✕ Rejected'}</span>`
                  : `<span class="badge badge-amber badge-dot">Pending Review</span>`
                }
              </div>
              <div class="card-body">
                <div style="font-size:var(--text-sm);font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:var(--sp-3)">Document Checklist</div>
                <ul class="checklist">
                  ${v.documents.map(doc => {
                    const st = doc.status === 'uploaded' ? 'done' : doc.status === 'pending_review' ? 'pending' : 'missing';
                    const label = doc.status === 'uploaded' ? 'Uploaded' : doc.status === 'pending_review' ? 'Pending Review' : 'Missing';
                    return `
                      <li>
                        <div class="check-icon ${st}">${st === 'done' ? '✓' : st === 'pending' ? '⏳' : '✕'}</div>
                        <span style="flex:1;font-weight:500">${doc.name}</span>
                        <span class="badge ${st === 'done' ? 'badge-green' : st === 'pending' ? 'badge-amber' : 'badge-red'}">${label}</span>
                        ${doc.status === 'uploaded' || doc.status === 'pending_review' ? `
                          <button class="btn btn-ghost btn-sm" onclick="AdminPage.previewDoc('${doc.name}')">View</button>
                        ` : ''}
                      </li>
                    `;
                  }).join('')}
                </ul>
              </div>
              ${!action ? `
                <div class="card-footer" style="display:flex;gap:var(--sp-3);justify-content:flex-end">
                  <button class="btn btn-danger btn-sm" onclick="AdminPage.rejectVendor('${v.id}')">
                    ✕ Reject
                  </button>
                  <button class="btn btn-green btn-sm" onclick="AdminPage.approveVendor('${v.id}')">
                    ✓ Approve Verification
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  approveVendor(vId) {
    State.approveVendor(vId);
    Components.toast('success', 'Vendor approved!', 'The vendor has been verified and their profile is now live.');
    this.switchSection('verify');
  },

  rejectVendor(vId) {
    Components.showModal(`
      <div class="modal-header">
        <span class="modal-title">Reject Verification</span>
        <button class="modal-close" onclick="Components.closeModal()">×</button>
      </div>
      <div class="modal-body">
        <p style="color:var(--charcoal);margin-bottom:var(--sp-4)">Please provide a reason for rejection. This will be communicated to the vendor.</p>
        <div class="form-group">
          <label class="form-label">Reason for Rejection</label>
          <select class="form-select" id="reject-reason">
            <option>Incomplete documents — missing FSSAI license</option>
            <option>Incomplete documents — missing address proof</option>
            <option>Documents appear invalid or tampered</option>
            <option>Duplicate registration detected</option>
            <option>Other — please specify below</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Additional Notes (optional)</label>
          <textarea class="form-textarea" rows="3" placeholder="Any additional context..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Components.closeModal()">Cancel</button>
        <button class="btn btn-danger" onclick="AdminPage.confirmReject('${vId}')">Confirm Rejection</button>
      </div>
    `);
  },

  confirmReject(vId) {
    State.rejectVendor(vId);
    Components.closeModal();
    Components.toast('info', 'Verification rejected', 'The vendor has been notified with the reason.');
    this.switchSection('verify');
  },

  previewDoc(name) {
    Components.showModal(`
      <div class="modal-header">
        <span class="modal-title">Document Preview: ${name}</span>
        <button class="modal-close" onclick="Components.closeModal()">×</button>
      </div>
      <div class="modal-body" style="text-align:center;padding:var(--sp-10)">
        <div style="font-size:64px;margin-bottom:var(--sp-4)">📄</div>
        <div style="font-size:var(--text-lg);font-weight:700;color:var(--navy);margin-bottom:var(--sp-2)">${name}</div>
        <div style="color:var(--muted);font-size:var(--text-sm)">Document preview is simulated in this prototype. In production, the document would be displayed here securely.</div>
        <div class="badge badge-green" style="margin:var(--sp-4) auto;display:inline-flex">✓ File verified — no tampering detected</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Components.closeModal()">Close</button>
      </div>
    `);
  },

  renderProposals() {
    return `
      <div>
        <div class="dashboard-title">All Proposals</div>
        <div class="dashboard-sub">Review and manage all submitted business proposals</div>

        <div class="card">
          <div style="overflow-x:auto">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Vendor</th>
                  <th>City</th>
                  <th>Capital Req.</th>
                  <th>Stage</th>
                  <th>Verification</th>
                  <th>Trust</th>
                  <th>Interests</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${DATA.proposals.map(p => `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:var(--sp-3)">
                        <span style="font-size:20px">${p.categoryEmoji}</span>
                        <div>
                          <div style="font-weight:700;color:var(--navy)">${p.businessName}</div>
                          <div style="font-size:var(--text-xs);color:var(--muted)">${p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>${p.vendor}</td>
                    <td>${p.neighborhood}, ${p.city}</td>
                    <td style="font-weight:700">${Components.formatRupees(p.capitalRequired)}</td>
                    <td><span class="badge ${p.stage === 'Established' ? 'badge-green' : p.stage === 'Expansion' ? 'badge-saffron' : 'badge-amber'}">${p.stage}</span></td>
                    <td><span class="verify-badge ${p.verificationStatus}">${p.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}</span></td>
                    <td>
                      <div style="display:flex;align-items:center;gap:var(--sp-2)">
                        <div style="width:36px;height:6px;background:var(--border-light);border-radius:var(--r-full);overflow:hidden">
                          <div style="height:100%;width:${p.trustScore}%;background:${p.trustScore >= 80 ? 'var(--green)' : p.trustScore >= 60 ? 'var(--amber)' : 'var(--red)'};border-radius:var(--r-full)"></div>
                        </div>
                        <span style="font-size:var(--text-xs);font-weight:700">${p.trustScore}</span>
                      </div>
                    </td>
                    <td style="font-weight:700;color:var(--saffron)">${p.interests}</td>
                    <td>
                      <div style="display:flex;gap:var(--sp-2)">
                        <button class="btn btn-ghost btn-sm" onclick="Router.navigate('business-detail', '${p.id}')">View</button>
                        ${p.verificationStatus !== 'verified' ? `<button class="btn btn-green btn-sm" onclick="AdminPage.approveProposal('${p.id}')">Verify</button>` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  approveProposal(pId) {
    const p = DATA.proposals.find(x => x.id === pId);
    if (p) {
      p.verificationStatus = 'verified';
      Components.toast('success', 'Proposal verified!', `${p.businessName} is now marked as verified.`);
      this.switchSection('proposals');
    }
  },

  renderFlagged() {
    return `
      <div>
        <div class="dashboard-title">Flagged Reports</div>
        <div class="dashboard-sub">Review and resolve flagged content reports</div>

        ${[
          {
            id: 'f1',
            business: 'RV Rolls & Wraps',
            reporter: 'Anonymous',
            reason: 'Suspected duplicate profile — similar business already listed under different name',
            date: '2024-11-19',
            severity: 'medium',
          },
          {
            id: 'f2',
            business: 'Punjabi Dhaba Express',
            reporter: 'Anonymous',
            reason: 'Document photo appears to be from an online template, not an original document',
            date: '2024-11-21',
            severity: 'high',
          },
        ].map(f => `
          <div class="card" style="margin-bottom:var(--sp-4);border-left:4px solid ${f.severity === 'high' ? 'var(--red)' : 'var(--amber)'}">
            <div class="card-body">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--sp-3)">
                <div>
                  <div style="font-weight:700;font-size:var(--text-md);color:var(--navy)">${f.business}</div>
                  <div style="font-size:var(--text-xs);color:var(--muted)">Reported by ${f.reporter} · ${new Date(f.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                </div>
                <span class="badge ${f.severity === 'high' ? 'badge-red' : 'badge-amber'}">${f.severity === 'high' ? 'High Severity' : 'Medium'}</span>
              </div>
              <div style="background:var(--off-white);border-radius:var(--r-md);padding:var(--sp-3) var(--sp-4);font-size:var(--text-sm);color:var(--charcoal);margin-bottom:var(--sp-4)">
                "${f.reason}"
              </div>
              <div style="display:flex;gap:var(--sp-3)">
                <button class="btn btn-ghost btn-sm" onclick="Components.toast('info','Report dismissed','The flag has been dismissed and archived.')">Dismiss</button>
                <button class="btn btn-danger btn-sm" onclick="Components.toast('success','Action taken','Business has been suspended pending review.')">Suspend Business</button>
                <button class="btn btn-outline btn-sm" onclick="Components.toast('info','Under investigation','Flag marked for further investigation.')">Investigate</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },
};
