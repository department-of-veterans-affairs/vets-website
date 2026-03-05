import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import * as UserSelectors from '@department-of-veterans-affairs/platform-user/selectors';
import SelectPreferenceView from '../../../components/SelectPreferenceView';
import * as MilestoneActions from '../../../actions/ch31-case-milestones';
import {
  CH31_CASE_MILESTONES_RESET_STATE,
  MILESTONE_COMPLETION_TYPES,
  YOUTUBE_ORIENTATION_VIDEO_URL,
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

function selectVaRadio(container, value) {
  const vaRadio = container.querySelector('va-radio');
  fireEvent(
    vaRadio,
    new CustomEvent('vaValueChange', {
      detail: { value },
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
      .callsFake(({ milestoneCompletionType, postpone, user }) => ({
        type: 'SUBMIT_CH31_CASE_MILESTONES',
        payload: { milestoneCompletionType, postpone, user },
      }));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders initial instructional text', () => {
    const { getByText } = renderWithProviders(<SelectPreferenceView />, {
      ch31CaseMilestones: { loading: false, error: null },
    });
    getByText(
      /Choose between watching the VA Video Orientation online or completing orientation/i,
    );
  });

  it('shows the video link when watch-video is selected', async () => {
    const { container } = renderWithProviders(<SelectPreferenceView />, {
      ch31CaseMilestones: { loading: false, error: null },
    });

    selectVaRadio(container, 'Watch the VA Orientation Video online');

    await waitFor(() => {
      expect(
        container.querySelector(
          `va-link[channel][href="${YOUTUBE_ORIENTATION_VIDEO_URL}"]`,
        ),
      ).to.exist;
    });
  });

  it('dispatches submit for the in-person path', () => {
    const state = { ch31CaseMilestones: { loading: false, error: null } };
    const sharedStore = makeStore(state);

    const { container } = render(
      <Provider store={sharedStore}>
        <MemoryRouter>
          <SelectPreferenceView />
        </MemoryRouter>
      </Provider>,
    );

    selectVaRadio(
      container,
      'Complete orientation during the Initial Evaluation Counselor Meeting',
    );

    const btn = container.querySelector('va-button');
    fireEvent.click(btn);

    expect(
      sharedStore.dispatch.calledWith({
        type: 'SUBMIT_CH31_CASE_MILESTONES',
        payload: {
          milestoneCompletionType: MILESTONE_COMPLETION_TYPES.STEP_3,
          postpone: true,
          user: { uuid: 'user-123' },
        },
      }),
    ).to.be.true;
  });

  it('dispatches reset state on radio change', () => {
    const state = { ch31CaseMilestones: { loading: false, error: null } };
    const sharedStore = makeStore(state);

    const { container } = render(
      <Provider store={sharedStore}>
        <MemoryRouter>
          <SelectPreferenceView />
        </MemoryRouter>
      </Provider>,
    );

    selectVaRadio(container, 'Watch the VA Orientation Video online');
    expect(
      sharedStore.dispatch.calledWith({
        type: CH31_CASE_MILESTONES_RESET_STATE,
      }),
    ).to.be.true;
  });
});
