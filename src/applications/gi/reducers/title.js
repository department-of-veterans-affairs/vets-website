import isBrandConsolidationEnabled from '../../../platform/brand-consolidation/feature-flag';

import { SET_PAGE_TITLE } from '../actions';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

const INITIAL_STATE = `GI Bill Comparison Tool: ${propertyName}`;

export default function(state = INITIAL_STATE, action) {
  if (action.type === SET_PAGE_TITLE) {
    window.document.title = action.title || INITIAL_STATE;
    return action.title;
  }
  return state;
}
