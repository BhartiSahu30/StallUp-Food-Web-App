/* ============================================================
   StallUp — Auth Page
   ============================================================ */

const AuthPage = {
  _tab: 'login',
  _role: null,
  _loading: false,

  render(hint) {
    if (hint) this._role = hint;
    return `
      <div class="auth-page">
        <div class="auth-left">
          <div style="margin-bottom:var(--sp-8);cursor:pointer" onclick="Router.navigate('landing')">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:36px;height:36px;background:var(--saffron);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px">🥘</div>
              <span style="font-size:20px;font-weight:800;color:var(--navy)">Stall<span style="color:var(--saffron)">Up</span></span>
            </div>
          </div>

          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-sub">Sign in to your account or create a new one</p>

          <div class="auth-tabs" id="auth-tabs">
            <div class="auth-tab ${this._tab === 'login' ? 'active' : ''}" onclick="AuthPage.switchTab('login')">Sign In</div>
            <div class="auth-tab ${this._tab === 'signup' ? 'active' : ''}" onclick="AuthPage.switchTab('signup')">Create Account</div>
          </div>

          <div id="auth-form-container">
            ${this._tab === 'login' ? this.renderLoginForm() : this.renderSignupForm()}
          </div>

          ${this.renderDemoCredentials()}
        </div>

        <div class="auth-right">
          <div style="position:relative;z-index:1;text-align:center;color:white;max-width:400px">
            <div style="font-size:64px;margin-bottom:var(--sp-5)">🥘</div>
            <h2 style="font-size:28px;font-weight:800;letter-spacing:-0.02em;margin-bottom:var(--sp-3)">
              India's food entrepreneurs deserve better tools.
            </h2>
            <p style="color:#BFC8E4;font-size:15px;line-height:1.7">
              StallUp brings transparency, verified profiles, and real financial data to connect passionate food vendors with people ready to support them.
            </p>
            <div style="margin-top:var(--sp-8);display:flex;gap:var(--sp-8);justify-content:center">
              <div>
                <div style="font-size:28px;font-weight:800;color:var(--saffron-light)">148</div>
                <div style="font-size:12px;color:#8CA0C8">Verified vendors</div>
              </div>
              <div>
                <div style="font-size:28px;font-weight:800;color:var(--saffron-light)">₹8.6Cr</div>
                <div style="font-size:12px;color:#8CA0C8">Capital requested</div>
              </div>
              <div>
                <div style="font-size:28px;font-weight:800;color:var(--saffron-light)">342</div>
                <div style="font-size:12px;color:#8CA0C8">Interests expressed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderLoginForm() {
    return `
      <form id="login-form" onsubmit="AuthPage.handleLogin(event)">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input class="form-input" type="email" id="login-email" placeholder="you@example.com"
            value="${this._role === 'vendor' ? 'vendor@stallup.in' : this._role === 'funder' ? 'funder@stallup.in' : this._role === 'admin' ? 'admin@stallup.in' : ''}"
            required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" id="login-password" placeholder="Enter your password" value="demo123" required />
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">
          Sign In
        </button>
        <div style="margin-top:var(--sp-4);text-align:center">
          <button type="button" class="btn btn-ghost btn-sm" onclick="Router.navigate('landing')">← Back to home</button>
        </div>
      </form>
    `;
  },

  renderSignupForm() {
    return `
      <form id="signup-form" onsubmit="AuthPage.handleSignup(event)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input class="form-input" type="text" id="signup-fname" placeholder="Priya" required />
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input class="form-input" type="text" id="signup-lname" placeholder="Sharma" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input class="form-input" type="email" id="signup-email" placeholder="you@example.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" id="signup-password" placeholder="Choose a strong password" required minlength="6" />
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <select class="form-select" id="signup-city">
            <option value="Indore">Indore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Pune">Pune</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">I am joining as</label>
          <div class="role-select-grid" id="role-grid">
            ${[
              { key: 'vendor', icon: '🍳', title: 'Food Entrepreneur', desc: 'I run or want to start a food business' },
              { key: 'funder', icon: '💼', title: 'Supporter / Funder', desc: 'I want to discover and support local food businesses' },
            ].map(r => `
              <div class="role-option ${(this._role === r.key) ? 'selected' : ''}" onclick="AuthPage.selectRole('${r.key}', this)">
                <div class="role-option-icon">${r.icon}</div>
                <div>
                  <div class="role-option-title">${r.title}</div>
                  <div class="role-option-desc">${r.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <input type="hidden" id="selected-role" value="${this._role || 'vendor'}" />
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg">Create Account</button>
        <div style="margin-top:var(--sp-4);text-align:center">
          <button type="button" class="btn btn-ghost btn-sm" onclick="Router.navigate('landing')">← Back to home</button>
        </div>
      </form>
    `;
  },

  renderDemoCredentials() {
    return `
      <div class="demo-credentials">
        <div class="demo-cred-title">🔑 Demo Credentials — click to autofill</div>
        ${DATA.users.map(u => `
          <div class="demo-cred-item" onclick="AuthPage.autofill('${u.email}', '${u.password}', '${u.role}')">
            <span class="demo-cred-role">${u.role}</span>
            <span class="demo-cred-email">${u.email}</span>
            <span class="demo-cred-enter">→ Use</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  switchTab(tab) {
    this._tab = tab;
    document.getElementById('auth-form-container').innerHTML =
      tab === 'login' ? this.renderLoginForm() : this.renderSignupForm();
    document.querySelectorAll('.auth-tab').forEach((el, i) => {
      el.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
    });
  },

  selectRole(role, el) {
    this._role = role;
    document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('selected-role').value = role;
  },

  autofill(email, password, role) {
    this._tab = 'login';
    this._role = role;
    document.getElementById('auth-form-container').innerHTML = this.renderLoginForm();
    document.querySelectorAll('.auth-tab').forEach((el, i) => {
      el.classList.toggle('active', i === 0);
    });
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Signing in...';

    setTimeout(() => {
      const user = DATA.users.find(u => u.email === email && u.password === password);
      if (user) {
        State.setUser(user);
        Components.toast('success', `Welcome back, ${user.name.split(' ')[0]}!`, 'You have been signed in successfully.');
        const dashMap = { vendor: 'vendor-dashboard', funder: 'funder-browse', admin: 'admin-overview' };
        Router.navigate(dashMap[user.role] || 'landing');
      } else {
        btn.disabled = false;
        btn.textContent = 'Sign In';
        Components.toast('error', 'Invalid credentials', 'Please check your email and password.');
        const emailField = document.getElementById('login-email');
        if (emailField) emailField.classList.add('error');
      }
    }, 800);
  },

  handleSignup(e) {
    e.preventDefault();
    const fname = document.getElementById('signup-fname').value.trim();
    const lname = document.getElementById('signup-lname').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const city = document.getElementById('signup-city').value;
    const role = document.getElementById('selected-role').value;

    const initials = (fname[0] + (lname[0] || '')).toUpperCase();
    const newUser = {
      id: 'u_new',
      name: `${fname} ${lname}`,
      email,
      password: 'demo123',
      role,
      city,
      initials,
      joined: 'November 2024',
    };

    // Simulate creation
    setTimeout(() => {
      State.setUser(newUser);
      Components.toast('success', 'Account created!', `Welcome to StallUp, ${fname}!`);
      const dashMap = { vendor: 'vendor-dashboard', funder: 'funder-browse', admin: 'admin-overview' };
      Router.navigate(dashMap[role] || 'landing');
    }, 700);
  },
};
