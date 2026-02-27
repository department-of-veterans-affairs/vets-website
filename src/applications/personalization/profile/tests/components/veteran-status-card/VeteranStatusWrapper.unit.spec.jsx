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

// Mock function to create a basic initial state
function createBasicInitialState() {
  return {
    featureToggles: {
      loading: false,
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

  describe('when feature toggles have loaded', () => {
    it('should render the VeteranStatus component', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState();

      const view = renderWithProfileReducers(<VeteranStatusWrapper />, {
        initialState,
      });

      await waitFor(() => {
        // VeteranStatus component calls the old API endpoint
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

  // TODO: Add test for VeteranStatusSharedService when feature toggle is enabled
});
