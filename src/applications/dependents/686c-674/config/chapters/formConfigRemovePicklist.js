import {
  showV3Picklist,
  hasAwardedDependents,
  isRemovingDependents,
} from '../utilities';

import PicklistRemoveDependents from '../../components/PicklistRemoveDependents';

import removeDependentPicklist from './picklist/removeDependentPicklist';

export const removeDependentsPicklistOptions = {
  title: 'Manage dependents',
  path: 'options-selection/remove-active-dependents',
  uiSchema: removeDependentPicklist.uiSchema,
  schema: removeDependentPicklist.schema,
  CustomPage: PicklistRemoveDependents,
  CustomPageReview: null,
  depends: formData =>
    showV3Picklist(formData) &&
    hasAwardedDependents(formData) &&
    isRemovingDependents(formData),
};

export const removeDependentsPicklistPages = {
  title: 'Remove dependents',
  pages: {
    removeSpouseFollowup: {},
    removeChildFollowup: {},
  },
};
