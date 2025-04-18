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
  const createFeatureToggles = ({
    isAccelerating = false,
    isAcceleratingAllergies = false,
    isAcceleratingVitals = false,
  }) => ({
    // eslint-disable-next-line camelcase
    mhv_accelerated_delivery_enabled: isAccelerating,
    // eslint-disable-next-line camelcase
    mhv_accelerated_delivery_allergies_enabled: isAcceleratingAllergies,
    // eslint-disable-next-line camelcase
    mhv_accelerated_delivery_vital_signs_enabled: isAcceleratingVitals,
  });
  const initialState = {
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
    featureToggles: createFeatureToggles({
      isAccelerating: true,
      isAcceleratingAllergies: true,
      isAcceleratingVitals: true,
    }),
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
    ].forEach(async page => {
      const screen = setup(
        {
          ...initialState,
          featureToggles: createFeatureToggles({
            isAccelerating: true,
            isAcceleratingAllergies: true,
            isAcceleratingVitals: true,
          }),
        },
        {
          facilities: userProfileFacilities,
        },
        page,
      );

      await expect(screen.queryByTestId('cerner-facilities-alert')).to.not
        .exist;
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
        {
          ...initialState,
          featureToggles: createFeatureToggles({
            isAccelerating: true,
            isAcceleratingAllergies: true,
            isAcceleratingVitals: true,
          }),
        },
        {
          facilities: userProfileFacilities,
        },
        page,
      );

      await expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    });
  });

  it('renders correctly when isAccelerating is false -- always should the modal when accelerating is false', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: false,
        }),
      },
      {
        facilities: userProfileFacilities,
      },
      CernerAlertContent.MR_LANDING_PAGE,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
  });

  it('hides correctly when isAcceleratingVitals is true', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: true,
          isAcceleratingVitals: true,
        }),
        user: { profile: { facilities: [] } },
      },
      { facilities: [] },
      CernerAlertContent.VITALS,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it('hides correctly when isAcceleratingAllergies is true', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: true,
          isAcceleratingAllergies: true,
        }),
        user: { profile: { facilities: [] } },
      },
      { facilities: [] },
      CernerAlertContent.ALLERGIES,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });
});
