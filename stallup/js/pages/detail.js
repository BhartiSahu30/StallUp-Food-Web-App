/* ============================================================
   StallUp — Business Detail Page
   ============================================================ */

const DetailPage = {
  _chartInstance: null,

  render(proposalId) {
    const proposal = DATA.proposals.find(p => p.id === proposalId);
    if (!proposal) {
      return `
        <div class="container section text-center">
          <div style="font-size:64px;margin-bottom:var(--sp-4)">🔍</div>
          <div style="font-size:var(--text-2xl);font-weight:700;color:var(--navy)">Business not found</div>
          <button class="btn btn-primary mt-6" onclick="history.back()">Go Back</button>
        </div>
      `;
    }

    const ve = proposal.monthlyExpenses;
    const totalExpenses = Object.values(ve).reduce((a, b) => a + b, 0);
    const hasInterest = State.expressedInterests.has(proposal.id);
    const user = State.currentUser;

    return `
      <!-- Detail Hero -->
      <div class="detail-hero">
        <div class="container">
          <div class="detail-breadcrumb">
            <a href="#" onclick="history.back()">← Back</a>
            <span>/</span>
            <span>${proposal.category}</span>
            <span>/</span>
            <span>${proposal.businessName}</span>
          </div>
          <div class="detail-header">
            <div class="detail-emoji-box">${proposal.categoryEmoji}</div>
            <div>
              <div style="display:flex;align-items:center;gap:var(--sp-3);flex-wrap:wrap;margin-bottom:var(--sp-2)">
                <h1 class="detail-title">${proposal.businessName}</h1>
                ${proposal.verificationStatus === 'verified'
                  ? `<span class="verify-badge verified" style="font-size:13px">✓ Verified</span>`
                  : `<span class="verify-badge pending">⏳ Pending Verification</span>`
                }
              </div>
              <div class="detail-meta">
                <span class="detail-meta-item">👤 ${proposal.vendor}</span>
                <span class="detail-meta-item">📍 ${proposal.neighborhood}, ${proposal.city}</span>
                <span class="detail-meta-item">🍴 ${proposal.category}</span>
                <span class="detail-meta-item">📅 ${proposal.experience} years experience</span>
                <span class="detail-meta-item">🏷 ${proposal.stage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Body -->
      <div class="detail-body">
        <div class="container">
          ${hasInterest ? `
            <div class="interest-banner">
              <span class="interest-banner-icon">✓</span>
              <span class="interest-banner-text">You have expressed interest in this business. The vendor has been notified.</span>
            </div>
          ` : ''}

          <div class="detail-grid">
            <!-- Main Content -->
            <div>
              <!-- Vendor Story -->
              <div class="card" style="margin-bottom:var(--sp-6)">
                <div class="card-body">
                  <div class="detail-section-title">Vendor Story</div>
                  <p style="color:var(--charcoal-mid);line-height:1.8;font-size:var(--text-base)">${proposal.description}</p>
                </div>
              </div>

              <!-- Business Metrics -->
              <div class="card" style="margin-bottom:var(--sp-6)">
                <div class="card-body">
                  <div class="detail-section-title">Business Metrics</div>
                  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp-5)">
                    ${[
                      { label: 'Daily Customers', value: `${proposal.dailyCustomers} avg`, icon: '👥' },
                      { label: 'Avg Order Value', value: Components.formatRupeesExact(proposal.avgOrderValue), icon: '🧾' },
                      { label: 'Daily Revenue', value: Components.formatRupees(proposal.dailyCustomers * proposal.avgOrderValue), icon: '💰' },
                      { label: 'Monthly Revenue', value: Components.formatRupeesExact(proposal.monthlyRevenue), icon: '📈', highlight: 'green' },
                      { label: 'Monthly Expenses', value: Components.formatRupeesExact(totalExpenses), icon: '📉', highlight: 'red' },
                      { label: 'Monthly Profit', value: Components.formatRupeesExact(proposal.monthlyProfit), icon: '🏆', highlight: 'saffron' },
                    ].map(m => `
                      <div style="background:var(--off-white);border-radius:var(--r-lg);padding:var(--sp-4)">
                        <div style="font-size:18px;margin-bottom:var(--sp-2)">${m.icon}</div>
                        <div style="font-size:var(--text-xs);color:var(--muted);margin-bottom:4px">${m.label}</div>
                        <div style="font-size:var(--text-lg);font-weight:800;color:${m.highlight ? `var(--${m.highlight})` : 'var(--navy)'}">${m.value}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Viability Chart -->
              <div class="card" style="margin-bottom:var(--sp-6)">
                <div class="card-body">
                  <div class="detail-section-title">Financial Viability</div>
                  <div class="chart-container">
                    <canvas id="viability-chart"></canvas>
                  </div>
                  <div class="disclaimer" style="margin-top:var(--sp-4)">
                    <strong>⚠️ Disclaimer:</strong> All figures above are estimates based on the vendor's submitted assumptions. They are <strong>not guaranteed returns</strong> and do not constitute financial advice. StallUp is a matching platform, not a financial services provider.
                  </div>
                </div>
              </div>

              <!-- Expense Breakdown -->
              <div class="card" style="margin-bottom:var(--sp-6)">
                <div class="card-body">
                  <div class="detail-section-title">Monthly Expense Breakdown</div>
                  <div style="display:flex;flex-direction:column;gap:var(--sp-3)">
                    ${Object.entries(ve).map(([k, v]) => {
                      const labels = { rawMaterial: 'Raw Materials', rent: 'Rent', staff: 'Staff', utilities: 'Utilities', marketing: 'Marketing', misc: 'Miscellaneous' };
                      const pct = Math.round((v / totalExpenses) * 100);
                      return `
                        <div>
                          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                            <span style="font-size:var(--text-sm);color:var(--charcoal)">${labels[k] || k}</span>
                            <span style="font-size:var(--text-sm);font-weight:700">${Components.formatRupeesExact(v)} <span style="color:var(--muted);font-weight:400">(${pct}%)</span></span>
                          </div>
                          <div class="progress-bar">
                            <div class="progress-fill" style="width:${pct}%;background:${pct > 50 ? 'var(--red)' : pct > 30 ? 'var(--amber)' : 'var(--green)'}"></div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>

              <!-- Verification -->
              <div class="card">
                <div class="card-header">
                  <span class="card-title">Verification & Trust</span>
                  ${Components.renderTrustScore(proposal.trustScore)}
                </div>
                <div class="card-body">
                  ${Components.renderVerifyChecklist(proposal.verifiedItems, proposal.pendingItems)}
                </div>
              </div>
            </div>

            <!-- Sticky Sidebar -->
            <div class="detail-sticky-card">
              <!-- Fund Amount Box -->
              <div class="fund-amount-box">
                <span class="fund-amount">${Components.formatRupeesExact(proposal.capitalRequired)}</span>
                <div class="fund-amount-label">Total capital requested</div>
                <div class="fund-use-list">
                  ${proposal.useOfFunds.map(u => `
                    <div class="fund-use-item">
                      <div class="fund-use-dot"></div>
                      <span style="flex:1">${u.item}</span>
                      <span style="font-weight:700;color:white">${Components.formatRupees(u.amount)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- CTA Card -->
              <div class="card" style="margin-bottom:var(--sp-4)">
                <div class="card-body">
                  <div style="font-size:var(--text-base);font-weight:700;color:var(--navy);margin-bottom:var(--sp-2)">Interested in this business?</div>
                  <div style="font-size:var(--text-sm);color:var(--muted);margin-bottom:var(--sp-4);line-height:1.6">
                    Expressing interest notifies the vendor and lets them connect with you. This is not a financial commitment.
                  </div>
                  ${!user ? `
                    <button class="btn btn-primary btn-block" onclick="Router.navigate('auth','funder')">Sign In to Express Interest</button>
                  ` : hasInterest ? `
                    <div class="interest-banner" style="margin-bottom:0">
                      <span class="interest-banner-icon">✓</span>
                      <span class="interest-banner-text">Interest expressed</span>
                    </div>
                  ` : user.role === 'funder' ? `
                    <button class="btn btn-primary btn-block btn-lg" onclick="FunderPage.handleExpressInterest('${proposal.id}')">
                      Express Interest
                    </button>
                  ` : `<div class="badge badge-gray" style="width:100%;justify-content:center;padding:10px">Log in as Funder to express interest</div>`}
                </div>
              </div>

              <!-- Break-even & Quick Stats -->
              <div class="card">
                <div class="card-body">
                  <div style="font-size:var(--text-sm);font-weight:700;color:var(--navy);margin-bottom:var(--sp-4)">Quick Summary</div>
                  ${[
                    ['Break-even Period', `${proposal.breakEvenMonths} months`],
                    ['Interests Received', `${proposal.interests} supporters`],
                    ['Submitted', new Date(proposal.dateSubmitted).toLocaleDateString('en-IN', { day:'numeric',month:'short',year:'numeric' })],
                    ['Business Stage', proposal.stage],
                  ].map(([l,v]) => `
                    <div style="display:flex;justify-content:space-between;padding:var(--sp-2) 0;border-bottom:1px solid var(--border-light)">
                      <span style="font-size:var(--text-sm);color:var(--muted)">${l}</span>
                      <span style="font-size:var(--text-sm);font-weight:700;color:var(--charcoal)">${v}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initCharts(proposalId) {
    const proposal = DATA.proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const ctx = document.getElementById('viability-chart');
    if (!ctx) return;

    const ve = proposal.monthlyExpenses;
    const totalExp = Object.values(ve).reduce((a, b) => a + b, 0);

    if (this._chartInstance) this._chartInstance.destroy();

    this._chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Monthly\nRevenue', 'Raw\nMaterials', 'Other\nCosts', 'Net\nProfit'],
        datasets: [{
          data: [proposal.monthlyRevenue, ve.rawMaterial, totalExp - ve.rawMaterial, proposal.monthlyProfit],
          backgroundColor: ['#1C7C4A', '#E8651A', '#D97706', '#28A05E'],
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ' ₹' + ctx.raw.toLocaleString('en-IN'),
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, family: "'Plus Jakarta Sans'" } }
          },
          y: {
            grid: { color: '#F0EFE8' },
            ticks: {
              font: { size: 10 },
              callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0) + 'K' : v),
            }
          }
        }
      }
    });
  },
};
