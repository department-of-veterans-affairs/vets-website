import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
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

function selectVaRadio(container, value) {
  const vaRadio = container.querySelector('va-radio');
  expect(vaRadio, 'expected a va-radio host element').to.exist;
  fireEvent(
    vaRadio,
    new CustomEvent('vaValueChange', {
      detail: { value },
      bubbles: true,
      composed: true,
    }),
  );
}

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

    getByText(/basic eligibility has been determined/i);
    getByText(/Orientation Completion/i);

    // Host elements only (shadow components)
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

  it('step 3: shows minimal description when milestones data exists and no error', () => {
    const { container, getByText, queryByText } = renderWithProviders(
      <CaseProgressDescription step={3} />,
      { ch31CaseMilestones: { data: { ok: true }, error: null } },
    );

    getByText(/basic eligibility has been determined/i);
    expect(container.querySelector('va-card')).to.be.null;
    expect(queryByText(/Orientation Completion/i)).to.be.null;
  });

  it('renders step 4 pending instructions and radio options', () => {
    const { container, getByText } = renderWithProviders(
      <CaseProgressDescription step={4} />,
    );

    getByText(/VR&E has received and processed your application/i);

    expect(container.querySelector('va-card')).to.exist;
    expect(container.querySelector('va-radio')).to.exist;

    const tele = container.querySelector(
      'va-radio-option[label="Telecounseling meeting"]',
    );
    const inPerson = container.querySelector(
      'va-radio-option[label="In-person appointment"]',
    );
    expect(tele).to.exist;
    expect(inPerson).to.exist;

    // No additional info/button until a choice is selected
    expect(container.querySelector('va-button')).to.be.null;
  });

  it('step 4: selecting Telecounseling shows info and allows submit to confirmation', async () => {
    const { container, getByText, queryByText } = renderWithProviders(
      <CaseProgressDescription step={4} />,
    );

    selectVaRadio(container, 'Telecounseling meeting');

    await waitFor(() => {
      expect(container.querySelector('va-button')).to.exist;
    });

    getByText(/Telecounseling uses Microsoft Teams/i);
    getByText(/private setting to ensure confidentiality/i);

    const btn = container.querySelector('va-button');
    expect(btn.getAttribute('text')).to.equal('Submit');
    fireEvent.click(btn);

    await waitFor(() => {
      getByText(/You have scheduled your Initial Evaluation Appointment/i);
    });

    expect(container.querySelector('va-radio')).to.be.null;
    expect(container.querySelector('va-button')).to.be.null;
    expect(queryByText(/Schedule your Initial Evaluation Counselor Meeting/i))
      .to.be.null;
  });

  it('step 4: selecting In-person shows info and allows submit to confirmation', async () => {
    const { container, getByText, queryByText } = renderWithProviders(
      <CaseProgressDescription step={4} />,
    );

    selectVaRadio(container, 'In-person appointment');

    await waitFor(() => {
      expect(container.querySelector('va-button')).to.exist;
    });

    getByText(
      /If your appointment is in-person appointment at a specified location/i,
    );
    getByText(
      /Plan for the initial evaluation appointment to last two hours or more/i,
    );
    getByText(/Do not bring minor children with you/i);
    getByText(/you may bring the documents outlined/i);

    const btn = container.querySelector('va-button');
    expect(btn.getAttribute('text')).to.equal('Submit');
    fireEvent.click(btn);

    await waitFor(() => {
      getByText(/You have scheduled your Initial Evaluation Appointment/i);
    });

    expect(container.querySelector('va-radio')).to.be.null;
    expect(container.querySelector('va-button')).to.be.null;
    expect(queryByText(/Schedule your Initial Evaluation Counselor Meeting/i))
      .to.be.null;
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
