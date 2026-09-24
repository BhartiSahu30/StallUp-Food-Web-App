/* ============================================================
   StallUp — Application State
   ============================================================ */

const State = {
  currentUser: null,
  currentPage: 'landing',
  currentPageData: null,
  expressedInterests: new Set(), // proposal IDs the funder expressed interest in
  savedOpportunities: new Set(), // proposal IDs saved
  verificationActions: {}, // admin actions: { vId: 'approved' | 'rejected' }
  proposalStatuses: {}, // admin actions on proposals
  vendorProposalDraft: null,
  activeSidebarSection: null,
  activeTab: null,
  browseFilters: {
    search: '',
    category: '',
    city: '',
    minFunds: '',
    maxFunds: '',
    stage: '',
  },

  // Setters
  setUser(user) {
    this.currentUser = user;
    this.save();
  },

  logout() {
    this.currentUser = null;
    this.expressedInterests = new Set();
    this.savedOpportunities = new Set();
    this.save();
    Router.navigate('landing');
  },

  expressInterest(proposalId) {
    this.expressedInterests.add(proposalId);
    // Increment interests count in proposal
    const proposal = DATA.proposals.find(p => p.id === proposalId);
    if (proposal) proposal.interests += 1;
    this.save();
  },

  toggleSave(proposalId) {
    if (this.savedOpportunities.has(proposalId)) {
      this.savedOpportunities.delete(proposalId);
    } else {
      this.savedOpportunities.add(proposalId);
    }
    this.save();
  },

  approveVendor(vId) {
    this.verificationActions[vId] = 'approved';
    this.save();
  },

  rejectVendor(vId) {
    this.verificationActions[vId] = 'rejected';
    this.save();
  },

  save() {
    try {
      const payload = {
        currentUser: this.currentUser,
        expressedInterests: [...this.expressedInterests],
        savedOpportunities: [...this.savedOpportunities],
        verificationActions: this.verificationActions,
      };
      sessionStorage.setItem('stallup_state', JSON.stringify(payload));
    } catch(e) {}
  },

  restore() {
    try {
      const raw = sessionStorage.getItem('stallup_state');
      if (!raw) return;
      const data = JSON.parse(raw);
      this.currentUser = data.currentUser || null;
      this.expressedInterests = new Set(data.expressedInterests || []);
      this.savedOpportunities = new Set(data.savedOpportunities || []);
      this.verificationActions = data.verificationActions || {};
    } catch(e) {}
  },
};

// ── Router ────────────────────────────────────────────────────
const Router = {
  navigate(page, data = null) {
    State.currentPage = page;
    State.currentPageData = data;
    App.render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  },
};
