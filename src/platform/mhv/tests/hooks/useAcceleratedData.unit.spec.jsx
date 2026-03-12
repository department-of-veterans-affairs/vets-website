import React from 'react';
import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import useAcceleratedData from '../../hooks/useAcceleratedData';

// Helper to create a Redux store with the given state
const createMockStore = initialState => {
  const rootReducer = state => state;
  return createStore(rootReducer, initialState);
};

// Helper to render the hook with a Redux store
const renderUseAcceleratedData = initialState => {
  const store = createMockStore(initialState);
  const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return renderHook(() => useAcceleratedData(), { wrapper });
};

// Base state with all flags off and no Cerner facilities
const baseState = {
  featureToggles: {
    [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: false,
    [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled]: false,
    [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryCareNotesEnabled]: false,
    [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryConditionsEnabled]: false,
    [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVitalSignsEnabled]: false,
    [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVaccinesEnabled]: false,
    [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: false,
    [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
    [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: false,
    loading: false,
  },
  drupalStaticData: {
    vamcEhrData: {
      data: {
        cernerFacilities: [],
      },
      loading: false,
    },
  },
  user: {
    profile: {
      facilities: [],
    },
  },
};

describe('useAcceleratedData', () => {
  describe('isLoading', () => {
    it('returns false when both featureToggles.loading and drupalStaticData.vamcEhrData.loading are false', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          loading: false,
        },
        drupalStaticData: {
          vamcEhrData: {
            ...baseState.drupalStaticData.vamcEhrData,
            loading: false,
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isLoading).to.equal(false);
    });

    it('returns true when featureToggles.loading is true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          loading: true,
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isLoading).to.equal(true);
    });

    it('returns true when drupalStaticData.vamcEhrData.loading is true', () => {
      const state = {
        ...baseState,
        drupalStaticData: {
          vamcEhrData: {
            ...baseState.drupalStaticData.vamcEhrData,
            loading: true,
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isLoading).to.equal(true);
    });

    it('returns true when both featureToggles.loading and drupalStaticData.vamcEhrData.loading are true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          loading: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            ...baseState.drupalStaticData.vamcEhrData,
            loading: true,
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isLoading).to.equal(true);
    });
  });

  describe('isCerner', () => {
    it('returns false when user has no facilities', () => {
      const state = {
        ...baseState,
        user: {
          profile: {
            facilities: [],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isCerner).to.equal(false);
    });

    it('returns false when user has facilities but none match cernerFacilities', () => {
      const state = {
        ...baseState,
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [{ vhaId: '456' }],
            },
            loading: false,
          },
        },
        user: {
          profile: {
            facilities: [{ facilityId: '123' }],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isCerner).to.equal(false);
    });

    it('returns true when user has at least one facility matching cernerFacilities', () => {
      const state = {
        ...baseState,
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [{ vhaId: '456' }, { vhaId: '789' }],
            },
            loading: false,
          },
        },
        user: {
          profile: {
            facilities: [{ facilityId: '123' }, { facilityId: '456' }],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isCerner).to.equal(true);
    });
  });

  describe('isAcceleratingLabsAndTests - requires ALL THREE conditions', () => {
    it('returns false when all flags are off', () => {
      const state = baseState;

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(false);
    });

    it('returns false when only isAcceleratedDeliveryEnabled is true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(false);
    });

    it('returns false when only isAcceleratingLabsAndTestsEnabled is true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: true,
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(false);
    });

    it('returns false when only isCerner is true', () => {
      const state = {
        ...baseState,
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [{ vhaId: '456' }],
            },
            loading: false,
          },
        },
        user: {
          profile: {
            facilities: [{ facilityId: '456' }],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(false);
    });

    it('returns false when isAcceleratedDeliveryEnabled and isAcceleratingLabsAndTestsEnabled are true but isCerner is false', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: true,
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(false);
    });

    it('returns false when isAcceleratedDeliveryEnabled and isCerner are true but isAcceleratingLabsAndTestsEnabled is false', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [{ vhaId: '456' }],
            },
            loading: false,
          },
        },
        user: {
          profile: {
            facilities: [{ facilityId: '456' }],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(false);
    });

    it('returns false when isAcceleratingLabsAndTestsEnabled and isCerner are true but isAcceleratedDeliveryEnabled is false', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [{ vhaId: '456' }],
            },
            loading: false,
          },
        },
        user: {
          profile: {
            facilities: [{ facilityId: '456' }],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(false);
    });

    it('returns true when ALL THREE conditions are met', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [{ vhaId: '456' }],
            },
            loading: false,
          },
        },
        user: {
          profile: {
            facilities: [{ facilityId: '456' }],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAcceleratingLabsAndTests).to.equal(true);
    });
  });

  describe('Other domains - require only TWO conditions (NOT isCerner)', () => {
    describe('isAcceleratingAllergies', () => {
      it('returns false when both flags are off', () => {
        const state = baseState;

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingAllergies).to.equal(false);
      });

      it('returns false when only isAcceleratedDeliveryEnabled is true', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingAllergies).to.equal(false);
      });

      it('returns false when only isAcceleratingAllergiesEnabled is true', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled]: true,
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingAllergies).to.equal(false);
      });

      it('returns true when both flags are true (does NOT require isCerner)', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled]: true,
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingAllergies).to.equal(true);
      });

      it('returns true when both flags are true even when isCerner is false', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled]: true,
          },
          drupalStaticData: {
            vamcEhrData: {
              data: {
                cernerFacilities: [{ vhaId: '456' }],
              },
              loading: false,
            },
          },
          user: {
            profile: {
              facilities: [{ facilityId: '123' }], // Does NOT match Cerner
            },
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingAllergies).to.equal(true);
      });
    });

    describe('isAcceleratingVitals', () => {
      it('returns false when both flags are off', () => {
        const state = baseState;

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingVitals).to.equal(false);
      });

      it('returns true when both flags are true (does NOT require isCerner)', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVitalSignsEnabled]: true,
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingVitals).to.equal(true);
      });
    });

    describe('isAcceleratingVaccines', () => {
      it('returns false when both flags are off', () => {
        const state = baseState;

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingVaccines).to.equal(false);
      });

      it('returns true when both flags are true (does NOT require isCerner)', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVaccinesEnabled]: true,
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingVaccines).to.equal(true);
      });
    });

    describe('isAcceleratingCareNotes', () => {
      it('returns false when both flags are off', () => {
        const state = baseState;

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingCareNotes).to.equal(false);
      });

      it('returns true when both flags are true (does NOT require isCerner)', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryCareNotesEnabled]: true,
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingCareNotes).to.equal(true);
      });
    });

    describe('isAcceleratingConditions', () => {
      it('returns false when both flags are off', () => {
        const state = baseState;

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingConditions).to.equal(false);
      });

      it('returns true when both flags are true (does NOT require isCerner)', () => {
        const state = {
          ...baseState,
          featureToggles: {
            ...baseState.featureToggles,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
            [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryConditionsEnabled]: true,
          },
        };

        const { result } = renderUseAcceleratedData(state);

        expect(result.current.isAcceleratingConditions).to.equal(true);
      });
    });
  });

  describe('isAccelerating - aggregate flag', () => {
    it('returns false when all domain flags are false', () => {
      const state = baseState;

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAccelerating).to.equal(false);
    });

    it('returns true when isAcceleratingAllergies is true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled]: true,
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAccelerating).to.equal(true);
    });

    it('returns true when isAcceleratingVitals is true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVitalSignsEnabled]: true,
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAccelerating).to.equal(true);
    });

    it('returns true when isAcceleratingLabsAndTests is true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [{ vhaId: '456' }],
            },
            loading: false,
          },
        },
        user: {
          profile: {
            facilities: [{ facilityId: '456' }],
          },
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAccelerating).to.equal(true);
    });

    it('returns true when multiple domain flags are true', () => {
      const state = {
        ...baseState,
        featureToggles: {
          ...baseState.featureToggles,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryAllergiesEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVitalSignsEnabled]: true,
          [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryVaccinesEnabled]: true,
        },
      };

      const { result } = renderUseAcceleratedData(state);

      expect(result.current.isAccelerating).to.equal(true);
    });
  });
});
