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
/* eslint-disable */
export const tabbableTitle = title => (<div
  className="schemaform-block-header"
  tabIndex="0">
  <p
    className="schemaform-block-title schemaform-block-subtitle"
    id="root_view:optOutMessage__title">
    {title}
  </p>
</div>);
/* eslint-enable */
