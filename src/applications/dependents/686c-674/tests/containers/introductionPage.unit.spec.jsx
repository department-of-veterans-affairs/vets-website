import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as actions from '../../actions';
import IntroductionPage from '../../containers/IntroductionPage';

const generateStore = ({
  hasVaFileNumber,
  isLoading = false,
  spyFn = () => {},
}) => ({
  getState: () => ({
    vaFileNumber: {
      isLoading,
      hasVaFileNumber: hasVaFileNumber
        ? { ...hasVaFileNumber }
        : hasVaFileNumber,
    },
    user: {
      login: { currentlyLoggedIn: true },
      profile: { savedForms: [], prefillsAvailable: [] },
    },
    form: {
      formId: '686C-674-V2',
      savedStatus: '',
      loadedData: { metadata: {} },
      data: {},
      contestedIssues: {},
    },
  }),
  subscribe: () => {},
  dispatch: spyFn,
});

const mockRoute = {
  pageList: [{ path: 'wrong-path' }, { path: 'testing' }],
  formConfig: { prefillEnabled: false, downtime: false, savedFormMessages: {} },
};

describe('IntroductionPage', () => {
  let verifyStub;

  beforeEach(() => {
    localStorage.setItem('hasSession', 'false');

    verifyStub = sinon
      .stub(actions, 'verifyVaFileNumber')
      .callsFake(() => ({ type: 'TEST/VERIFY' }));
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    localStorage.clear();
    if (verifyStub?.restore) verifyStub.restore();
  });

  it('renders introduction page', async () => {
    const store = generateStore({
      hasVaFileNumber: { VALIDVAFILENUMBER: true },
      isLoading: false,
    });

    const { container, queryByText } = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    expect(verifyStub.called).to.be.false;

    expect(container.querySelector('va-loading-indicator')).to.not.exist;
    expect(container.querySelector('va-alert[status="error"]')).to.not.exist;
    expect(queryByText(/Add or remove a dependent/i)).to.exist;
  });

  it('dispatches verify and shows loading when session exists & isLoading is true', async () => {
    localStorage.setItem('hasSession', 'true');
    const dispatchSpy = sinon.spy();
    const store = generateStore({
      isLoading: true,
      hasVaFileNumber: { VALIDVAFILENUMBER: false },
      spyFn: dispatchSpy,
    });

    const { container } = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(verifyStub.calledOnce).to.be.true;
      expect(dispatchSpy.called).to.be.true;
      expect(container.querySelector('va-loading-indicator')).to.exist;
    });
  });

  it('shows missing VA file number alert when session exists & not loading & invalid', async () => {
    localStorage.setItem('hasSession', 'true');
    const store = generateStore({
      isLoading: false,
      hasVaFileNumber: { VALIDVAFILENUMBER: false },
    });

    const { container } = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(verifyStub.calledOnce).to.be.true;
      const alert = container.querySelector('va-alert[status="error"]');
      expect(alert).to.exist;
    });
  });

  it('shows server error alert when hasVaFileNumber.errors is present', async () => {
    localStorage.setItem('hasSession', 'true');
    const store = generateStore({
      isLoading: false,
      hasVaFileNumber: { errors: [{ code: '500' }] },
    });

    const { container } = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(verifyStub.calledOnce).to.be.true;
      const alert = container.querySelector('va-alert[status="error"]');
      expect(alert).to.exist;
    });
  });

  it('renders intro when session exists, not loading, and VALIDVAFILENUMBER is true', async () => {
    localStorage.setItem('hasSession', 'true');
    const store = generateStore({
      isLoading: false,
      hasVaFileNumber: { VALIDVAFILENUMBER: true },
    });

    const { container, queryByText } = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(verifyStub.calledOnce).to.be.true;
      expect(container.querySelector('va-loading-indicator')).to.not.exist;
      expect(container.querySelector('va-alert[status="error"]')).to.not.exist;
      expect(queryByText(/Add or remove a dependent/i)).to.exist;
    });
  });
});
