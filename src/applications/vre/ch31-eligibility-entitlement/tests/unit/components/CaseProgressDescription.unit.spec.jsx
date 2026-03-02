import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import CaseProgressDescription from '../../../components/CaseProgressDescription';

// Stub children that can throw in JSDOM/unit tests
import * as HubCardListMod from '../../../components/HubCardList';
import * as SelectPreferenceViewMod from '../../../components/SelectPreferenceView';

const sandbox = sinon.createSandbox();

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
    // Child component stubs
    sandbox
      .stub(HubCardListMod, 'default')
      .callsFake(() => <div data-testid="hub-card-list" />);
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
    getByText(/nothing you need to do right now\./i);
  });

  it('renders step 2 with eligibility link (va-link host)', () => {
    const { container, getByText } = renderWithProviders(
      <CaseProgressDescription step={2} />,
    );

    getByText(/currently being reviewed for basic eligibility/i);

    // Updated: copy now ends with "page." (not "web page.")
    getByText(/page\./i);

    const link = container.querySelector(
      'va-link[href="/careers-employment/your-vre-eligibility"]',
    );
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Your VR&E eligibility and benefits',
    );
  });

  it('step 3: shows orientation content and reading materials when no milestones data', () => {
    const { container, getByText } = renderWithProviders(
      <CaseProgressDescription step={3} />,
      { ch31CaseMilestones: undefined },
    );

    getByText(
      /VR&E has received and processed your application for Chapter 31 benefits/i,
    );
    getByText(/Orientation Completion/i);

    expect(container.querySelector('va-card')).to.exist;
    expect(
      container.querySelector(
        'va-link[href="https://www.va.gov/careers-employment/vocational-rehabilitation"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'va-link[href="https://www.va.gov/careers-employment/vocational-rehabilitation/programs"]',
      ),
    ).to.exist;
  });

  it('step 3: shows orientation completion alert when milestones data exists and no error', () => {
    const { container, getByText, queryByText } = renderWithProviders(
      <CaseProgressDescription step={3} />,
      { ch31CaseMilestones: { data: { ok: true }, error: null } },
    );

    getByText(
      /VR&E has received and processed your application for Chapter 31 benefits/i,
    );
    expect(container.querySelector('va-alert')).to.exist;
    getByText(/Your choice has been recorded/i);
    expect(container.querySelector('va-card')).to.exist;
    expect(queryByText(/Orientation Completion/i)).to.exist;
  });

  // ...existing code...

  it('renders step 4 pending instructions when status is PENDING', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={4} status="PENDING" />,
    );

    getByText(
      /received and processed your application for Chapter 31 benefits/i,
    );
    getByText(/Check your email to schedule your meeting with your counselor/i);
    getByText(
      /get a confirmation email and an appointment notification letter/i,
    );
    getByText(
      /To get ready for your Initial Evaluation Counselor Meeting, visit the "Career Planning" page linked below/i,
    );
  });

  it('renders step 4 pending instructions when appointmentDateTime or appointmentPlace is missing', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription
        step={4}
        status="ACTIVE"
        attributes={{
          orientationAppointmentDetails: {
            appointmentDateTime: null,
            appointmentPlace: null,
          },
        }}
      />,
    );

    getByText(
      /received and processed your application for Chapter 31 benefits/i,
    );
    getByText(/Check your email to schedule your meeting with your counselor/i);
    getByText(
      /get a confirmation email and an appointment notification letter/i,
    );
    getByText(
      /To get ready for your Initial Evaluation Counselor Meeting, visit the "Career Planning" page linked below/i,
    );
  });

  it('renders step 4 scheduled instructions when appointmentDateTime and appointmentPlace exist', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription
        step={4}
        status="ACTIVE"
        attributes={{
          orientationAppointmentDetails: {
            appointmentDateTime: '2026-02-27T10:00:00Z',
            appointmentPlace: 'VA Office',
          },
        }}
      />,
    );

    getByText(/Your Initial Evaluation Appointment has been scheduled/i);
    getByText(
      /If you need to reschedule, use your appointment confirmation rescheduling link sent to you via email and text/i,
    );
    getByText(/If you need further assistance, contact your counselor/i);
  });

  // ...existing code...

  it('renders step 5 description', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={5} />,
    );

    getByText(/Entitlement Determination Review/i);
    getByText(/Career Planning/i);
  });

  it('renders step 6 description', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={6} />,
    );

    // Updated: matches new Step 6 copy
    getByText(/working with you to establish/i);
    getByText(/Chapter 31 Rehabilitation Plan or Career Track/i);
  });

  it('renders step 7 description', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={7} />,
    );

    getByText(
      /Your Chapter 31 Rehabilitation Plan or Career Track has started/i,
    );
  });

  it('returns null for unknown step', () => {
    const { container } = renderWithProviders(
      <CaseProgressDescription step={999} />,
    );

    expect(container.innerHTML.trim()).to.equal('');
  });
});
