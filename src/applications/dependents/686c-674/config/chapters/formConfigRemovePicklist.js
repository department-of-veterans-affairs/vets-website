import {
  showV3Picklist,
  hasAwardedDependents,
  isRemovingDependents,
  hasSelectedPicklistItems,
} from '../utilities';

import PicklistRemoveDependents from '../../components/picklist/PicklistRemoveDependents';
import PicklistRemoveDependentFollowup from '../../components/picklist/PicklistRemoveDependentFollowup';
import PicklistRemoveDependentsReview from '../../components/picklist/PicklistRemoveDependentsReview';
import PicklistRemoveDependentFollowupReview from '../../components/picklist/PicklistRemoveDependentFollowupReview';

const MANAGE_DEPENDENTS_PATH = 'options-selection/remove-active-dependents';

// Remove dependents picklist page in optionSelection chapter
export const removeDependentsPicklistOptions = {
  title: 'Manage dependents',
  path: MANAGE_DEPENDENTS_PATH,
  uiSchema: {},
  schema: { type: 'object', properties: {} },
  CustomPage: PicklistRemoveDependents,
  CustomPageReview: PicklistRemoveDependentsReview,
  depends: formData =>
    showV3Picklist(formData) &&
    hasAwardedDependents(formData) &&
    isRemovingDependents(formData),
};

// Remove dependents picklist chapter
export const removeDependentsPicklistFollowupPages = {
  title: 'Remove dependents',
  pages: {
    removeDependentFollowup: {
      title: 'Removing dependents',
      path: 'remove-dependent',
      uiSchema: {},
      schema: { type: 'object', properties: {} },
      CustomPage: PicklistRemoveDependentFollowup,
      CustomPageReview: PicklistRemoveDependentFollowupReview,
      depends: formData =>
        showV3Picklist(formData) &&
        hasAwardedDependents(formData) &&
        hasSelectedPicklistItems(formData) &&
        isRemovingDependents(formData),
      // Force save-in-progress to return to the main picklist page
      returnUrl: `/${MANAGE_DEPENDENTS_PATH}`,
    },
  },
};
