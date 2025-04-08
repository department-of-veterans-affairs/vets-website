import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import {
  drupalStaticData,
  userProfileFacilities,
} from '../../fixtures/cerner-facility-mock-data.json';
import AcceleratedCernerFacilityAlert from '../../../components/shared/AcceleratedCernerFacilityAlert';
import { CernerAlertContent } from '../../../util/constants';

describe('Accelerated Cerner Facility Alert', () => {
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
    alertLocation = CernerAlertContent.CARE_SUMMARIES_AND_NOTES,
  ) => {
    return renderWithStoreAndRouter(
      <AcceleratedCernerFacilityAlert {...alertLocation} />,
      {
        initialState: {
          ...state,
          user: { ...state.user, profile: facilities },
        },
        reducers: reducer,
      },
    );
  };

  it('hides for integrated pages', () => {
    [
      CernerAlertContent.MR_LANDING_PAGE,
      CernerAlertContent.VITALS,
      CernerAlertContent.ALLERGIES,
    ].forEach(page => {
      const screen = setup(
        undefined,
        {
          facilities: userProfileFacilities,
        },
        page,
      );

      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });

  it('shows for the care summaries and notes page', () => {
    [
      CernerAlertContent.CARE_SUMMARIES_AND_NOTES,
      CernerAlertContent.ALLERGIES,
      CernerAlertContent.VACCINES,
      CernerAlertContent.HEALTH_CONDITIONS,
    ].forEach(async page => {
      const screen = setup(
        undefined,
        {
          facilities: userProfileFacilities,
        },
        page,
      );

      expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    });
  });
});
