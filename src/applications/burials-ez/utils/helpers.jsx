import React from 'react';
import PropTypes from 'prop-types';
import { endOfDay } from 'date-fns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';

import {
  checkboxGroupSchema,
  fullNameUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateBenefitsIntakeName } from './validation';

export const generateTitle = text => {
  return <h3 className="vads-u-margin-top--0 vads-u-color--base">{text}</h3>;
};

export const generateHelpText = (
  text,
  className = 'vads-u-color--gray vads-u-font-size--md',
) => {
  return <span className={className}>{text}</span>;
};

/**
 * Function to generate UI Schema and Schema for death facility information
 * @param {string} facilityKey - Key for death facility in the schema
 * @param {string} facilityName - Name for the facility in UI
 * @returns {Object} - Object containing uiSchema and schema
 */
export const generateDeathFacilitySchemas = (
  facilityKey,
  facilityName = 'Default Facility Name',
) => {
  return {
    uiSchema: {
      'ui:title': generateTitle('Veteran death location details'),
      [facilityKey]: {
        facilityName: textUI({
          title: `Name of ${facilityName}`,
          errorMessages: {
            required: `Enter the Name of ${facilityName}`,
          },
        }),
        facilityLocation: textUI({
          title: `Location of ${facilityName}`,
          hint: 'City and state',
          errorMessages: {
            required: `Enter the city and state of ${facilityName}`,
          },
        }),
      },
    },
    schema: {
      type: 'object',
      properties: {
        [facilityKey]: {
          type: 'object',
          required: ['facilityName', 'facilityLocation'],
          properties: {
            facilityName: textSchema,
            facilityLocation: textSchema,
          },
        },
      },
    },
  };
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

export const benefitsIntakeFullNameUI = (formatTitle, uiOptions = {}) => {
  let uiSchema = fullNameUI(formatTitle, uiOptions);
  ['first', 'last'].forEach(part => {
    const validations = [
      ...get([part, 'ui:validations'], uiSchema),
      validateBenefitsIntakeName,
    ];
    uiSchema = set(`${part}.ui:validations`, validations, uiSchema);
  });
  return uiSchema;
};

export const isProductionEnv = () => {
  return (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  );
};

export const pageAndReviewTitle = title => ({
  title,
  reviewTitle: () => <span className="vads-u-font-size--h3">{title}</span>,
});

// Elizabeth Dole Act law change for VA Home Hospice; ignoring start date of
// July 1, 2025 to immediately
const endDate = endOfDay(new Date('2026-09-30')).getTime();

export const showDeathCertificateRequiredPage = form => {
  const isClaimingBurialAllowance =
    form['view:claimedBenefits']?.burialAllowance;
  const serviceRequested = form.burialAllowanceRequested?.service === true;
  const locationIsVaMedicalCenter =
    form.locationOfDeath?.location === 'vaMedicalCenter';
  return !(
    isClaimingBurialAllowance &&
    serviceRequested &&
    locationIsVaMedicalCenter
  );
};

export const showHomeHospiceCarePage = form => {
  const dayOfDeath = get('deathDate', form);
  if (!dayOfDeath) {
    return false;
  }
  const date = new Date(dayOfDeath).getTime();
  return get('locationOfDeath.location', form) === 'atHome' && date <= endDate;
};

export const showHomeHospiceCareAfterDischargePage = form =>
  get('locationOfDeath.location', form) === 'atHome' &&
  get('homeHospiceCare', form);

export const DateReviewField = ({ children, title = '' }) => (
  <div className="review-row">
    <dt>{title}</dt>
    <dd className="dd-privacy-hidden" data-dd-action-name={title}>
      {children.props.formData && (
        <>
          {new Date(`${children.props.formData}T00:00:00`).toLocaleDateString(
            'en-us',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )}
        </>
      )}
    </dd>
  </div>
);

DateReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      formData: PropTypes.string,
    }).isRequired,
  }).isRequired,
  title: PropTypes.string,
};

export const showPdfFormAlignment = () =>
  window.sessionStorage.getItem('showPdfFormAlignment') === 'true';

export const maskBankInformation = (string, unmaskedLength) => {
  if (!string) {
    return '';
  }
  const repeatCount =
    string.length > unmaskedLength ? string.length - unmaskedLength : 0;
  const maskedPart = '●'.repeat(repeatCount);
  const unmaskedPart = string.slice(-unmaskedLength);
  return `${maskedPart}${unmaskedPart}`;
};
