import _ from 'lodash/fp';

import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function prefillTransformer(pages, formData, metadata) {
  // TODO: enable this to implement the review card UI for verified users
  // TODO: add 'state' to arguments

  // const { verified } = state.user.profile;

  // const newFormData = _.set('view:isVerified', !!verified, formData);

  return {
    metadata,
    formData,
    pages,
  };
}

export function transform(formConfig, form) {
  // Clone the form in so we don’t modify the original...because of reasons FP
  const newForm = _.cloneDeep(form);

  const formData = transformForSubmit(formConfig, newForm);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}
