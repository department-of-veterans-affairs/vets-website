import {
  TOGGLE_BRAND_CONSOLIDATION_ENABLED
} from '../../brand-consolidation/actions/dev';

const initialState = {
  brandConsolidation: {
    enabled: false
  },
  ...window.settings
};

export default function buildSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_BRAND_CONSOLIDATION_ENABLED:
      return {
        ...state,
        brandConsolidation: {
          ...state.brandConsolidation,
          enabled: !state.brandConsolidation.enabled
        }
      };

    default:
      return state;
  }
}
