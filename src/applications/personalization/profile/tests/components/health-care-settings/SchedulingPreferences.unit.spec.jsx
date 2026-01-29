import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import SchedulingPreferences from '../../../components/health-care-settings/SchedulingPreferences';
import { PROFILE_PATH_NAMES } from '../../../constants';
import {
  createBasicInitialState,
  createFeatureTogglesState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';

function createInitialState({ hasUnsavedEdits = false, toggles = {} } = {}) {
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
      addressValidation: {
        addressValidationType: '',
        suggestedAddresses: [],
        confirmedSuggestions: [],
        addressFromUser: {
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          city: '',
          stateCode: '',
          zipCode: '',
          countryCodeIso3: '',
        },
        addressValidationError: false,
        validationKey: null,
        selectedAddress: {},
        selectedAddressId: null,
      },
      copyAddressModal: null,
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  };
}

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

  it('sets correct page title on mount', () => {
    setup();

    expect(document.title).to.contain('Scheduling Preferences');
  });
});
