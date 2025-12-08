import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import AcceleratedCernerFacilityAlert from '../../components/CernerFacilityAlert/AcceleratedCernerFacilityAlert';
import { CernerAlertContent } from '../../components/CernerFacilityAlert/constants';
import mockData from '../fixtures/cerner-facility-mock-data.json';

describe('AcceleratedCernerFacilityAlert', () => {
  const createFeatureToggles = ({
    isAccelerating = false,
    isAcceleratingAllergies = false,
    isAcceleratingVitals = false,
    isAcceleratingVaccines = false,
    isAcceleratingCareNotes = false,
    isAcceleratingConditions = false,
    isAcceleratingMedications = false,
    isAcceleratingSecureMessaging = false,
    isAcceleratingLabs = false,
  }) => ({
    /* eslint-disable camelcase */
    mhv_accelerated_delivery_enabled: isAccelerating,
    mhv_accelerated_delivery_allergies_enabled: isAcceleratingAllergies,
    mhv_accelerated_delivery_vital_signs_enabled: isAcceleratingVitals,
    mhv_accelerated_delivery_vaccines_enabled: isAcceleratingVaccines,
    mhv_accelerated_delivery_care_summaries_and_notes_enabled: isAcceleratingCareNotes,
    mhv_accelerated_delivery_conditions_enabled: isAcceleratingConditions,
    mhv_accelerated_delivery_labs_and_tests_enabled: isAcceleratingLabs,
    mhv_medications_cerner_pilot: isAcceleratingMedications,
    mhv_secure_messaging_cerner_pilot: isAcceleratingSecureMessaging,
    /* eslint-enable camelcase */
  });

  const initialState = {
    drupalStaticData: mockData.drupalStaticData,
    featureToggles: createFeatureToggles({}),
    user: {
      profile: {
        facilities: [{ facilityId: '668', isCerner: true }],
      },
    },
  };

  const getState = ({
    accelerating = true,
    acceleratingAllergies = true,
    acceleratingVitals = true,
    acceleratingVaccines = true,
    acceleratingCareNotes = true,
    acceleratingConditions = true,
    acceleratingLabs = true,
    acceleratingMedications = true,
    acceleratingSecureMessaging = true,
    userFacilities,
  }) => ({
    ...initialState,
    featureToggles: {
      /* eslint-disable camelcase */
      mhv_accelerated_delivery_enabled: accelerating,
      mhv_accelerated_delivery_allergies_enabled: acceleratingAllergies,
      mhv_accelerated_delivery_vital_signs_enabled: acceleratingVitals,
      mhv_accelerated_delivery_vaccines_enabled: acceleratingVaccines,
      mhv_accelerated_delivery_care_notes_enabled: acceleratingCareNotes,
      mhv_accelerated_delivery_conditions_enabled: acceleratingConditions,
      mhv_accelerated_delivery_labs_and_tests_enabled: acceleratingLabs,
      mhv_medications_cerner_pilot: acceleratingMedications,
      mhv_secure_messaging_cerner_pilot: acceleratingSecureMessaging,
      /* eslint-enable camelcase */
    },
    user: {
      profile: {
        facilities: userFacilities || [{ facilityId: '668', isCerner: true }],
      },
    },
  });

  const setup = (state = initialState, props = {}) => {
    return renderWithStoreAndRouter(
      <AcceleratedCernerFacilityAlert {...props} />,
      {
        initialState: state,
      },
    );
  };

  describe('non-Cerner user', () => {
    it('does not render alert when isCerner is false', () => {
      const screen = setup(
        getState({ userFacilities: [] }),
        CernerAlertContent.VITALS,
      );
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('does not render alert even if isAccelerating is false', () => {
      const screen = setup(
        getState({
          isAccelerating: false,
          acceleratingVitals: false,
          userFacilities: [],
        }),
        CernerAlertContent.VITALS,
      );
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });

  describe('Cerner user, not accelerating', () => {
    // Vitals is decoupled, will not render for any Cerner user
    it('does not render alert on Vitals page', () => {
      const screen = setup(
        getState({ acceleratingVitals: false }),
        CernerAlertContent.VITALS,
      );
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('does not render alert on Allergies page', () => {
      // Allergies is decoupled, will not render for any Cerner user
      const screen = setup(
        getState({ acceleratingAllergies: false }),
        CernerAlertContent.ALLERGIES,
      );
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('renders alert on Vaccines page', () => {
      const screen = setup(
        getState({ acceleratingVaccines: false }),
        CernerAlertContent.VACCINES,
      );
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });

    it('renders alert on Labs and Tests page', () => {
      const screen = setup(
        getState({ acceleratingLabs: false }),
        CernerAlertContent.LABS_AND_TESTS,
      );
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });

    it('renders alert on Care Summaries page', () => {
      const screen = setup(
        getState({ acceleratingCareNotes: false }),
        CernerAlertContent.CARE_SUMMARIES_AND_NOTES,
      );
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });

    it('renders alert on Health Conditions page', () => {
      const screen = setup(
        getState({ acceleratingConditions: false }),
        CernerAlertContent.HEALTH_CONDITIONS,
      );
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });
  });

  describe('Cerner user, accelerating', () => {
    it('does not render alert on Vitals page (integrated)', () => {
      const screen = setup(
        getState({ accelerating: true, acceleratingVitals: true }),
        CernerAlertContent.VITALS,
      );
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('does not render alert on Allergies page (integrated)', () => {
      const screen = setup(initialState, CernerAlertContent.ALLERGIES);
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('renders alert on Labs and Tests page (not integrated)', () => {
      const screen = setup(initialState, CernerAlertContent.LABS_AND_TESTS);
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });
  });

  describe('Cerner user, accelerating multiple domains', () => {
    it('does not render on Vitals page (integrated)', () => {
      const screen = setup(getState({}), CernerAlertContent.VITALS);
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('does not render on Allergies page (integrated)', () => {
      const screen = setup(getState({}), CernerAlertContent.ALLERGIES);
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('does not render on Vaccines page (integrated)', () => {
      const screen = setup(getState({}), CernerAlertContent.VACCINES);
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('does not render on Care Summaries page (integrated)', () => {
      const screen = setup(
        getState({}),
        CernerAlertContent.CARE_SUMMARIES_AND_NOTES,
      );
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('renders on Labs and Tests page (not integrated)', () => {
      const screen = setup(
        getState({ acceleratingLabs: false }),
        CernerAlertContent.LABS_AND_TESTS,
      );
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });

    it('renders on Health Conditions page (not integrated)', () => {
      const screen = setup(
        getState({ acceleratingConditions: false }),
        CernerAlertContent.HEALTH_CONDITIONS,
      );
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });
  });

  describe('MR Landing Page', () => {
    it('does not render alert on landing page when accelerating', () => {
      const screen = setup(
        getState({ accelerating: true }),
        CernerAlertContent.MR_LANDING_PAGE,
      );
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });
});
