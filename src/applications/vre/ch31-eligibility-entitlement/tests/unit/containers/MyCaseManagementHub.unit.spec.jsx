/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import * as UI from 'platform/utilities/ui';
import * as actions from '../../../actions/ch31-my-eligibility-and-benefits';

import MyCaseManagementHub from '../../../containers/MyCaseManagementHub';

// Stub children that commonly throw in JSDOM/unit tests
import * as CaseProgressBarMod from '../../../components/CaseProgressBar';
import * as HubCardListMod from '../../../components/HubCardList';
import * as NeedHelpMod from '../../../components/NeedHelp';
import * as ApptAlertMod from '../../../components/AppointmentScheduledAlert';
import * as DiscontinuedMod from '../../../components/ApplicationDiscontinuedAlert';
import * as InterruptedMod from '../../../components/ApplicationInterruptedAlert';
import * as LoadFailedMod from '../../../components/LoadCaseDetailsFailedAlert';

const sandbox = sinon.createSandbox();

const makeStore = state => {
  const dispatch = sandbox.spy();
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch,
  };
};

const renderPage = state =>
  render(
    <Provider store={makeStore(state)}>
      <MemoryRouter
        initialEntries={['/careers-employment/my-case-management-hub']}
      >
        <Route path="/careers-employment/my-case-management-hub">
          <MyCaseManagementHub />
        </Route>
      </MemoryRouter>
    </Provider>,
  );

const makeState = ({
  toggleOn = true,
  loading = false,
  error = null,
  attrs = null,
} = {}) => ({
  featureToggles: {
    loading: false,
    vre_eligibility_status_phase_2_updates: toggleOn,
  },
  ch31CaseStatusDetails: {
    loading,
    error,
    data: attrs ? { attributes: attrs } : null,
  },
});

describe('<MyCaseManagementHub>', () => {
  beforeEach(() => {
    sandbox.stub(UI, 'scrollToTop');
    sandbox.stub(UI, 'focusElement');

    sandbox
      .stub(actions, 'fetchCh31CaseStatusDetails')
      .returns({ type: 'FETCH_CH31_CASE_STATUS_DETAILS' });

    // Child component stubs: prevent JSDOM/browser API issues from bubbling up
    sandbox
      .stub(CaseProgressBarMod, 'default')
      .callsFake(() => <div data-testid="case-progress-bar" />);
    sandbox
      .stub(HubCardListMod, 'default')
      .callsFake(() => <div data-testid="hub-card-list" />);
    sandbox
      .stub(NeedHelpMod, 'default')
      .callsFake(() => <div data-testid="need-help" />);
    sandbox
      .stub(ApptAlertMod, 'default')
      .callsFake(() => <div data-testid="appt-alert" />);
    sandbox
      .stub(DiscontinuedMod, 'default')
      .callsFake(() => <div data-testid="discontinued-alert" />);
    sandbox
      .stub(InterruptedMod, 'default')
      .callsFake(() => <div data-testid="interrupted-alert" />);
    sandbox
      .stub(LoadFailedMod, 'default')
      .callsFake(() => <div data-testid="load-failed-alert" />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders unavailable message when feature toggle is off', () => {
    const { getByRole, getByText } = renderPage(makeState({ toggleOn: false }));
    getByRole('heading', { name: /My Case Management Hub/i });
    getByText(/This page isn’t available right now/i);
  });

  it('shows loading indicator when loading is true', () => {
    const { getByText, container } = renderPage(makeState({ loading: true }));
    getByText(/My Case Management Hub/i);
    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('renders the main page heading when toggle is on and not loading', () => {
    const attrs = {
      externalStatus: {
        isDiscontinued: false,
        discontinuedReason: null,
        isInterrupted: false,
        interruptedReason: null,
        stateList: [],
      },
      orientationAppointmentDetails: null,
    };

    const { getByText, queryByText } = renderPage(makeState({ attrs }));
    expect(queryByText(/This page isn’t available right now/i)).to.equal(null);
    getByText(/My VR&E Chapter 31 Benefits Tracker/i);
  });
});
