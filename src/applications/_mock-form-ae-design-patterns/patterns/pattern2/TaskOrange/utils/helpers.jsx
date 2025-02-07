import _ from 'lodash';

import { dateFieldToDate } from 'platform/utilities/date';
import { format, isBefore, isValid, parse } from 'date-fns';

export function getLabel(options, value) {
  const matched = _.find(options, option => option.value === value);

  return matched ? matched.label : null;
}
export function convertToggle() {
  const url = window.location.href;
  const params = new URLSearchParams(new URL(url).search);
  const toggleValues = params.get('toggle');
  return toggleValues?.toLowerCase() === 'false';
}
export function showSchoolAddress(educationType) {
  return (
    educationType === 'college' ||
    educationType === 'flightTraining' ||
    educationType === 'apprenticeship' ||
    educationType === 'correspondence'
  );
}

function formatDayMonth(val) {
  if (!val || !val.length || !Number(val)) {
    return 'XX';
  }
  if (val.length === 1) {
    return `0${val}`;
  }

  return val.toString();
}

export function formatYear(val) {
  if (!val || !val.length) {
    return 'XXXX';
  }

  // Strip non-digit characters
  const cleanedVal = val.replace(/\D/g, '');

  // Handle 2 digit years
  const parseFormat = cleanedVal.length === 2 ? 'yy' : 'yyyy';

  const yearDate = parse(cleanedVal, parseFormat, new Date());
  if (!isValid(yearDate)) {
    return 'XXXX';
  }

  return format(yearDate, 'yyyy');
}

export function formatPartialDate(field) {
  if (!field || (!field.month.value && !field.year.value)) {
    return undefined;
  }

  const day = field.day ? field.day.value : null;

  return `${formatYear(field.year.value)}-${formatDayMonth(
    field.month.value,
  )}-${formatDayMonth(day)}`;
}

export function displayDateIfValid(field) {
  if (!field.day.value && !field.month.value && !field.year.value) {
    return undefined;
  }

  return `${formatDayMonth(field.month.value)}/${formatDayMonth(
    field.day.value,
  )}/${formatYear(field.year.value)}`;
}

export function displayMonthYearIfValid(dateObject) {
  if (dateObject.year.value || dateObject.month.value) {
    return `${dateObject.month.value || 'XX'}/${dateObject.year.value ||
      'XXXX'}`;
  }

  return null;
}

export function showSomeoneElseServiceQuestion(claimType) {
  return claimType !== '' && claimType !== 'vocationalRehab';
}

export function hasServiceBefore1978(data) {
  return data.toursOfDuty.some(tour => {
    const fromDate = dateFieldToDate(tour.dateRange.from);
    return isValid(fromDate) && isBefore(fromDate, new Date('1978-01-02'));
  });
}

export function showRelinquishedEffectiveDate(benefitsRelinquished) {
  return benefitsRelinquished !== '' && benefitsRelinquished !== 'unknown';
}

export function getListOfBenefits(veteran) {
  const benefitList = [];

  if (veteran.chapter30) {
    benefitList.push(
      'Montgomery GI Bill (MGIB or Chapter 30) Education Assistance Program',
    );
  }

  if (veteran.chapter33) {
    benefitList.push('Post-9/11 GI Bill (Chapter 33)');
  }

  if (veteran.chapter1606) {
    benefitList.push(
      'Montgomery GI Bill Selected Reserve (MGIB-SR or Chapter 1606) Educational Assistance Program',
    );
  }

  if (veteran.chapter32) {
    benefitList.push(
      'Post-Vietnam Era Veterans’ Educational Assistance Program (VEAP or chapter 32)',
    );
  }

  return benefitList;
}

export function showYesNo(field) {
  if (field.value === '') {
    return '';
  }

  return field.value === 'Y' ? 'Yes' : 'No';
}
export function isValidRoutingNumber(value) {
  if (/^\d{9}$/.test(value)) {
    const digits = value.split('').map(val => parseInt(val, 10));
    const weighted =
      3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      (digits[2] + digits[5] + digits[8]);

    return weighted % 10 === 0;
  }
  return false;
}
