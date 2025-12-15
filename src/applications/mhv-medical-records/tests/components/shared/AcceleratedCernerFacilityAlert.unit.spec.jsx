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
    isAcceleratingCareNotes = false,
    isAcceleratingConditions = false,
  }) => ({
    /* eslint-disable camelcase */
    mhv_accelerated_delivery_enabled: isAccelerating,
    mhv_accelerated_delivery_allergies_enabled: isAcceleratingAllergies,
    mhv_accelerated_delivery_vital_signs_enabled: isAcceleratingVitals,
    mhv_accelerated_delivery_care_summaries_and_notes_enabled: isAcceleratingCareNotes,
    mhv_accelerated_delivery_conditions_enabled: isAcceleratingConditions,
    /* eslint-enable camelcase */
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
      isAcceleratingVitals: false,
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
      CernerAlertContent.HEALTH_CONDITIONS,
    ].forEach(async page => {
      const screen = setup(
        {
          ...initialState,
          featureToggles: createFeatureToggles({
            isAccelerating: true,
            isAcceleratingAllergies: true,
            isAcceleratingVitals: true,
            isAcceleratingConditions: true,
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
            isAcceleratingConditions: true,
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

  it('hides on landing page for Cerner users even when acceleration is false', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: false,
        }),
      },
      {
        facilities: userProfileFacilities, // Cerner user
      },
      CernerAlertContent.MR_LANDING_PAGE,
    );

    // Should hide because Cerner users always have their data working
    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it('hides correctly when isCerner is true', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: true,
          isAcceleratingVitals: false,
        }),
        user: { profile: { facilities: userProfileFacilities } },
      },
      { facilities: userProfileFacilities },
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

  it('hides correctly when isAcceleratingLabsAndTest is false', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: true,
          isAcceleratingLabsAndTest: false,
        }),
        user: { profile: { facilities: [] } },
      },
      { facilities: [] },
      CernerAlertContent.LABS_AND_TESTS,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it('hides yellow Alert correctly', () => {
    const screen = setup(
      {
        ...initialState,
        user: { profile: { facilities: [] } },
      },
      { facilities: [] },
      CernerAlertContent.VACCINES,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it('hides correctly when isAcceleratingCareNotes is true', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: true,
          isAcceleratingCareNotes: true,
        }),
        user: { profile: { facilities: [] } },
      },
      { facilities: [] },
      CernerAlertContent.CARE_SUMMARIES_AND_NOTES,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it('hides correctly when isAcceleratingConditions is true', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: true,
          isAcceleratingConditions: true,
        }),
        user: { profile: { facilities: [] } },
      },
      { facilities: [] },
      CernerAlertContent.HEALTH_CONDITIONS,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
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

  it('hides for Cerner users on allergies page (not accelerating)', () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: createFeatureToggles({
          isAccelerating: true,
          isAcceleratingAllergies: false,
        }),
        drupalStaticData,
      },
      {
        facilities: userProfileFacilities,
      },
      CernerAlertContent.ALLERGIES,
    );

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });
});
