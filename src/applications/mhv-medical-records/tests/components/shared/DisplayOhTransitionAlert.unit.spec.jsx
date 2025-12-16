import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import reducer from '../../../reducers';
import DisplayOhTransitionAlert from '../../../components/shared/DisplayOhTransitionAlert';

describe('DisplayOhTransitionAlert component', () => {
  const defaultDrupalCernerFacilities = [
    { vhaId: '757', ehr: 'cerner', vamcFacilityName: 'Columbus VA' },
    { vhaId: '653', ehr: 'cerner', vamcFacilityName: 'Roseburg VA' },
  ];

  const setup = ({
    featureFlag = false,
    userFacilities = [],
    drupalCernerFacilities = defaultDrupalCernerFacilities,
  } = {}) => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingOhTransitionAlert]: featureFlag,
      },
      user: {
        profile: {
          facilities: userFacilities,
        },
      },
      drupalStaticData: {
        vamcEhrData: {
          data: {
            cernerFacilities: drupalCernerFacilities,
          },
        },
      },
    };

    return renderWithStoreAndRouter(<DisplayOhTransitionAlert />, {
      initialState,
      reducers: reducer,
    });
  };

  it('renders blue OhTransitionAlert when user has VHA_757 and feature flag is ON', () => {
    const { getByTestId } = setup({
      featureFlag: true,
      userFacilities: [{ facilityId: '757' }],
    });

    const blueAlert = getByTestId('oh-transition-alert');
    expect(blueAlert).to.exist;
    expect(blueAlert.getAttribute('status')).to.equal('info');
  });

  it('renders CernerFacilityAlert when user has VHA_757 but feature flag is OFF', () => {
    const { queryByTestId } = setup({
      featureFlag: false,
      userFacilities: [{ facilityId: '757' }],
    });

    // Blue alert should not be present
    const blueAlert = queryByTestId('oh-transition-alert');
    expect(blueAlert).to.not.exist;
  });

  it('renders CernerFacilityAlert when user has other OH facility (not 757) and feature flag is ON', () => {
    const { queryByTestId } = setup({
      featureFlag: true,
      userFacilities: [{ facilityId: '653' }],
    });

    // Blue alert should not be present for non-757 facility
    const blueAlert = queryByTestId('oh-transition-alert');
    expect(blueAlert).to.not.exist;
  });
});
