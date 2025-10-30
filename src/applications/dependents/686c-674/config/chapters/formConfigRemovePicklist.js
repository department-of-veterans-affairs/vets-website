import {
  showV3Picklist,
  hasAwardedDependents,
  isRemovingDependents,
  hasSelectedPicklistItems,
} from '../utilities';

import PicklistRemoveDependents from '../../components/PicklistRemoveDependents';
import PicklistRemoveDependentFollowup from '../../components/PicklistRemoveDependentFollowup';
import PicklistRemoveDependentFollowupReview from '../../components/PicklistRemoveDependentsReview';

// Remove dependents picklist page in optionSelection chapter
export const removeDependentsPicklistOptions = {
  title: 'Manage dependents',
  path: 'options-selection/remove-active-dependents',
  uiSchema: {},
  schema: { type: 'object', properties: {} },
  CustomPage: PicklistRemoveDependents,
  CustomPageReview: PicklistRemoveDependentFollowupReview,
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
      CustomPageReview: null,
      depends: formData =>
        showV3Picklist(formData) &&
        hasAwardedDependents(formData) &&
        hasSelectedPicklistItems(formData),
    },
  },
};
