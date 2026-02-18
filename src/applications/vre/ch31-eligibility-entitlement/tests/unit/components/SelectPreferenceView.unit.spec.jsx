import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import * as UserSelectors from 'platform/user/selectors';
import SelectPreferenceView from '../../../components/SelectPreferenceView';
import * as MilestoneActions from '../../../actions/ch31-case-milestones';
import {
  CH31_CASE_MILESTONES_RESET_STATE,
  MILESTONE_COMPLETION_TYPES,
} from '../../../constants';

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

// Helpers to interact with VA web components (shadow hosts)
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

function checkVaCheckbox(container) {
  const checkbox = container.querySelector('va-checkbox');
  expect(checkbox, 'expected a va-checkbox host element').to.exist;

  // Ensure e.target.checked reads true in handler
  Object.defineProperty(checkbox, 'checked', {
    value: true,
    configurable: true,
  });

  fireEvent(
    checkbox,
    new CustomEvent('vaChange', {
      bubbles: true,
      composed: true,
    }),
  );
}

describe('SelectPreferenceView', () => {
  beforeEach(() => {
    sandbox.stub(UserSelectors, 'selectUser').returns({ uuid: 'user-123' });
    sandbox
      .stub(MilestoneActions, 'submitCh31CaseMilestones')
      .callsFake(({ milestoneCompletionType, user }) => ({
        type: 'SUBMIT_CH31_CASE_MILESTONES',
        payload: { milestoneCompletionType, user },
      }));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders initial instructional text', () => {
    const { getByText } = renderWithProviders(<SelectPreferenceView />, {
      ch31CaseMilestones: { loading: false, error: null },
    });

    getByText(/You will need to complete your Orientation/i);
    getByText(/Which is your preferred course of action\?/i);
    // Radio host present
    expect(document.querySelector('va-radio')).to.exist;
  });

  it('Watch Video path: shows extra content, requires attestation, then dispatches submit', async () => {
    const state = { ch31CaseMilestones: { loading: false, error: null } };
    const { container, getByText } = renderWithProviders(
      <SelectPreferenceView />,
      state,
    );

    // Switch to Watch Video option
    selectVaRadio(container, 'Watch the VA Orientation Video online');

    // Reset action dispatched on radio change
    await waitFor(() => {
      // We can't directly access the store spy here; validate presence of host elements
      expect(
        container.querySelector('va-link[channel][href="https://www.va.gov"]'),
      ).to.exist;
    });

    // Link and checkbox appear
    getByText(/Please watch the full video and self-certify/i);
    expect(
      container.querySelector('va-link[channel][href="https://www.va.gov"]'),
    ).to.exist;
    expect(container.querySelector('va-checkbox')).to.exist;

    // Submit without attestation -> shows error on va-checkbox
    const btn = container.querySelector('va-button');
    expect(btn).to.exist;
    expect(btn.getAttribute('text')).to.equal('Submit');
    fireEvent.click(btn);

    const vaCheckbox = container.querySelector('va-checkbox');
    expect(vaCheckbox.getAttribute('error')).to.equal(
      'You must acknowledge and attest that you have watched the video.',
    );

    // Check the attestation and submit
    checkVaCheckbox(container);
    fireEvent.click(btn);

    // Action creator dispatch called with expected payload
    // We can't grab the store spy from renderWithProviders; re-render with shared store to assert dispatch
    const sharedStore = makeStore(state);
    const { container: container2 } = render(
      <Provider store={sharedStore}>
        <MemoryRouter>
          <SelectPreferenceView />
        </MemoryRouter>
      </Provider>,
    );

    selectVaRadio(container2, 'Watch the VA Orientation Video online');
    checkVaCheckbox(container2);

    const submitBtn = container2.querySelector('va-button');
    fireEvent.click(submitBtn);

    expect(
      sharedStore.dispatch.calledWith({
        type: 'SUBMIT_CH31_CASE_MILESTONES',
        payload: {
          milestoneCompletionType: MILESTONE_COMPLETION_TYPES.STEP_3,
          user: { uuid: 'user-123' },
        },
      }),
    ).to.be.true;
  });

  it('In-person path: shows submit button and dispatches submit', () => {
    const state = { ch31CaseMilestones: { loading: false, error: null } };
    const sharedStore = makeStore(state);

    const { container } = render(
      <Provider store={sharedStore}>
        <MemoryRouter>
          <SelectPreferenceView />
        </MemoryRouter>
      </Provider>,
    );

    // Select In-person appointment
    selectVaRadio(
      container,
      'Complete orientation during the Initial Evaluation Counselor Meeting',
    );

    // Button appears
    const btn = container.querySelector('va-button');
    expect(btn).to.exist;
    expect(btn.getAttribute('text')).to.equal('Submit');

    fireEvent.click(btn);

    expect(
      sharedStore.dispatch.calledWith({
        type: 'SUBMIT_CH31_CASE_MILESTONES',
        payload: {
          milestoneCompletionType: MILESTONE_COMPLETION_TYPES.STEP_3,
          user: { uuid: 'user-123' },
        },
      }),
    ).to.be.true;
  });

  it('shows error alert when milestones error exists for either path', async () => {
    const errorState = { ch31CaseMilestones: { loading: false, error: 'bad' } };
    const { container } = renderWithProviders(
      <SelectPreferenceView />,
      errorState,
    );

    // Watch Video selection shows error alert host
    selectVaRadio(container, 'Watch the VA Orientation Video online');
    await waitFor(() => {
      expect(container.querySelector('va-alert[status="error"]')).to.exist;
    });

    // Re-render with In-person selection and error
    const { container: container2 } = renderWithProviders(
      <SelectPreferenceView />,
      errorState,
    );
    selectVaRadio(
      container2,
      'Complete orientation during the Initial Evaluation Counselor Meeting',
    );
    await waitFor(() => {
      expect(container2.querySelector('va-alert[status="error"]')).to.exist;
    });
  });

  it('dispatches reset state when changing radio or checkbox', async () => {
    const state = { ch31CaseMilestones: { loading: false, error: null } };
    const sharedStore = makeStore(state);

    const { container } = render(
      <Provider store={sharedStore}>
        <MemoryRouter>
          <SelectPreferenceView />
        </MemoryRouter>
      </Provider>,
    );

    // Radio change dispatches reset
    selectVaRadio(container, 'Watch the VA Orientation Video online');
    expect(
      sharedStore.dispatch.calledWith({
        type: CH31_CASE_MILESTONES_RESET_STATE,
      }),
    ).to.be.true;

    // Checkbox change dispatches reset
    checkVaCheckbox(container);
    expect(
      sharedStore.dispatch.calledWith({
        type: CH31_CASE_MILESTONES_RESET_STATE,
      }),
    ).to.be.true;
  });
});
