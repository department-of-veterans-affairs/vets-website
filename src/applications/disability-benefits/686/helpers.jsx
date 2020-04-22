import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import React from 'react';
import moment from 'moment';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
// import { apiRequest } from 'platform/utilities/api';
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';
import titleCase from 'platform/utilities/data/titleCase';

export const childRelationshipStatusLabels = {
  biological: 'Biological',
  adopted: 'Adopted',
  stepchild: 'Stepchild',
};

export const separationReasons = {
  DEATH: 'Death',
  DIVORCE: 'Divorce',
  OTHER: 'Other',
};

const militaryStates = [
  { label: 'American Samoa', value: 'AS' },
  { label: 'Armed Forces Americas (AA)', value: 'AA' },
  { label: 'Armed Forces Europe (AE)', value: 'AE' },
  { label: 'Armed Forces Pacific (AP)', value: 'AP' },
  { label: 'Federated States Of Micronesia', value: 'FM' },
  { label: 'Guam', value: 'GU' },
  { label: 'Marshall Islands', value: 'MH' },
  { label: 'Northern Mariana Islands', value: 'MP' },
  { label: 'Palau', value: 'PW' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Virgin Islands', value: 'VI' },
  { label: 'United States Minor Outlying Islands', value: 'UM' },
];

export function fetchDisabilityRating({ onDone }) {
  // const fetchUrl = '/dependents_applications/disability_rating';

  Promise.resolve(onDone({ has30Percent: true }));
  // return apiRequest(
  //   fetchUrl,
  //   null,
  //   payload => onDone(payload),
  //   error => onError(error)
  // );
}

export function isMarried(form = {}) {
  return ['MARRIED', 'SEPARATED'].includes(form.maritalStatus);
}

export function hasBeenMarried(form = {}) {
  return form.maritalStatus !== 'NEVERMARRIED';
}

export function isMilitaryAddress(address = {}) {
  const state = address.state;
  return militaryStates.some(e => e.value === state);
}

export function isNotMilitaryAddress(address = {}) {
  return !isMilitaryAddress(address);
}

export function isUSAAddress(address = {}) {
  const country = address.countryDropdown;
  return country === 'USA';
}

export function isDomesticAddress(address = {}) {
  const country = address.countryDropdown;
  return country === 'USA' && isNotMilitaryAddress(address);
}

export function isInternationalAddressDropdown(address = {}) {
  const country = address.countryDropdown;
  return !isDomesticAddress(address) && country !== 'Country Not In List';
}

export function isInternationalAddressText(address = {}) {
  return (
    !isDomesticAddress(address) && !isInternationalAddressDropdown(address)
  );
}

export function isNotInternationalAddressText(address = {}) {
  const country = address.countryDropdown;
  return country !== 'Country Not In List';
}

export function isCurrentMarriage(form, index) {
  const numMarriages = form && form.marriages ? form.marriages.length : 0;
  return isMarried(form) && numMarriages - 1 === index;
}

export function isNotCurrentMarriage(form, index) {
  return !isCurrentMarriage(form, index);
}

export function isNotLivingWithSpouse(form) {
  return form.currentMarriage && !form.currentMarriage.liveWithSpouse;
}

export function isNotLivingWithParent(form, index) {
  return form.dependents && !form.dependents[index].childInHousehold;
}

export function getMarriageTitle(index) {
  const marriageNumber = numberToWords(index + 1);
  return `${titleCase(marriageNumber)} marriage`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (isMarried(form) && form.marriages.length - 1 === index) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}
export function getSpouseMarriageTitle(index) {
  const marriageNumber = numberToWords(index + 1);
  return `Spouse’s ${marriageNumber} marriage`;
}

export function calculateChildAge(form, index) {
  if (form.dependents[index].childDateOfBirth) {
    const childAge = form.dependents[index].childDateOfBirth;
    return moment().diff(childAge, 'years');
  }
  return null;
}

export const VAFileNumberDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo triggerText="What does this mean?">
      <p>
        The VA file number is the number used to track your disability claim and
        evidence through the VA system. For most Veterans, your VA file number
        is the same as your Social Security number. However, if you filed your
        first disability claim a long time ago, your VA file number may be a
        different number.
      </p>
    </AdditionalInfo>
  </div>
);

export const dependentsMinItem = (
  <span>
    If you are claiming child dependents,{' '}
    <strong>you must add at least one</strong> here.
  </span>
);

export const schoolAttendanceWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since your child is between 18 and 23 years old, you’ll need to fill out
        a Request for Approval of School Attendance (
        <a
          href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          VA Form 21-674
        </a>
        ). <strong>You can send us this form later.</strong>
      </div>
    </div>
  </div>
);

export const disableWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        You’ll need to provide all private medical records for your child’s
        disability.
      </div>
    </div>
  </div>
);

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    dependentsApplication: {
      form: formData,
    },
  });
}

export const profileStatuses = {
  // TODO: move to platform and use in requiredLoginView
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
};
