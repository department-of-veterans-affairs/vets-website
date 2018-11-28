// import _ from 'lodash/fp';
import React from 'react';
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
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}

// disabling jsx-ally/no-noninteractive-tabindex for warning that screen readers should stop on
/* eslint-disable */
export const tabIndexedTitle = title => (<div
  className="schemaform-block-subtitle schemaform-block-title"
  tabIndex="0">
  <p>
    {title}
  </p>
</div>);
/* eslint-enable */
