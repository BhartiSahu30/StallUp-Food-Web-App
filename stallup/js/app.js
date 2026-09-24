/* ============================================================
   StallUp — Main App Controller
   ============================================================ */

const App = {
  render() {
    const page = State.currentPage;
    const data = State.currentPageData;
    const container = document.getElementById('page-container');

    // Update navigation
    Components.renderNav();

    // Determine which page to render
    let html = '';

    switch (page) {
      case 'landing':
        html = LandingPage.render();
        break;

      case 'auth':
        html = AuthPage.render(data);
        break;

      case 'vendor-dashboard':
        if (!State.currentUser || State.currentUser.role !== 'vendor') {
          Router.navigate('auth', 'vendor'); return;
        }
        VendorPage._section = 'overview';
        html = VendorPage.render('overview');
        break;

      case 'vendor-proposal':
        if (!State.currentUser || State.currentUser.role !== 'vendor') {
          Router.navigate('auth', 'vendor'); return;
        }
        VendorPage._section = 'proposal';
        html = VendorPage.render('proposal');
        break;

      case 'funder-browse':
        if (!State.currentUser) { Router.navigate('auth', 'funder'); return; }
        FunderPage._section = 'browse';
        html = FunderPage.render('browse');
        break;

      case 'funder-matches':
        if (!State.currentUser) { Router.navigate('auth', 'funder'); return; }
        FunderPage._section = 'matches';
        html = FunderPage.render('matches');
        break;

      case 'funder-saved':
        if (!State.currentUser) { Router.navigate('auth', 'funder'); return; }
        FunderPage._section = 'saved';
        html = FunderPage.render('saved');
        break;

      case 'admin-overview':
        if (!State.currentUser || State.currentUser.role !== 'admin') {
          Router.navigate('auth', 'admin'); return;
        }
        AdminPage._section = 'overview';
        html = AdminPage.render('overview');
        break;

      case 'admin-verify':
        if (!State.currentUser || State.currentUser.role !== 'admin') {
          Router.navigate('auth', 'admin'); return;
        }
        AdminPage._section = 'verify';
        html = AdminPage.render('verify');
        break;

      case 'admin-proposals':
        if (!State.currentUser || State.currentUser.role !== 'admin') {
          Router.navigate('auth', 'admin'); return;
        }
        AdminPage._section = 'proposals';
        html = AdminPage.render('proposals');
        break;

      case 'business-detail':
        html = DetailPage.render(data);
        break;

      case 'map':
        MapPage._selectedPin = null;
        html = MapPage.render();
        break;

      default:
        html = LandingPage.render();
    }

    container.innerHTML = html;

    // Post-render hooks
    this.postRender(page, data);
  },

  postRender(page, data) {
    // Initialize charts after DOM is ready
    if (page === 'vendor-dashboard') {
      setTimeout(() => VendorPage.initCharts(), 100);
    }
    if (page === 'business-detail' && data) {
      setTimeout(() => DetailPage.initCharts(data), 100);
    }
    if (page === 'funder-browse') {
      setTimeout(() => FunderPage.initSearchHandlers(), 50);
    }

    // Handle nav active state for sub-pages
    if (page === 'vendor-proposal') {
      VendorPage._section = 'proposal';
    }
  },
};

// ── Boot ─────────────────────────────────────────────────────
(function init() {
  // Restore state from session
  State.restore();

  // Wire nav logo to always go home
  document.getElementById('main-nav').addEventListener('click', (e) => {
    if (e.target.closest('.nav-logo')) Router.navigate('landing');
  });

  // Handle landing page - don't need auth
  const startPage = State.currentUser
    ? ({ vendor: 'vendor-dashboard', funder: 'funder-browse', admin: 'admin-overview' }[State.currentUser.role] || 'landing')
    : 'landing';

  Router.navigate(startPage);
})();
