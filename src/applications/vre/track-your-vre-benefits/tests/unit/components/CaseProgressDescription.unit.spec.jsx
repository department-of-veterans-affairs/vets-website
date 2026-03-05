import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import CaseProgressDescription from '../../../components/CaseProgressDescription';
import * as HubCardListMod from '../../../components/HubCardList';
import * as SelectPreferenceViewMod from '../../../components/SelectPreferenceView';

const sandbox = sinon.createSandbox();
let hubCardProps;

const makeStore = state => {
  const dispatch = sandbox.spy();
  return {
    getState: () => state || {},
    subscribe: () => () => {},
    dispatch,
  };
};

const renderWithProviders = (ui, state = {}) =>
  render(
    <Provider store={makeStore(state)}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );

describe('CaseProgressDescription', () => {
  beforeEach(() => {
    hubCardProps = null;

    sandbox.stub(HubCardListMod, 'default').callsFake(props => {
      hubCardProps = props;
      return <div data-testid="hub-card-list" />;
    });
    sandbox
      .stub(SelectPreferenceViewMod, 'default')
      .callsFake(() => <div data-testid="select-preference-view" />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders step 1 description', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={1} />,
    );
    getByText(/received your application for VR&E benefits\./i);
  });

  it('renders step 2 with eligibility link', () => {
    const { container } = renderWithProviders(
      <CaseProgressDescription step={2} />,
    );
    const link = container.querySelector(
      'va-link[href="/careers-employment/your-vre-eligibility"]',
    );
    expect(link).to.exist;
  });

  it('renders step 3 orientation content', () => {
    const { container, getByText } = renderWithProviders(
      <CaseProgressDescription step={3} />,
      { ch31CaseMilestones: undefined },
    );
    getByText(/Orientation Completion/i);
    expect(container.querySelector('va-card')).to.exist;
  });

  it('renders step 3 success state when a preference has already been recorded', () => {
    const {
      container,
      getByText,
      queryByTestId,
      queryByText,
    } = renderWithProviders(<CaseProgressDescription step={3} />, {
      ch31CaseMilestones: {
        data: { saved: true },
        error: null,
      },
    });

    getByText(/Your choice has been recorded/i);
    expect(container.querySelector('va-alert[status="success"]')).to.exist;
    expect(queryByTestId('select-preference-view')).to.equal(null);
    expect(queryByText(/Reading Material/i)).to.equal(null);
  });

  it('renders the step 4 scheduling message when the appointment is still pending', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={4} status="PENDING" />,
    );

    getByText(/Check your email to schedule your meeting with your counselor/i);
  });

  it('renders the step 4 scheduled message when appointment details are available', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription
        step={4}
        status="COMPLETED"
        attributes={{
          orientationAppointmentDetails: {
            appointmentDateTime: '2026-03-03T10:00:00Z',
            appointmentPlace: 'Regional office',
          },
        }}
      />,
    );

    getByText(/Your Initial Evaluation Appointment has been scheduled/i);
  });

  it('renders hub cards for the later workflow steps when requested', () => {
    const cases = [
      {
        step: 5,
        text: /Entitlement Determination Review/i,
      },
      {
        step: 6,
        text: /establish your Chapter 31 Rehabilitation Plan or Career Track/i,
      },
      {
        step: 7,
        text: /Rehabilitation Plan or Career Track has started/i,
      },
    ];

    cases.forEach(({ step, text }) => {
      const { getByTestId, getByText, unmount } = renderWithProviders(
        <CaseProgressDescription step={step} showHubCards />,
      );

      getByText(text);
      getByTestId('hub-card-list');
      expect(hubCardProps).to.deep.equal({ step });

      unmount();
    });
  });

  it('returns null for unknown step', () => {
    const { container } = renderWithProviders(
      <CaseProgressDescription step={999} />,
    );
    expect(container.innerHTML.trim()).to.equal('');
  });
});
