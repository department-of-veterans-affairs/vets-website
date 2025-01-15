import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import {
  drupalStaticData,
  userProfileFacilities,
  userProfileMultipleCernerFacilities,
} from '../../fixtures/cerner-facility-mock-data.json';
import CernerFacilityAlert from '../../../components/shared/CernerFacilityAlert';
import { CernerAlertContent } from '../../../util/constants';

describe('Cerner Facility Alert', () => {
  const initialState = {
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
    featureToggles: [],
  };

  const setup = (
    state = initialState,
    facilities = { facilities: [] },
    alertLocation = CernerAlertContent.MR_LANDING_PAGE,
  ) => {
    return renderWithStoreAndRouter(
      <CernerFacilityAlert {...alertLocation} />,
      {
        initialState: {
          ...state,
          user: { ...state.user, profile: facilities },
        },
        reducers: reducer,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup(undefined, {
      facilities: userProfileFacilities,
    });
    expect(screen).to.exist;
  });

  it(`does not render CernerFacilityAlert if cernerFacilities is empty`, async () => {
    const screen = setup();

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it(`renders CernerFacilityAlert with list of facilities if cernerFacilities.length > 1`, async () => {
    const screen = setup(undefined, {
      facilities: userProfileMultipleCernerFacilities,
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    expect(
      screen.getByText(
        'Some of your medical records may be in a different portal. To get your medical records from these facilities, go to My VA Health:',
      ),
    ).to.exist;
    const facilityList = screen.getAllByTestId('cerner-facility');
    expect(facilityList.length).to.equal(2);
    expect(screen.getByText('VA Spokane health care')).to.exist;
    expect(screen.getByText('VA Southern Oregon health care')).to.exist;
  });

  it(`renders CernerFacilityAlert with 1 facility if cernerFacilities.length === 1`, async () => {
    const screen = setup(
      undefined,
      {
        facilities: userProfileFacilities,
      },
      CernerAlertContent.VACCINES,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;

    expect(
      screen.getByTestId('single-cerner-facility-text').textContent,
    ).to.contain(
      'get your vaccines from VA Spokane health care, go to My VA Health.',
    );
  });
});
