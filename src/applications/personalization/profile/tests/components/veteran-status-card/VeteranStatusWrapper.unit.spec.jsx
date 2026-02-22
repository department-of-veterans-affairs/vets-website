import React from 'react';
import { expect } from 'chai';
import * as api from '~/platform/utilities/api';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithProfileReducers } from '../../unit-test-helpers';
import VeteranStatusWrapper from '../../../components/veteran-status-card/VeteranStatusWrapper';

// Mock service history data for the old VeteranStatus component
const serviceHistoryConfirmed = {
  serviceHistory: [
    {
      branchOfService: 'Air Force',
      beginDate: '2009-04-12',
      endDate: '2013-04-11',
    },
  ],
  vetStatusEligibility: {
    confirmed: true,
    message: [],
  },
};

// Mock API responses
const vetStatusConfirmed = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: { veteranStatus: 'confirmed' },
  },
};

/* eslint-disable camelcase */
const veteranStatusCardConfirmed = {
  type: 'veteran_status_card',
  veteran_status: 'confirmed',
  service_summary_code: 'A1',
  not_confirmed_reason: null,
  attributes: {
    full_name: 'John Doe',
    disability_rating: 40,
    latest_service: {
      branch: 'Army',
      begin_date: '2009-04-12',
      end_date: '2013-04-11',
    },
    edipi: 1234567890,
  },
};
/* eslint-enable camelcase */

// Mock function to create a basic initial state
function createBasicInitialState(useSharedService = false) {
  return {
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      profile_use_shared_vetran_status_service: useSharedService,
      profileUseSharedVetranStatusService: useSharedService,
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
    },
    user: {
      profile: {
        edipi: 1234567890,
        veteranStatus: {
          status: 'OK',
        },
      },
    },
    totalRating: {
      totalDisabilityRating: 40,
    },
    vaProfile: {
      hero: {
        userFullName: {
          first: 'John',
          last: 'Doe',
        },
      },
      personalInformation: {
        birthDate: '1986-05-06',
      },
      militaryInformation: {
        serviceHistory: serviceHistoryConfirmed,
      },
    },
  };
}

describe('VeteranStatusWrapper', () => {
  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
  });

  afterEach(() => {
    apiRequestStub.restore();
  });

  describe('when feature toggle is loading', () => {
    it('should render loading indicator', () => {
      const initialState = createBasicInitialState();
      initialState.featureToggles.loading = true;

      const view = renderWithProfileReducers(<VeteranStatusWrapper />, {
        initialState,
      });

      expect(view.getByTestId('veteran-status-wrapper-loading')).to.exist;
    });
  });

  describe('when feature toggle profileUseSharedVetranStatusService is disabled', () => {
    it('should render the old VeteranStatus component', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState(false);

      const view = renderWithProfileReducers(<VeteranStatusWrapper />, {
        initialState,
      });

      await waitFor(() => {
        // Old component calls the old API endpoint
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );

        // Check that the heading is rendered
        expect(
          view.getByRole('heading', {
            name: 'Veteran Status Card',
            level: 1,
          }),
        ).to.exist;
      });
    });
  });

  describe('when feature toggle profileUseSharedVetranStatusService is enabled', () => {
    it('should render the new VeteranStatusSharedService component', async () => {
      apiRequestStub.resolves(veteranStatusCardConfirmed);
      const initialState = createBasicInitialState(true);

      const view = renderWithProfileReducers(<VeteranStatusWrapper />, {
        initialState,
      });

      await waitFor(() => {
        // New component calls the new API endpoint
        sinon.assert.calledWith(apiRequestStub, '/veteran_status_card');

        // Check that the heading is rendered
        expect(
          view.getByRole('heading', {
            name: 'Veteran Status Card',
            level: 1,
          }),
        ).to.exist;

        // Check that the user's full name from the new API is rendered
        expect(view.getByText('John Doe')).to.exist;
      });
    });
  });
});
