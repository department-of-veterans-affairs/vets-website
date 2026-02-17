import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const baseProps = {
  route: {
    path: 'introduction',
    pageList: [
      { path: '/introduction', title: 'Introduction' },
      { path: '/first-page', title: 'First Page' },
    ],
    formConfig,
  },
  userLoggedIn: false,
  userIdVerified: true,
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        loa: {
          current: 3,
          highest: 3,
        },
        verified: true,
        dob: '2000-01-01',
        claims: {
          appeals: false,
        },
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
    featureToggles: {},
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const renderWithStore = (ui, store = mockStore) =>
  render(<Provider store={store}>{ui}</Provider>);

describe('22-8794 <IntroductionPage> (RTL, store pattern like example)', () => {
  it('renders without crashing', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);
    expect(container).to.exist;
  });

  it('renders the form title (h1)', () => {
    const { getByRole } = renderWithStore(<IntroductionPage {...baseProps} />);
    expect(
      getByRole('heading', {
        level: 1,
        name: /Update your institution’s list of certifying officials/i,
      }),
    ).to.exist;
  });

  it('renders the designation paragraph', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);
    const firstP = container.querySelector('p');
    expect(firstP?.textContent).to.contain(
      'Designation of certifying official(s) (VA Form 22-8794)',
    );
  });

  it('renders the info va-alert with headline', () => {
    const { container, getByRole } = renderWithStore(
      <IntroductionPage {...baseProps} />,
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert?.getAttribute('status')).to.equal('info');

    expect(
      getByRole('heading', {
        level: 2,
        name: /For educational institutions and training facilities only/i,
      }),
    ).to.exist;
  });

  it('renders all section headers (4 h2s)', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);
    const h2s = container.querySelectorAll('h2');
    expect(h2s.length).to.equal(4);
  });

  it('renders process list with three items', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);
    expect(container.querySelectorAll('va-process-list').length).to.equal(1);
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
  });

  // Logged OUT → shows sign-in alert with no "start without signing in" link
  it('renders "Start the form" section with sign-in alert when logged out', () => {
    const { getByRole, container } = renderWithStore(
      <IntroductionPage {...baseProps} />,
    );

    // Header is present
    expect(
      getByRole('heading', {
        level: 2,
        name: /Start the form/i,
      }),
    ).to.exist;

    // Sign-in alert web component
    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;

    // Sign-in CTA is a <va-button> with its label in the "text" attribute
    const signInButton = container.querySelector(
      'va-alert-sign-in va-button[text="Sign in to start your form"]',
    );
    expect(signInButton).to.exist;

    // Because hideUnauthedStartLink is true when logged out, there should be
    // NO "Start your form without signing in" link
    const startWithoutLink = container.querySelector(
      'a.schemaform-start-button',
    );
    expect(startWithoutLink).to.not.exist;
  });

  // Logged IN → SIP renders start CTA (not the sign-in alert)
  it('renders SIP start CTA when logged in', () => {
    const loggedInStore = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        user: {
          ...mockStore.getState().user,
          login: { currentlyLoggedIn: true },
        },
      }),
    };

    const { getByRole, container } = render(
      <Provider store={loggedInStore}>
        <IntroductionPage {...baseProps} />
      </Provider>,
    );

    // "Start the form" header
    expect(
      getByRole('heading', {
        level: 2,
        name: /Start the form/i,
      }),
    ).to.exist;

    // No sign-in alert when logged in
    expect(container.querySelector('va-alert-sign-in')).to.not.exist;

    // Be flexible about how SIP renders the CTA:
    // - It may be a <va-button text="...">
    // - Or a native <button> / <a> with visible text
    const needle = 'Start your Designation of certifying official(s)';

    // 1) try <va-button text="...">
    let found =
      container.querySelector(`va-button[text="${needle}"]`) ||
      container.querySelector(`va-button[text*="Start your 85/15"]`);

    // 2) fall back to any element whose textContent matches (normalized)
    if (!found) {
      const all = Array.from(container.querySelectorAll('*'));
      found = all.find(el =>
        (el.textContent || '').replace(/\s+/g, ' ').trim().includes(needle),
      );
    }

    expect(found, 'SIP start CTA should be present when logged in').to.exist;
  });

  it('renders OmbInfo trigger element by id', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);
    expect(container.querySelector('#va-omb-info')).to.exist;
  });
});

describe('22-8794 <IntroductionPage> OMB modal wiring (refactored helpers)', () => {
  let MutationObserverBackup;
  let lastObserverInstance;

  // ---------------------- Helpers ----------------------
  const mockMutationObserver = () => {
    MutationObserverBackup = global.MutationObserver;
    class MockMutationObserver {
      constructor(cb) {
        this.cb = cb;
        this.observe = sinon.spy();
        this.disconnect = sinon.spy();
        lastObserverInstance = this;
      }
    }
    global.MutationObserver = MockMutationObserver;
  };

  const restoreMutationObserver = () => {
    global.MutationObserver = MutationObserverBackup;
    lastObserverInstance = null;
  };

  const makeHost = () => {
    const omb = document.createElement('div');
    omb.id = 'va-omb-info';
    document.body.appendChild(omb);
    return omb;
  };

  const addSecondaryButtonShadow = () => {
    const vaButtonSecondary = document.createElement('div');
    const buttonShadowRoot = document.createElement('div');
    const realButton = document.createElement('button');
    realButton.className = 'usa-button usa-button--outline';
    const focusSpy = sinon.spy(realButton, 'focus');
    buttonShadowRoot.appendChild(realButton);
    Object.defineProperty(vaButtonSecondary, 'shadowRoot', {
      get: () => buttonShadowRoot,
    });
    return { vaButtonSecondary, realButton, focusSpy };
  };

  // Build outer shadowRoot with or without the modal
  const attachOuterShadow = (omb, { includeModal = true } = {}) => {
    const { vaButtonSecondary, realButton, focusSpy } =
      addSecondaryButtonShadow();

    let modalEl = null;
    let modalShadowRoot = null;

    if (includeModal) {
      modalEl = document.createElement('div');
      modalShadowRoot = document.createElement('div');
      // generic selector the component uses
      modalShadowRoot.querySelector = sel =>
        modalShadowRoot.querySelectorAll(sel)[0] || null;
      Object.defineProperty(modalEl, 'shadowRoot', {
        get: () => modalShadowRoot,
      });
    }

    const outerShadowRoot = {
      querySelector: sel => {
        if (sel === 'va-button[secondary]') return vaButtonSecondary;
        if (sel === 'va-modal') return includeModal ? modalEl : null;
        return null;
      },
    };
    Object.defineProperty(omb, 'shadowRoot', { get: () => outerShadowRoot });

    return {
      vaButtonSecondary,
      realButton,
      focusSpy,
      modalEl,
      modalShadowRoot,
    };
  };

  const renderIntro = () =>
    renderWithStore(
      <IntroductionPage
        route={{ path: 'introduction', pageList: [], formConfig }}
      />,
    );

  const clickHostAndExpectObserver = omb => {
    fireEvent.click(omb);
    expect(lastObserverInstance).to.exist;
    expect(lastObserverInstance.observe.called).to.be.true;
  };

  const fireChildMutation = () => {
    const mut = [{ type: 'childList', addedNodes: [{}] }];
    lastObserverInstance.cb(mut, lastObserverInstance);
  };

  const appendCloseButton = modalShadowRoot => {
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Close Privacy Act Statement modal');
    const closeAddSpy = sinon.spy(closeBtn, 'addEventListener');
    const closeRemoveSpy = sinon.spy(closeBtn, 'removeEventListener');
    modalShadowRoot.appendChild(closeBtn);
    return { closeBtn, closeAddSpy, closeRemoveSpy };
  };

  const cleanupHost = omb => {
    const inst = omb || document.getElementById('va-omb-info');
    if (inst) inst.remove();
  };
  // -------------------- /Helpers -----------------------

  beforeEach(() => {
    mockMutationObserver();
  });

  afterEach(() => {
    restoreMutationObserver();
    cleanupHost();
  });

  it('adds/removes listeners, wires close button focus, and disconnects observer', () => {
    const omb = makeHost();
    const addSpy = sinon.spy(omb, 'addEventListener');
    const removeSpy = sinon.spy(omb, 'removeEventListener');

    const { modalShadowRoot, focusSpy } = attachOuterShadow(omb, {
      includeModal: true,
    });
    const { unmount } = renderIntro();

    expect(addSpy.calledWith('click')).to.be.true;

    clickHostAndExpectObserver(omb);

    const { closeBtn, closeAddSpy, closeRemoveSpy } =
      appendCloseButton(modalShadowRoot);
    fireChildMutation();
    expect(closeAddSpy.calledWith('click')).to.be.true;

    fireEvent.click(closeBtn);
    expect(focusSpy.calledOnce).to.be.true;
    expect(lastObserverInstance.disconnect.calledOnce).to.be.true;
    expect(closeRemoveSpy.calledWithMatch('click')).to.be.true;

    unmount();
    expect(removeSpy.calledWithMatch('click')).to.be.true;
  });

  it('gracefully handles when <va-modal> is missing (no observer, no crash)', () => {
    lastObserverInstance = undefined; // reset

    const omb = makeHost();
    attachOuterShadow(omb, { includeModal: false });
    const { unmount } = renderIntro();

    fireEvent.click(omb);
    expect(lastObserverInstance).to.equal(undefined);

    unmount();
  });

  it('attaches close listener when close button appears on a subsequent mutation', () => {
    const omb = makeHost();
    const { modalShadowRoot } = attachOuterShadow(omb, { includeModal: true });
    renderIntro();

    clickHostAndExpectObserver(omb);

    // First mutation: no button yet
    fireChildMutation();

    // Add close button then next mutation
    const { closeAddSpy } = appendCloseButton(modalShadowRoot);
    fireChildMutation();
    expect(closeAddSpy.calledWith('click')).to.be.true;
  });

  it('on unmount: removes close listener and disconnects observer even if modal is still open', () => {
    const omb = makeHost();
    const { modalShadowRoot } = attachOuterShadow(omb, { includeModal: true });
    const { unmount } = renderIntro();

    clickHostAndExpectObserver(omb);

    const { closeRemoveSpy } = appendCloseButton(modalShadowRoot);
    fireChildMutation();

    unmount();
    expect(lastObserverInstance.disconnect.called).to.be.true;
    expect(closeRemoveSpy.calledWithMatch('click')).to.be.true;
  });

  it('second click disconnects the first observer before observing again (no leaks)', () => {
    const omb = makeHost();
    attachOuterShadow(omb, { includeModal: true });
    renderIntro();

    fireEvent.click(omb);
    const firstObserver = lastObserverInstance;
    expect(firstObserver).to.exist;

    fireEvent.click(omb);
    const secondObserver = lastObserverInstance;
    expect(secondObserver).to.exist;
    expect(secondObserver).to.not.equal(firstObserver);
    expect(firstObserver.disconnect.called).to.be.true;
  });
});
