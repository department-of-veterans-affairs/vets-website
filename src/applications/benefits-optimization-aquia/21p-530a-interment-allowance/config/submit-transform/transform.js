import * as Sentry from '@sentry/browser';
import { capitalize } from 'lodash';

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

  // TODO - wait for endpoint update and drop this
  // Truncate country fields to 2 characters (ISO 3166-1 alpha-2 format)
  if (
    key.toLowerCase().includes('country') &&
    typeof value === 'string' &&
    value.length > 2
  ) {
    return value.substring(0, 2);
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

  const servedUnderDifferentName = previousNames?.reduce((acc, name) => {
    const { previousName } = name;
    const parts = [
      capitalize(previousName?.first),
      capitalize(previousName?.middle),
      capitalize(previousName?.last),
    ].filter(Boolean);
    const formattedName = parts?.join(' ');
    return `${acc ? `${acc}, ` : ''}${formattedName}`;
  }, '');

  // Fit into subbmission object
  try {
    const submissionObj = {
      veteranInformation,
      burialInformation,
      veteranServicePeriods: {
        periods,
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
