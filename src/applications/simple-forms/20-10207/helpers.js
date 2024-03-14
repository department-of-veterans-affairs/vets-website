import moment from 'moment';

import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { focusElement } from 'platform/utilities/ui';

import { PREPARER_TYPES } from './config/constants';

export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}

export function getPreparerString(preparerType) {
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return 'Veteran’s';
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return 'Claimant’s';
    default:
      return 'Your';
  }
}

export function getPersonalInformationChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);

  return `${preparerString} personal information`;
}

export function getFullNameLabels(label) {
  if (label === 'middle name') {
    return 'Middle initial';
  }

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function getNameAndDobPageTitle(formData) {
  const { preparerType } = formData;
  const titleEnding = 'name and date of birth';
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return `Veteran’s ${titleEnding}`;
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return `Claimant’s ${titleEnding}`;
    default:
      return 'Your name and date of birth';
  }
}

export function getNameAndDobPageDescription(formData) {
  const { preparerType } = formData;
  switch (preparerType) {
    case PREPARER_TYPES.NON_VETERAN:
      return 'Please provide your information as the person with the claim.';
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return 'Please provide the Veteran’s information.';
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return 'Please provide information on the person with the claim (also called the claimant).';
    default:
      return 'Please provide your information as the Veteran.';
  }
}

export function getIdentityInfoPageTitle(formData) {
  const { preparerType } = formData;
  const titleEnding = 'identification information';
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return `Veteran’s ${titleEnding}`;
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return `Claimant’s ${titleEnding}`;
    default:
      return `Your ${titleEnding}`;
  }
}

export function getVeteranIdentityInfoPageTitle(formData) {
  const titleEnding = 'identification information';
  return formData.preparerType === PREPARER_TYPES.VETERAN
    ? `Your ${titleEnding}`
    : `Veteran’s ${titleEnding}`;
}

export function getLivingSituationChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} living situation`;
}

export function validateLivingSituation(errors, fields) {
  const selectedSituations = Object.keys(fields.livingSituation).filter(
    key => fields.livingSituation[key],
  );
  let preparerString = '';
  switch (fields.preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      preparerString = 'the Veteran';
      break;
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      preparerString = 'the Claimant';
      break;
    default:
      preparerString = 'you';
      break;
  }

  // We're just checking to make sure no other option's selected along with NONE here
  // schema's required prop already handles required error-message
  if (selectedSituations.length > 1 && selectedSituations.includes('NONE')) {
    errors.livingSituation.addError(
      `If none of these situations apply to ${preparerString}, unselect the other options you selected`,
    );
  }
}

export function getContactInfoChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} contact information`;
}

export function getMailindAddressPageTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} mailing address`;
}

export function getPhoneAndEmailPageTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} phone and email address`;
}

export function createPayload(file, formId, password) {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  if (password) {
    payload.append('password', password);
  }
  return payload;
}

export function parseResponse({ data }) {
  const { name } = data.attributes;
  const focusFileCard = () => {
    const target = $$('.schemaform-file-list li').find(entry =>
      entry.textContent?.trim().includes(name),
    );

    if (target) {
      focusElement(target);
    }
  };

  setTimeout(() => {
    focusFileCard();
  }, 100);

  return {
    name,
    confirmationCode: data.attributes.confirmationCode,
  };
}

export function dateOfDeathValidation(errors, fields) {
  const { veteranDateOfBirth, veteranDateOfDeath } = fields;
  const dob = moment(veteranDateOfBirth);
  const dod = moment(veteranDateOfDeath);

  if (dod.isBefore(dob)) {
    errors.veteranDateOfDeath.addError(
      'Provide a date that is after the date of birth',
    );
  }
}

export function powConfinementDateRangeValidation(errors, fields) {
  const { powConfinementStartDate, powConfinementEndDate } = fields;
  const startDate = moment(powConfinementStartDate);
  const endDate = moment(powConfinementEndDate);

  if (!!endDate && !!startDate && endDate.isSameOrBefore(startDate)) {
    errors.powConfinementEndDate.addError(
      'The end date must be after the start date',
    );
  }
}

export function powConfinement2DateRangeValidation(errors, fields) {
  const { powConfinement2StartDate, powConfinement2EndDate } = fields;
  const startDate = moment(powConfinement2StartDate);
  const endDate = moment(powConfinement2EndDate);

  if (!!endDate && !!startDate && endDate.isSameOrBefore(startDate)) {
    errors.powConfinement2EndDate.addError(
      'The end date must be after the start date',
    );
  }
}

export const statementOfTruthFullNamePath = ({ formData }) => {
  const { preparerType } = formData;
  switch (preparerType) {
    case PREPARER_TYPES.VETERAN:
      return 'veteranFullName';
    case PREPARER_TYPES.NON_VETERAN:
      return 'nonVeteranFullName';
    default:
      return 'thirdPartyFullName';
  }
};

export const getSubmitterName = formData => {
  const { preparerType } = formData;
  switch (preparerType) {
    case PREPARER_TYPES.VETERAN:
      return formData.veteranFullName;
    case PREPARER_TYPES.NON_VETERAN:
      return formData.nonVeteranFullName;
    default:
      return formData.thirdPartyFullName;
  }
};
