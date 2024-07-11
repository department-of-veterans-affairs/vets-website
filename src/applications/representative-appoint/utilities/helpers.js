import React from 'react';
import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import moment from 'moment';
import { isEmpty } from 'lodash';
import formConfig from '../config/form';
import { DATE_FORMAT } from '../definitions/constants';

export const representativeTypeMap = {
  Attorney: 'attorney',
  'Claims Agent': 'claims agent',
  'Veterans Service Organization (VSO)': 'Veterans Service Organization (VSO)',
};

export const checkboxGroupSchemaWithReviewLabels = keys => {
  const schema = checkboxGroupSchema(keys);
  keys.forEach(key => {
    schema.properties[key] = {
      ...schema.properties[key],
      enum: [true, false],
      enumNames: ['Selected', 'Not selected'],
    };
  });
  return schema;
};

export const deviewifyFields = formData => {
  const newFormData = {};
  Object.keys(formData).forEach(key => {
    const nonViewKey = /^view:/.test(key) ? key.replace('view:', '') : key;
    // Recurse if necessary
    newFormData[nonViewKey] =
      typeof formData[key] === 'object' && !Array.isArray(formData[key])
        ? deviewifyFields(formData[key])
        : formData[key];
  });
  return newFormData;
};

export const preparerIsVeteran = ({ formData } = {}) => {
  if (formData) {
    return formData['view:applicantIsVeteran'] === 'Yes';
  }
  return false;
};

export const hasVeteranPrefill = ({ formData } = {}) => {
  return (
    !isEmpty(formData?.['view:veteranPrefillStore']?.fullName) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.dateOfBirth) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.veteranSsnLastFour) &&
    !isEmpty(
      formData?.['view:veteranPrefillStore']?.veteranVaFileNumberLastFour,
    )
  );
};

export const preparerIsVeteranAndHasPrefill = ({ formData }) => {
  if (environment.isLocalhost()) {
    return true;
  }
  return preparerIsVeteran({ formData }) && hasVeteranPrefill({ formData });
};

export const initializeFormDataWithClaimantInformationAndPrefill = (
  applicantIsVeteran,
  veteranPrefillStore,
) => {
  return {
    ...createInitialState(formConfig).data,
    'view:applicantIsVeteran': applicantIsVeteran,
    'view:veteranPrefillStore': veteranPrefillStore,
  };
};

/**
 * Show one thing, have a screen reader say another.
 *
 * @param {ReactElement|ReactComponent|String} srIgnored -- Thing to be displayed visually,
 *                                                           but ignored by screen readers
 * @param {String} substitutionText -- Text for screen readers to say instead of srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => (
  <span>
    <span aria-hidden>{srIgnored}</span>
    <span className="sr-only">{substitutionText}</span>
  </span>
);

export const formatDate = (date, format = DATE_FORMAT) => {
  const m = moment(date);
  return date && m.isValid() ? m.format(format) : 'Unknown';
};
