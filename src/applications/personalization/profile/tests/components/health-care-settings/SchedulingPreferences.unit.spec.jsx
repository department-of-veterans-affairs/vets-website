import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { waitFor } from '@testing-library/dom';
import SchedulingPreferences from '../../../components/health-care-settings/SchedulingPreferences';
import { PROFILE_PATH_NAMES } from '../../../constants';
import {
  createBasicInitialState,
  createFeatureTogglesState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';

const createInitialState = ({
  hasUnsavedEdits = false,
  toggles = {},
  error = false,
} = {}) => {
  return {
    ...createBasicInitialState(),
    ...createFeatureTogglesState(toggles),
    vapService: {
      hasUnsavedEdits,
      initialFormFields: {},
      modal: null,
      modalData: null,
      formFields: {},
      transactions: [],
      fieldTransactionMap: {},
      transactionsAwaitingUpdate: [],
      metadata: {
        mostRecentErroredTransactionId: '',
      },
    },
    vaProfile: {
      schedulingPreferences: {
        loading: false,
        error,
        data: {},
      },
    },
  };
};

const defaultOptions = {
  path: '/profile/health-care-settings/scheduling-preferences',
  hasUnsavedEdits: false,
};

const setup = (options = defaultOptions) => {
  const optionsWithDefaults = { ...defaultOptions, ...options };
  const initialState = createInitialState(optionsWithDefaults);

  return renderWithProfileReducersAndRouter(<SchedulingPreferences />, {
    initialState,
    path: optionsWithDefaults.path,
  });
};

describe('SchedulingPreferences', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without crashing', () => {
    const { container } = setup();
    expect(container).to.exist;
  });

  it('renders the headline with correct title', () => {
    const { getByTestId } = setup();

    const headline = getByTestId('scheduling-preferences-page-headline');
    expect(headline.textContent).to.contain(
      PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES,
    );
  });

  it('renders the description paragraph when there is no error', () => {
    const { getByText } = setup();

    const description = getByText(
      /Manage your scheduling preferences for health care appointments/i,
    );
    expect(description).to.exist;
  });

  it('renders all three preference sections with correct titles', () => {
    const { container, getByText } = setup();

    const sections = container.querySelectorAll('.profile-info-section');
    expect(sections.length).to.equal(3);

    expect(getByText('Contact preferences')).to.exist;
    expect(getByText('Appointment preferences')).to.exist;
    expect(getByText('Provider preferences')).to.exist;
  });

  it('renders two cards in each preference section', () => {
    const { container } = setup();

    const sections = container.querySelectorAll('.profile-info-section');
    sections.forEach(section => {
      const cards = section.querySelectorAll('va-card');
      expect(cards.length).to.equal(2);
    });
  });

  it('sets correct page title on mount', async () => {
    setup();

    await waitFor(() =>
      expect(document.title).to.contain('Scheduling Preferences'),
    );
  });

  it('renders error message when there is an error fetching preferences', () => {
    const { getByTestId } = setup({ error: true });

    const errorMessage = getByTestId('service-is-down-banner');
    expect(errorMessage).to.exist;
  });

  it('shows the loading spinner when loading preferences', () => {
    const initialState = createInitialState({
      hasUnsavedEdits: false,
      toggles: {},
      error: false,
    });

    // Set loading to true for schedulingPreferences
    initialState.vaProfile.schedulingPreferences.loading = true;

    const { getByTestId } = renderWithProfileReducersAndRouter(
      <SchedulingPreferences />,
      {
        initialState,
      },
    );

    const loadingSpinner = getByTestId('loading-spinner');
    expect(loadingSpinner).to.exist;
  });

  it('uses fallback values when schedulingPreferences data is missing', () => {
    const initialState = createInitialState();
    // Ensure schedulingPreferences data is undefined
    initialState.vaProfile.schedulingPreferences = undefined;

    const { container } = renderWithProfileReducersAndRouter(
      <SchedulingPreferences />,
      {
        initialState,
      },
    );

    // Check that the page still renders and shows the sections
    const sections = container.querySelectorAll('.profile-info-section');
    expect(sections.length).to.equal(3);
  });
});
