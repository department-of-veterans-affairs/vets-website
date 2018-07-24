import _ from 'lodash/fp';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function prefillTransformer(pages, formData, metadata, state) {
  const { verified } = state.user.profile;

  const newFormData = _.set('verified', !!verified, formData);

  return {
    metadata,
    formData: newFormData,
    pages
  };
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}
