/* ============================================================
   StallUp — Landing Page
   ============================================================ */

const LandingPage = {
  render() {
    return `
      ${this.renderHero()}
      ${this.renderHowItWorks()}
      ${this.renderFeatured()}
      ${this.renderImpact()}
      ${this.renderTestimonials()}
      ${this.renderCTA()}
      ${this.renderFooter()}
    `;
  },

  renderHero() {
    return `
      <section class="hero">
        <div class="container">
          <div class="hero-inner">
            <div class="hero-content">
              <div class="hero-label">🇮🇳 India's Local Food Business Platform</div>
              <h1 class="hero-title">
                Turn food skills into<br>
                <span class="highlight">thriving local businesses.</span>
              </h1>
              <p class="hero-subtitle">
                StallUp connects verified street-food entrepreneurs seeking capital with people who believe in local, real businesses. Discover, verify, match, support, and track — all in one place.
              </p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-xl" onclick="Router.navigate('auth', 'vendor')">
                  I'm a Food Entrepreneur
                </button>
                <button class="btn btn-xl" style="background:rgba(255,255,255,0.12);color:white;border:1.5px solid rgba(255,255,255,0.25)"
                  onclick="Router.navigate('auth', 'funder')">
                  I Want to Support
                </button>
              </div>
              <div class="hero-stats">
                <div>
                  <span class="hero-stat-value">148</span>
                  <span class="hero-stat-label">Verified vendors</span>
                </div>
                <div>
                  <span class="hero-stat-value">₹86L</span>
                  <span class="hero-stat-label">Capital requested</span>
                </div>
                <div>
                  <span class="hero-stat-value">14</span>
                  <span class="hero-stat-label">Cities covered</span>
                </div>
              </div>
            </div>
            <div class="hero-visual">
              <div class="hero-card-preview primary-card">
                <div class="hero-card-row">
                  <div class="hero-vendor-info">
                    <div class="hero-vendor-emoji">🥟</div>
                    <div>
                      <div class="hero-vendor-name">Momo Junction</div>
                      <div class="hero-vendor-sub">Vijay Nagar, Indore · ✓ Verified</div>
                    </div>
                  </div>
                  <div class="hero-card-amount">
                    <div class="hero-card-amount-value">₹80K</div>
                    <div class="hero-card-amount-label">requested</div>
                  </div>
                </div>
                <div style="display:flex;gap:8px;margin-top:12px">
                  <span class="badge badge-green" style="font-size:10px">✓ Verified</span>
                  <span class="badge" style="background:rgba(255,255,255,0.1);color:#BFC8E4;font-size:10px">Momos & Dumplings</span>
                  <span class="badge" style="background:rgba(255,255,255,0.1);color:#BFC8E4;font-size:10px">4y exp</span>
                </div>
                <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
                  <div>
                    <div style="font-size:10px;color:#8CA0C8">Monthly Revenue</div>
                    <div style="font-size:13px;font-weight:700;color:#6EE7A8">₹2.88L</div>
                  </div>
                  <div>
                    <div style="font-size:10px;color:#8CA0C8">Profit</div>
                    <div style="font-size:13px;font-weight:700;color:white">₹35K</div>
                  </div>
                  <div>
                    <div style="font-size:10px;color:#8CA0C8">Break-even</div>
                    <div style="font-size:13px;font-weight:700;color:white">2.5 mo</div>
                  </div>
                </div>
                <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.1)">
                  <div style="font-size:10px;color:#8CA0C8;margin-bottom:6px">Interest from supporters</div>
                  <div style="display:flex;gap:6px">
                    ${['AM','RK','SP','NV'].map(i => `<div style="width:24px;height:24px;border-radius:50%;background:var(--saffron);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:white;border:2px solid rgba(255,255,255,0.2)">${i}</div>`).join('')}
                    <span style="font-size:11px;color:#8CA0C8;margin-left:2px;align-self:center">+4 supporters</span>
                  </div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="hero-card-preview" style="padding:14px">
                  <div style="font-size:20px;margin-bottom:6px">🍢</div>
                  <div style="font-size:12px;font-weight:700;color:white">Chhappan Chaat</div>
                  <div style="font-size:10px;color:#8CA0C8">Indore · ✓ Verified</div>
                  <div style="font-size:13px;font-weight:800;color:var(--saffron-light);margin-top:6px">₹60K</div>
                </div>
                <div class="hero-card-preview" style="padding:14px">
                  <div style="font-size:20px;margin-bottom:6px">🍽️</div>
                  <div style="font-size:12px;font-weight:700;color:white">Sharma Ji Ka Poha</div>
                  <div style="font-size:10px;color:#8CA0C8">Indore · ✓ Verified</div>
                  <div style="font-size:13px;font-weight:800;color:var(--saffron-light);margin-top:6px">₹35K</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderHowItWorks() {
    const steps = [
      { num: '1', icon: '🔍', title: 'Discover', desc: 'Browse verified food businesses with real financials and vendor stories.' },
      { num: '2', icon: '✅', title: 'Verify', desc: 'Our team checks documents, FSSAI licenses, and business details.' },
      { num: '3', icon: '🤝', title: 'Match', desc: 'AI-powered matching connects funders with businesses that fit their interests.' },
      { num: '4', icon: '💼', title: 'Support', desc: 'Express interest and work directly with verified vendors.' },
      { num: '5', icon: '📊', title: 'Track', desc: 'Monitor business health, milestones, and updates after support.' },
    ];
    return `
      <section class="section" style="background:var(--white)">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-label">How StallUp Works</span>
            <h2 class="section-title" style="max-width:480px;margin:0 auto var(--sp-3)">A transparent process built on trust</h2>
            <p class="section-subtitle" style="margin:0 auto">Every step is designed to protect both vendors and supporters — no black boxes, no surprises.</p>
          </div>
          <div class="how-steps">
            ${steps.map(s => `
              <div class="how-step">
                <div class="how-step-num">${s.num}</div>
                <div class="how-step-icon">${s.icon}</div>
                <div class="how-step-title">${s.title}</div>
                <div class="how-step-desc">${s.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  renderFeatured() {
    const featured = DATA.proposals.filter(p => p.verificationStatus === 'verified').slice(0, 3);
    return `
      <section class="section" style="background:var(--cream)">
        <div class="container">
          <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:var(--sp-8)">
            <div>
              <span class="section-label">Featured Businesses</span>
              <h2 class="section-title" style="margin-bottom:0">Verified and ready to grow</h2>
            </div>
            <button class="btn btn-outline" onclick="Router.navigate('auth', 'funder')">Browse All →</button>
          </div>
          <div class="featured-grid">
            ${featured.map(p => Components.renderBizCard(p)).join('')}
          </div>
        </div>
      </section>
    `;
  },

  renderImpact() {
    const stats = [
      { value: '148', label: 'Verified food businesses' },
      { value: '₹8.6Cr', label: 'Capital requested across India' },
      { value: '342', label: 'Expressions of interest' },
      { value: '14', label: 'Cities and growing' },
    ];
    return `
      <section class="impact-strip">
        <div class="container">
          <div class="grid-4">
            ${stats.map(s => `
              <div class="text-center">
                <span class="impact-number">${s.value}</span>
                <div class="impact-label">${s.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  renderTestimonials() {
    return `
      <section class="section" style="background:var(--white)">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-label">What People Say</span>
            <h2 class="section-title" style="margin:0 auto var(--sp-3)">Real stories from the community</h2>
          </div>
          <div class="grid-3">
            ${DATA.testimonials.map(t => `
              <div class="testimonial-card">
                <p class="testimonial-quote">${t.quote}</p>
                <div class="testimonial-author">
                  <div class="testimonial-avatar">${t.emoji}</div>
                  <div>
                    <div class="testimonial-name">${t.name}</div>
                    <div class="testimonial-role">${t.role}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  renderCTA() {
    return `
      <section class="cta-section">
        <div class="container text-center">
          <h2 class="cta-title">Ready to make an impact?</h2>
          <p class="cta-sub">Whether you run a stall or want to back one — StallUp is where it starts.</p>
          <div class="cta-actions" style="justify-content:center">
            <button class="btn btn-xl" style="background:var(--navy);color:white" onclick="Router.navigate('auth', 'vendor')">
              🍳 List My Business
            </button>
            <button class="btn btn-xl" style="background:rgba(255,255,255,0.2);color:white;border:1.5px solid rgba(255,255,255,0.4)" onclick="Router.navigate('auth', 'funder')">
              💼 Find Opportunities
            </button>
          </div>
        </div>
      </section>
    `;
  },

  renderFooter() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:32px;height:32px;background:var(--saffron);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">🥘</div>
                <span style="font-size:18px;font-weight:800;color:white">Stall<span style="color:var(--saffron-light)">Up</span></span>
              </div>
              <p class="footer-brand-desc">A discovery, verification, and matching platform for India's street-food entrepreneurs. Not a food delivery app.</p>
            </div>
            <div>
              <div class="footer-col-title">Platform</div>
              <span class="footer-link" onclick="Router.navigate('auth','vendor')">For Vendors</span>
              <span class="footer-link" onclick="Router.navigate('auth','funder')">For Funders</span>
              <span class="footer-link" onclick="Router.navigate('map')">Discover Map</span>
            </div>
            <div>
              <div class="footer-col-title">Company</div>
              <span class="footer-link">About Us</span>
              <span class="footer-link">Blog</span>
              <span class="footer-link">Press</span>
              <span class="footer-link">Careers</span>
            </div>
            <div>
              <div class="footer-col-title">Support</div>
              <span class="footer-link">Help Centre</span>
              <span class="footer-link">Privacy Policy</span>
              <span class="footer-link">Terms of Use</span>
              <span class="footer-link">Contact</span>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2024 StallUp Technologies Pvt. Ltd. · Registered in India</span>
            <span>Made with ❤️ for India's street food entrepreneurs</span>
          </div>
        </div>
      </footer>
    `;
  },
};
