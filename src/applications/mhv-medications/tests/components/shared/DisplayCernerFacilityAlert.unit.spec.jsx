import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import reducer from '../../../reducers';
import {
  drupalStaticData,
  userProfileFacilities,
} from '../../fixtures/cerner-facility-mock-data.json';
import prescriptions from '../../fixtures/refillablePrescriptionsList.json';
import DisplayCernerFacilityAlert from '../../../components/shared/DisplayCernerFacilityAlert';

describe('Display Cerner Facility Alert', () => {
  const initialStateMock = {
    rx: {
      prescriptions,
    },
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
    featureToggles: [],
  };

  const setup = (state = initialStateMock, facilities = { facilities: [] }) => {
    return renderWithStoreAndRouterV6(<DisplayCernerFacilityAlert />, {
      initialState: { ...state, user: { ...state.user, profile: facilities } },
      reducers: reducer,
      initialEntries: ['/about'],
    });
  };

  it(`renders CernerFacilityAlert if showNewFacilityAlertfeature toggle is OFF`, async () => {
    initialStateMock.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicationsDisplayNewCernerFacilityAlert
    ] = false;

    const screen = setup(initialStateMock, {
      facilities: [
        ...userProfileFacilities,
        {
          facilityId: '757',
          isCerner: true,
        },
      ],
      userAtPretransitionedOhFacility: true,
      userFacilityReadyForInfoAlert: false,
    });

    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.exist;

    const newCernerAlert = screen.queryByTestId('new-cerner-facilities-alert');
    expect(newCernerAlert).to.not.exist;
  });

  it(`renders CernerFacilityAlert when showNewFacilityAlert feature toggle is ON and hasTransistionalFacility is false`, async () => {
    initialStateMock.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicationsDisplayNewCernerFacilityAlert
    ] = true;

    const screen = setup(initialStateMock, {
      facilities: userProfileFacilities,
      userAtPretransitionedOhFacility: true,
      userFacilityReadyForInfoAlert: false,
    });

    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.exist;

    const newCernerAlert = screen.queryByTestId('new-cerner-facilities-alert');
    expect(newCernerAlert).to.not.exist;
  });

  it(`renders NewCernerFacilityAlert when showNewFacilityAlert feature toggle is ON and hasTransistionalFacility is true`, async () => {
    initialStateMock.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicationsDisplayNewCernerFacilityAlert
    ] = true;

    const screen = setup(initialStateMock, {
      facilities: [
        ...userProfileFacilities,
        {
          facilityId: '757',
          isCerner: true,
        },
      ],
      userAtPretransitionedOhFacility: true,
      userFacilityReadyForInfoAlert: false,
    });

    const newCernerAlert = screen.queryByTestId('new-cerner-facilities-alert');
    expect(newCernerAlert).to.exist;

    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.not.exist;
  });
});
