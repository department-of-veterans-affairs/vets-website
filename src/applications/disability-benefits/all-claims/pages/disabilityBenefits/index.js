import captureEvents from '../../analytics-functions';

import {
  addDisabilities,
  claimType,
  newDisabilityFollowUp,
  ratedDisabilities,
} from '..';

import {
  capitalizeEachWord,
  claimingNew,
  DISABILITY_SHARED_CONFIG,
  hasRatedDisabilities,
  isDisabilityPtsd,
  showNewlyBDDPages,
} from '../../utils';

import { NULL_CONDITION_STRING } from '../../constants';

import { disabilitiesOrientation } from '../../content/disabilitiesOrientation';

export const disabilityBenefitsWorkflow = {
  claimType: {
    title: 'Reason for claim',
    path: 'claim-type',
    depends: formData => hasRatedDisabilities(formData),
    uiSchema: claimType.uiSchema,
    schema: claimType.schema,
    onContinue: captureEvents.claimType,
  },
  disabilitiesOrientation: {
    title: '',
    path: DISABILITY_SHARED_CONFIG.orientation.path,
    depends: formData => DISABILITY_SHARED_CONFIG.orientation.depends(formData),
    uiSchema: { 'ui:description': disabilitiesOrientation },
    schema: { type: 'object', properties: {} },
  },
  ratedDisabilities: {
    title: 'Existing conditions (rated disabilities)',
    path: DISABILITY_SHARED_CONFIG.ratedDisabilities.path,
    depends: formData =>
      DISABILITY_SHARED_CONFIG.ratedDisabilities.depends(formData),
    uiSchema: ratedDisabilities.uiSchema,
    schema: ratedDisabilities.schema,
  },
  addDisabilities: {
    title: 'Add a new disability',
    path: DISABILITY_SHARED_CONFIG.addDisabilities.path,
    depends: formData =>
      DISABILITY_SHARED_CONFIG.addDisabilities.depends(formData),
    uiSchema: addDisabilities.uiSchema,
    schema: addDisabilities.schema,
    updateFormData: addDisabilities.updateFormData,
    appStateSelector: state => ({
      // needed for validateDisabilityName to work properly on the review
      // & submit page. Validation functions are provided the pageData and
      // not the formData on the review & submit page. For more details
      // see https://dsva.slack.com/archives/CBU0KDSB1/p1614182869206900
      newDisabilities: state.form?.data?.newDisabilities || [],
    }),
  },
  followUpDesc: {
    title: 'Follow-up questions',
    depends: formData => claimingNew(formData) && showNewlyBDDPages(formData),
    path: 'new-disabilities/follow-up',
    uiSchema: {
      'ui:description':
        'Now we’re going to ask you some follow-up questions about each of your conditions. We’ll go through them one by one.',
    },
    schema: { type: 'object', properties: {} },
  },
  newDisabilityFollowUp: {
    title: formData =>
      typeof formData.condition === 'string'
        ? capitalizeEachWord(formData.condition)
        : NULL_CONDITION_STRING,
    depends: claimingNew,
    path: 'new-disabilities/follow-up/:index',
    showPagePerItem: true,
    itemFilter: (item, formData) => {
      if (formData?.syncModern0781Flow === true) {
        return !!item.condition;
      }
      return !isDisabilityPtsd(item.condition);
    },
    arrayPath: 'newDisabilities',
    uiSchema: newDisabilityFollowUp.uiSchema,
    schema: newDisabilityFollowUp.schema,
  },
};
