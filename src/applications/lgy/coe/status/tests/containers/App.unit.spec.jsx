import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../../shared/constants';
import App from '../../containers/App';

const getData = ({
  loggedIn = true,
  getCoeMock = () => {},
  coe = '',
  generateAutoCoeStatus = '',
  profileIsUpdating = false,
  showCOE = true,
} = {}) => ({
  props: {
    getCoe: () => {},
    getCoeMock,
    loggedIn,
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {},
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
      },
      certificateOfEligibility: {
        coe: coe ? { status: coe, referenceNumber: '123' } : null,
        generateAutoCoeStatus,
        profileIsUpdating,
      },
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        coe_access: showCOE,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

const original = window.location;

describe('App', () => {
  before(() => {
    window.location = {
      replace: () => {},
    };
  });
  after(() => {
    window.location = original;
  });
  it('should render loading indicator', () => {
    const { props, mockStore } = getData({ profileIsUpdating: true });
    const { container } = render(
      <div>
        <Provider store={mockStore}>
          <App {...props} />
        </Provider>
      </div>,
    );
    expect($('va-loading-indicator', container).getAttribute('message')).to.eq(
      'Loading application...',
    );
  });
  it('should render automatic check loading indicator', () => {
    const { props, mockStore } = getData({
      generateAutoCoeStatus: CALLSTATUS.pending,
    });
    const { container } = render(
      <div>
        <Provider store={mockStore}>
          <App {...props} />
        </Provider>
      </div>,
    );
    expect(
      $('va-loading-indicator', container).getAttribute('message'),
    ).to.contain('Checking automatic COE');
  });

  it('should call API if logged in', async () => {
    const getCoeMock = sinon.spy();
    const { props, mockStore } = getData({ getCoeMock });
    render(
      <Provider store={mockStore}>
        <App {...props} />,
      </Provider>,
    );

    expect(getCoeMock.called).to.be.true;
    // not skipping generateCoe action
    expect(getCoeMock.args[0][0]).to.be.false;
  });
  it('should not call API if not logged in', () => {
    const getCoeMock = sinon.spy();
    const { props, mockStore } = getData({ getCoeMock, loggedIn: false });
    render(
      <Provider store={mockStore}>
        <App {...props} />,
      </Provider>,
    );

    expect(getCoeMock.called).to.be.true;
    // we are skippingt generateCoe action
    expect(getCoeMock.args[0][0]).to.be.true;
  });

  it('should render available content', () => {
    const { props, mockStore } = getData({
      coe: COE_ELIGIBILITY_STATUS.available,
      generateAutoCoeStatus: CALLSTATUS.success,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const h2 = $$('h2', container);
    expect(h2[1].textContent).to.contain('What if I need to make changes');
  });
  it('should render eligible alert', () => {
    const { props, mockStore } = getData({
      coe: COE_ELIGIBILITY_STATUS.eligible,
      generateAutoCoeStatus: CALLSTATUS.success,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const h2 = $$('h2', container);
    expect(h2[0].textContent).to.contain(
      'Congratulations on your automatic COE',
    );
  });
  it('should render denied alert', () => {
    const { props, mockStore } = getData({
      coe: COE_ELIGIBILITY_STATUS.denied,
      generateAutoCoeStatus: CALLSTATUS.success,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const h2 = $$('h2', container);
    expect(h2[0].textContent).to.contain('We denied your request for a COE');
  });
  it('should render pending alert', () => {
    const { props, mockStore } = getData({
      coe: COE_ELIGIBILITY_STATUS.pending,
      generateAutoCoeStatus: CALLSTATUS.success,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const h2 = $$('h2', container);
    expect(h2[0].textContent).to.contain('We’re reviewing your request');
  });
  it('should render pending upload alert', () => {
    const { props, mockStore } = getData({
      coe: COE_ELIGIBILITY_STATUS.pendingUpload,
      generateAutoCoeStatus: CALLSTATUS.success,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const h2 = $$('h2', container);
    expect(h2[0].textContent).to.contain('We need more information');
    expect($('va-file-input', container)).to.exist;
  });
});
