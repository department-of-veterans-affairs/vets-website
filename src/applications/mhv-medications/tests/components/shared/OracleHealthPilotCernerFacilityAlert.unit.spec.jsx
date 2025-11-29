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
import OracleHealthPilotCernerFacilityAlert from '../../../components/shared/OracleHealthPilotCernerFacilityAlert';

describe('OracleHealthPilotCernerFacilityAlert', () => {
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
    featureToggles: {},
  };

  const setup = (state = initialStateMock, facilities = { facilities: [] }) => {
    return renderWithStoreAndRouterV6(
      <OracleHealthPilotCernerFacilityAlert />,
      {
        initialState: {
          ...state,
          user: { ...state.user, profile: facilities },
        },
        reducers: reducer,
        initialEntries: ['/about'],
      },
    );
  };

  it('should render DisplayCernerFacilityAlert when pilot flag is disabled', async () => {
    const state = {
      ...initialStateMock,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
      },
    };

    const screen = setup(state, {
      facilities: userProfileFacilities,
    });

    // The DisplayCernerFacilityAlert should render CernerFacilityAlert which has this test id
    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.exist;
  });

  it('should render DisplayCernerFacilityAlert when pilot flag is enabled but user has no Cerner facilities', async () => {
    const state = {
      ...initialStateMock,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
      },
    };

    const screen = setup(state, {
      facilities: [
        {
          facilityId: '463', // Vista facility
          isCerner: false,
        },
        {
          facilityId: '583', // Vista facility
          isCerner: false,
        },
      ],
    });

    // The DisplayCernerFacilityAlert should render but with no facilities
    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.exist;
  });

  it('should return null when pilot flag is enabled AND user has Cerner facilities', async () => {
    const state = {
      ...initialStateMock,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
      },
    };

    const screen = setup(state, {
      facilities: userProfileFacilities, // includes Cerner facilities
    });

    // The alert should be suppressed
    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.not.exist;

    const newCernerAlert = screen.queryByTestId('new-cerner-facilities-alert');
    expect(newCernerAlert).to.not.exist;
  });

  it('should handle loading state when user facilities are undefined', async () => {
    const state = {
      ...initialStateMock,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
      },
      user: {
        profile: {
          facilities: undefined,
        },
      },
    };

    const screen = renderWithStoreAndRouterV6(
      <OracleHealthPilotCernerFacilityAlert />,
      {
        initialState: state,
        reducers: reducer,
        initialEntries: ['/about'],
      },
    );

    // Should render DisplayCernerFacilityAlert when facilities are undefined
    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.exist;
  });

  it('should pass className prop correctly', async () => {
    const state = {
      ...initialStateMock,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
      },
    };

    const screen = renderWithStoreAndRouterV6(
      <OracleHealthPilotCernerFacilityAlert className="vads-u-margin-top--2" />,
      {
        initialState: {
          ...state,
          user: {
            ...state.user,
            profile: { facilities: userProfileFacilities },
          },
        },
        reducers: reducer,
        initialEntries: ['/about'],
      },
    );

    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.exist;
    expect(cernerAlert).to.have.class('vads-u-margin-top--2');
  });

  it('should handle mixed facilities (both Cerner and Vista)', async () => {
    const state = {
      ...initialStateMock,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
      },
    };

    const mixedFacilities = [
      {
        facilityId: '463', // Vista facility
        isCerner: false,
      },
      {
        facilityId: '668', // Cerner facility
        isCerner: true,
      },
    ];

    const screen = setup(state, {
      facilities: mixedFacilities,
    });

    // Should suppress alert because at least one Cerner facility exists
    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.not.exist;

    const newCernerAlert = screen.queryByTestId('new-cerner-facilities-alert');
    expect(newCernerAlert).to.not.exist;
  });

  it('should handle when drupalCernerFacilities is undefined', async () => {
    const state = {
      ...initialStateMock,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
      },
      drupalStaticData: {
        vamcEhrData: {
          data: {
            ehrDataByVhaId: {},
          },
        },
      },
    };

    const screen = setup(state, {
      facilities: userProfileFacilities,
    });

    // Should render DisplayCernerFacilityAlert when drupal data is incomplete
    const cernerAlert = screen.queryByTestId('cerner-facilities-alert');
    expect(cernerAlert).to.exist;
  });
});
