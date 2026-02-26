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
    getByText(/web page\./i);

    const link = container.querySelector('va-link[href="/"]');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('VR&E Check My Eligibility');
  });

  it('step 3: shows orientation content and reading materials when no milestones data', () => {
    const { container, getByText } = renderWithProviders(
      <CaseProgressDescription step={3} />,
      { ch31CaseMilestones: undefined },
    );

    getByText(/basic eligibility confirmed/i);
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

    getByText(/basic eligibility confirmed/i);
    expect(container.querySelector('va-alert')).to.exist;
    getByText(/Your choice has been recorded/i);
    expect(container.querySelector('va-card')).to.exist;
    expect(queryByText(/Orientation Completion/i)).to.exist;
  });

  it('renders step 4 pending instructions', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={4} status="PENDING" />,
    );

    getByText(/VR&E has received and processed your application/i);
    getByText(/scheduled meeting or to schedule your meeting/i);
    getByText(/confirmation of your meeting via email/i);
    getByText(/Career Planning/i);
  });

  it('renders step 4 scheduled instructions', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={4} status="SCHEDULED" />,
    );

    getByText(/Initial Evaluation Appointment has been scheduled/i);
    getByText(/reschedule, please use your appointment confirmation/i);
    getByText(/contact your counselor/i);
  });

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

    getByText(/Rehabilitation Plan/i);
    getByText(/review and approval/i);
  });

  it('renders step 7 description', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={7} />,
    );

    getByText(/has been initiated/i);
  });

  it('returns null for unknown step', () => {
    const { container } = renderWithProviders(
      <CaseProgressDescription step={999} />,
    );

    expect(container.innerHTML.trim()).to.equal('');
  });
});
