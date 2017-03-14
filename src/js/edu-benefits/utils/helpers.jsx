import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import { dateToMoment } from '../../common/utils/helpers';

export const chapterNames = {
  veteranInformation: 'Veteran Information',
  benefitsEligibility: 'Benefits Eligibility',
  militaryHistory: 'Military History',
  educationHistory: 'Education History',
  employmentHistory: 'Employment History',
  schoolSelection: 'School Selection',
  personalInformation: 'Personal Information',
  review: 'Review'
};

export const benefitsLabels = {
  chapter33: <p>Post-9/11 GI Bill (Chapter 33)<br/><a href="/education/gi-bill/post-9-11/" target="_blank">Learn more</a></p>,
  chapter30: <p>Montgomery GI Bill (MGIB-AD, Chapter 30)<br/><a href="/education/gi-bill/montgomery-active-duty/" target="_blank">Learn more</a></p>,
  chapter1606: <p>Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)<br/><a href="/education/gi-bill/montgomery-selected-reserve/" target="_blank">Learn more</a></p>,
  chapter32: <p>Post-Vietnam Era Veterans' Educational Assistance Program<br/>(VEAP, Chapter 32)<br/><a href="/education/other-educational-assistance-programs/veap/" target="_blank">Learn more</a></p>,
  chapter1607: <p>Reserve Educational Assistance Program (REAP, Chapter 1607)<br/><a href="/education/other-educational-assistance-programs/reap/" target="_blank">Learn more</a></p>,
  transferOfEntitlement: <p>Transfer of Entitlement Program (TOE)<br/><a href="/education/gi-bill/transfer/" target="_blank">Learn more</a></p>
};

export const preferredContactMethodLabels = {
  mail: 'Mail',
  email: 'Email',
  phone: 'Phone'
};

export const relationshipLabels = {
  spouse: 'Spouse',
  child: 'Child'
};

export const genderLabels = {
  F: 'Female',
  M: 'Male'
};

export const hoursTypeLabels = {
  semester: 'Semester',
  quarter: 'Quarter',
  clock: 'Clock'
};

export function getLabel(options, value) {
  const matched = _.find(options, option => option.value === value);

  return matched ? matched.label : null;
}

export function showSchoolAddress(educationType) {
  return educationType === 'college'
    || educationType === 'flightTraining'
    || educationType === 'apprenticeship'
    || educationType === 'correspondence';
}

function formatDayMonth(val) {
  if (!val || !val.length || !Number(val)) {
    return 'XX';
  } else if (val.length === 1) {
    return `0${val}`;
  }

  return val.toString();
}

function formatYear(val) {
  if (!val || !val.length) {
    return 'XXXX';
  }

  const yearDate = moment(val, 'YYYY');
  if (!yearDate.isValid()) {
    return 'XXXX';
  }

  return yearDate.format('YYYY');
}

export function formatPartialDate(field) {
  if (!field || (!field.month.value && !field.year.value)) {
    return undefined;
  }

  const day = field.day ? field.day.value : null;

  return `${formatYear(field.year.value)}-${formatDayMonth(field.month.value)}-${formatDayMonth(day)}`;
}

export function displayDateIfValid(field) {
  if (!field.day.value && !field.month.value && !field.year.value) {
    return undefined;
  }

  return `${formatDayMonth(field.month.value)}/${formatDayMonth(field.day.value)}/${formatYear(field.year.value)}`;
}

export function displayMonthYearIfValid(dateObject) {
  if (dateObject.year.value || dateObject.month.value) {
    return `${dateObject.month.value || 'XX'}/${dateObject.year.value || 'XXXX'}`;
  }

  return null;
}

export function showSomeoneElseServiceQuestion(claimType) {
  return claimType !== ''
    && claimType !== 'vocationalRehab';
}

export function hasServiceBefore1978(data) {
  return data.toursOfDuty.some(tour => {
    const fromDate = dateToMoment(tour.dateRange.from);
    return fromDate.isValid() && fromDate.isBefore('1978-01-02');
  });
}

export function showRelinquishedEffectiveDate(benefitsRelinquished) {
  return benefitsRelinquished !== '' && benefitsRelinquished !== 'unknown';
}

export function getListOfBenefits(veteran) {
  const benefitList = [];

  if (veteran.chapter30) {
    benefitList.push('Montgomery GI Bill (MGIB or Chapter 30) Education Assistance Program');
  }

  if (veteran.chapter33) {
    benefitList.push('Post-9/11 GI Bill (Chapter 33)');
  }

  if (veteran.chapter1606) {
    benefitList.push('Montgomery GI Bill Selected Reserve (MGIB-SR or Chapter 1606) Educational Assistance Program');
  }

  if (veteran.chapter32) {
    benefitList.push('Post-Vietnam Era Veterans\' Educational Assistance Program (VEAP or chapter 32)');
  }

  return benefitList;
}

export function showYesNo(field) {
  if (field.value === '') {
    return '';
  }

  return field.value === 'Y' ? 'Yes' : 'No';
}

export function enumToNames(enumValues, names) {
  return enumValues.map(item => names[item]);
}

export const hoursTypeLabels = {
  semester: 'Semester',
  quarter: 'Quarter',
  clock: 'Clock'
};
