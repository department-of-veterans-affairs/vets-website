import * as Sentry from '@sentry/browser';
import { capitalize } from 'lodash';
import DEFAULT_BRANCH_LABELS from 'platform/forms-system/src/js/web-component-patterns/content/serviceBranch.json';

// Custom sanitizer to strip view fields, empty objects, and normalize country codes
const sanitize = (key, value) => {
  // Remove view: fields
  if (key.startsWith('view:')) {
    return undefined;
  }

  // Remove empty objects
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const keys = Object.keys(value);
    if (keys.length === 0 || keys.every(k => value[k] === undefined)) {
      return undefined;
    }
  }

  return value;
};

export const transform = (formConfig, form) => {
  const {
    veteranInformation,
    burialInformation,
    periods,
    previousNames,
    certification,
    remarks,
  } = form?.data;

  // Breaking out burial information to fit submissionObject
  const {
    dateOfBurial,
    nameOfStateCemeteryOrTribalOrganization,
    placeOfBurial,
    recipientOrganization,
  } = burialInformation;
  const { stateCemeteryOrTribalCemeteryName, cemeteryLocation } = placeOfBurial;
  const stateCemeteryOrTribalCemeteryLocation = `${cemeteryLocation?.city}, ${
    cemeteryLocation?.state
  }`;
  const { name, phoneNumber, address } = recipientOrganization;

  const servedUnderDifferentName = previousNames?.reduce((acc, val) => {
    const { previousName, servicePeriod } = val;
    const parts = [
      capitalize(previousName?.first),
      capitalize(previousName?.middle),
      capitalize(previousName?.last),
    ].filter(Boolean);
    const formattedName = parts?.join(' ');

    // Add service period if provided
    const nameWithService = servicePeriod
      ? `${formattedName}, Service Periods: ${servicePeriod}`
      : formattedName;

    return `${acc ? `${acc}; ` : ''}${nameWithService}`;
  }, '');

  // convert service period branch name to label
  // Handle optional periods - default to empty array if not provided
  const convertedServicePeriods = (periods || []).map(period => {
    const { label } = DEFAULT_BRANCH_LABELS[period.serviceBranch];
    const serviceBranch = label ?? period.serviceBranch;
    return {
      ...period,
      serviceBranch,
    };
  });

  // Fit into subbmission object
  try {
    const submissionObj = {
      veteranInformation,
      burialInformation: {
        nameOfStateCemeteryOrTribalOrganization,
        dateOfBurial,
        placeOfBurial: {
          stateCemeteryOrTribalCemeteryName,
          stateCemeteryOrTribalCemeteryLocation,
        },
        recipientOrganization: {
          name,
          phoneNumber,
          address: {
            streetAndNumber: address.street,
            aptOrUnitNumber: address.street2,
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
          },
        },
      },
      veteranServicePeriods: {
        periods: convertedServicePeriods,
        servedUnderDifferentName,
      },
      certification,
      remarks,
    };

    return JSON.stringify(submissionObj, sanitize);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`Transform Failed: ${error}`);
    });
    return 'Transform failed, see sentry for details';
  }
};
