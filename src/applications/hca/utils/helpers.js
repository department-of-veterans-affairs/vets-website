/* eslint-disable no-console */
import mapValues from 'lodash/mapValues';
import moment from 'moment';
import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';

import set from 'platform/utilities/data/set';
import recordEvent from 'platform/monitoring/record-event';
import {
  stringifyFormReplacer,
  filterViewFields,
  filterInactivePageData,
  getActivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { getInactivePages } from 'platform/forms/helpers';
import { isInMPI } from 'platform/user/selectors';

import {
  IS_LOGGED_IN,
  USER_DOB,
  IS_GTE_HIGH_DISABILITY,
  IS_SHORT_FORM_ENABLED,
  IS_COMPENSATION_TYPE_HIGH,
  IS_VETERAN_IN_MVI,
} from './constants';

// clean address so we only get address related properties then return the object
const cleanAddressObject = address => {
  if (!address) return null;
  // take the address data we want from profile
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
    countryCodeIso3,
  } = address;

  /* make the address data match the schema
   fields expect undefined NOT null */
  return {
    street: addressLine1,
    street2: addressLine2 || undefined,
    street3: addressLine3 || undefined,
    city,
    postalCode: zipCode,
    country: countryCodeIso3,
    state: stateCode,
  };
};

// map necessary data from prefill into our form data
export function prefillTransformer(pages, formData, metadata, state) {
  const {
    residentialAddress,
    mailingAddress,
  } = state.user.profile?.vapContactInfo;

  /* mailingAddress === veteranAddress 
     residentialAddress === veteranHomeAddress */
  const cleanedResidentialAddress = cleanAddressObject(residentialAddress);
  const cleanedMailingAddress = cleanAddressObject(mailingAddress);
  const doesAddressMatch =
    JSON.stringify(cleanedResidentialAddress) ===
    JSON.stringify(cleanedMailingAddress);

  let newData = formData;

  if (isInMPI(state)) {
    newData = { ...newData, 'view:isUserInMvi': true };
  }

  if (mailingAddress) {
    // spread in permanentAddress (mailingAddress) from profile if it exist
    newData = { ...newData, veteranAddress: cleanedMailingAddress };
  }

  /* auto-fill doesPermanentAddressMatchMailing yes/no field
   does not get sent to api due to being a view do not need to guard */
  newData = {
    ...newData,
    'view:doesMailingMatchHomeAddress': doesAddressMatch,
  };

  // if either of the addresses are not present we should not fill the yes/no comparison since it will always be false
  if (!cleanedMailingAddress || !cleanedResidentialAddress) {
    newData = {
      ...newData,
      'view:doesMailingMatchHomeAddress': undefined,
    };
  }

  // if residentialAddress && addresses are not the same auto fill mailing address
  if (residentialAddress && !doesAddressMatch) {
    newData = { ...newData, veteranHomeAddress: cleanedResidentialAddress };
  }

  return {
    metadata,
    formData: newData,
    pages,
  };
}

// map necessary attachment data for submission
export function transformAttachments(data) {
  if (!data.attachments || !(data.attachments instanceof Array)) {
    return data;
  }
  const transformedAttachments = data.attachments.map(attachment => {
    const { name, size, confirmationCode, attachmentId } = attachment;
    return {
      name,
      size,
      confirmationCode,
      dd214: attachmentId === '1',
    };
  });
  return { ...data, attachments: transformedAttachments };
}

// strip, clean and map necessary data for submission
export function transform(formConfig, form) {
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    form.data,
  );
  const activePages = getActivePages(expandedPages, form.data);
  const inactivePages = getInactivePages(expandedPages, form.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    form,
  );
  let withoutViewFields = filterViewFields(withoutInactivePages);
  const addressesMatch = form.data['view:doesMailingMatchHomeAddress'];

  // add back veteran name, dob & ssn, because it could have been removed in filterInactivePages
  const requiredFields = [
    'veteranFullName',
    'veteranDateOfBirth',
    'veteranSocialSecurityNumber',
  ];
  requiredFields.forEach(name => {
    if (!withoutViewFields[name]) {
      withoutViewFields = set(
        name,
        form.loadedData.formData[name],
        withoutViewFields,
      );
    }
  });

  // add back dependents here, because it could have been removed in filterViewFields
  if (!withoutViewFields.dependents) {
    withoutViewFields = set('dependents', [], withoutViewFields);
  }

  // convert `attachmentId` values to a `dd214` boolean
  if (withoutViewFields.attachments) {
    withoutViewFields = transformAttachments(withoutViewFields);
  }

  // duplicate address before submit if they are the same
  if (addressesMatch) {
    withoutViewFields.veteranHomeAddress = withoutViewFields.veteranAddress;
  }

  const formData =
    JSON.stringify(withoutViewFields, (key, value) => {
      // Don’t let dependents be removed in the normal empty object clean up
      if (key === 'dependents') {
        return value;
      }

      return stringifyFormReplacer(key, value);
    }) || '{}';

  let gaClientId;
  try {
    // eslint-disable-next-line no-undef
    gaClientId = ga.getAll()[0].get('clientId');
  } catch (e) {
    // don't want to break submitting because of a weird GA issue
  }

  // use logging to track volume of forms submitted with future discharge dates
  if (
    form.data.lastDischargeDate &&
    moment(form.data.lastDischargeDate, 'YYYY-MM-DD').isAfter(
      moment().endOf('day'),
    )
  ) {
    recordEvent({
      event: 'hca-future-discharge-date-submission',
    });
  }

  return JSON.stringify({
    gaClientId,
    asyncCompatible: true,
    form: formData,
  });
}

// map the facility list for each state into an array of strings
export const medicalCentersByState = mapValues(vaMedicalFacilities, val =>
  val.map(center => center.value),
);

// check if the declared expenses are greater than the declared income
export function expensesLessThanIncome(fieldShownUnder) {
  const fields = [
    'deductibleMedicalExpenses',
    'deductibleFuneralExpenses',
    'deductibleEducationExpenses',
  ];
  return formData => {
    const {
      veteranGrossIncome = 0,
      veteranNetIncome = 0,
      veteranOtherIncome = 0,
      dependents = [],
    } = formData;

    const {
      spouseGrossIncome = 0,
      spouseNetIncome = 0,
      spouseOtherIncome = 0,
    } = formData['view:spouseIncome'] || {};

    const vetSpouseIncome =
      veteranGrossIncome +
      veteranNetIncome +
      veteranOtherIncome +
      spouseGrossIncome +
      spouseNetIncome +
      spouseOtherIncome;

    const income = dependents.reduce((sum, dependent) => {
      const { grossIncome = 0, netIncome = 0, otherIncome = 0 } = dependent;

      return grossIncome + netIncome + otherIncome + sum;
    }, vetSpouseIncome);

    const {
      deductibleMedicalExpenses = 0,
      deductibleFuneralExpenses = 0,
      deductibleEducationExpenses = 0,
    } = formData;

    const expenses =
      deductibleMedicalExpenses +
      deductibleEducationExpenses +
      deductibleFuneralExpenses;

    const hideBasedOnValues = income > expenses;

    // If we're not going to hide based on values entered,
    // then we need to make sure the current field is the last non-empty field
    if (!hideBasedOnValues) {
      const nonEmptyFields = fields.filter(field => formData[field]);
      return (
        !nonEmptyFields.length ||
        nonEmptyFields[nonEmptyFields.length - 1] !== fieldShownUnder
      );
    }

    return true;
  };
}

/**
 * Helper that takes two sets of props and returns true if any of its relevant
 * props are different.
 * @param {Object} prevProps - first set of props to compare
 * @param {Object} props - second set of props to compare
 * @returns {boolean} - true if any relevant props differ between the two sets
 * of props; otherwise returns false
 *
 */
export function didEnrollmentStatusChange(prevProps, props) {
  const relevantProps = [
    'enrollmentStatus',
    'noESRRecordFound',
    'shouldRedirect',
  ];
  return relevantProps.some(
    propName => prevProps[propName] !== props[propName],
  );
}

export function formValue(formData, value) {
  const HIGH_DISABILITY = 50;

  switch (value) {
    case IS_LOGGED_IN:
      return formData['view:isLoggedIn'];
    case USER_DOB:
      return formData['view:userDob'];
    case IS_GTE_HIGH_DISABILITY:
      return formData['view:totalDisabilityRating'] >= HIGH_DISABILITY;
    case IS_SHORT_FORM_ENABLED:
      return formData['view:hcaShortFormEnabled'];
    case IS_COMPENSATION_TYPE_HIGH:
      return formData.vaCompensationType === 'highDisability';
    case IS_VETERAN_IN_MVI:
      return formData['view:isUserInMvi'];
    default:
      return false;
  }
}

export function NotHighDisabilityOrNotCompensationTypeHigh(formData) {
  return !(
    formValue(formData, IS_SHORT_FORM_ENABLED) &&
    (formValue(formData, IS_COMPENSATION_TYPE_HIGH) ||
      formValue(formData, IS_GTE_HIGH_DISABILITY))
  );
}

export function NotHighDisability(formData) {
  return !(
    formValue(formData, IS_SHORT_FORM_ENABLED) &&
    formValue(formData, IS_GTE_HIGH_DISABILITY)
  );
}
