import React from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import {
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  TIMS_DOCUMENTS,
} from './constants';

export const translateDateIntoMonthYearFormat = dateString => {
  // Parse the date string as UTC
  const [year, month, day] = dateString
    .split('-')
    .map(num => parseInt(num, 10));
  const date = new Date(Date.UTC(year, month - 1, day));

  // Format the date with the full month name and year in UTC
  // Outputs: 'Month Year'
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

export const translateDateIntoMonthDayYearFormat = dateString => {
  // Parse the date string as UTC
  if (!dateString) return null;
  const [year, month, day] = dateString
    .split('-')
    .map(num => parseInt(num, 10));
  const date = new Date(Date.UTC(year, month - 1, day));

  // Function to get the ordinal suffix for a given day
  function getOrdinalSuffix(dayOfTheMonth) {
    if (dayOfTheMonth > 3 && dayOfTheMonth < 21) return 'th'; // for dayOfTheMonths like 4th, 5th, ... 20th
    switch (dayOfTheMonth % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  // Get the day with ordinal suffix
  const dayWithSuffix = date.getUTCDate() + getOrdinalSuffix(date.getUTCDate());
  // Format the month and year
  const formattedMonth = date.toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });

  // Combine everything
  return `${formattedMonth} ${dayWithSuffix}, ${date.getUTCFullYear()}`;
};

export const translateDatePeriod = (startDateString, endDateString) => {
  // Parse the date strings into Date objects as UTC
  const parseDateUTC = dateString => {
    const [year, month, day] = dateString
      .split('-')
      .map(num => parseInt(num, 10));
    return new Date(Date.UTC(year, month - 1, day));
  };

  const date1 = parseDateUTC(startDateString);
  const date2 = parseDateUTC(endDateString);

  // Function to format a date into MM/DD/YYYY in UTC
  function formatDate(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  }

  // Format both dates and concatenate them
  return `${formatDate(date1)} - ${formatDate(date2)}`;
};

export const formatCurrency = str => {
  // Convert the string to a number
  const number = Number(str);

  // Check if the conversion is successful
  if (Number.isNaN(number)) {
    return 'Invalid input';
  }

  // Format the number as a currency string
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const scrollToElement = el => {
  const element = document.getElementById(el);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// make an object of just the military state codes and names
export const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

export const getCurrentDateFormatted = () => {
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();

  return `${month}/${day}/${year}`;
};

export const getPendingDocumentDescription = docType => {
  const documentDisplayName = TIMS_DOCUMENTS?.[docType]?.displayName;
  const documentExplanation = TIMS_DOCUMENTS?.[docType]?.explanation;
  return { documentDisplayName, documentExplanation };
};
export const remainingBenefits = remEnt => {
  const month = parseInt(remEnt?.slice(0, 2), 10);
  const rest = parseFloat(`0.${remEnt?.slice(2)}`);
  const day = Math.round(rest * 30);

  return { month, day };
};

export const getPeriodsToVerify = (pendingEnrollments, review = false) => {
  return pendingEnrollments
    .map(enrollmentToBeVerified => {
      const {
        awardBeginDate,
        awardEndDate,
        monthlyRate,
        numberHours,
        id,
      } = enrollmentToBeVerified;
      return (
        <div
          className={
            review ? 'vads-u-margin-y--2 vye-left-border' : 'vads-u-margin-y--2'
          }
          key={`Enrollment-to-be-verified-${id}`}
        >
          <p
            className={
              review
                ? 'vads-u-margin--0 vads-u-margin-left--1p5 vads-u-font-size--base'
                : 'vads-u-margin--0 vads-u-font-size--base'
            }
          >
            <span className="vads-u-font-weight--bold">
              {translateDatePeriod(awardBeginDate, awardEndDate)}
            </span>
          </p>
          <p
            className={
              review
                ? 'vads-u-margin--0 vads-u-margin-left--1p5 vads-u-font-size--base'
                : 'vads-u-margin--0 vads-u-font-size--base'
            }
          >
            <span className="vads-u-font-weight--bold">
              Total Credit Hours:
            </span>{' '}
            {numberHours}
          </p>
          <p
            className={
              review
                ? 'vads-u-margin--0 vads-u-margin-left--1p5 vads-u-font-size--base'
                : 'vads-u-margin--0 vads-u-font-size--base'
            }
          >
            <span className="vads-u-font-weight--bold">Monthly Rate:</span>{' '}
            {formatCurrency(monthlyRate)}
          </p>
        </div>
      );
    })
    .reverse();
};

export const combineEnrollmentsWithEndMonths = enrollmentPeriods => {
  const trackEndDate = [];
  const combineMonths = {};

  enrollmentPeriods.forEach(period => {
    const tempMonthYear = translateDateIntoMonthYearFormat(period.awardEndDate);
    if (trackEndDate.includes(tempMonthYear)) {
      combineMonths[tempMonthYear].push({
        id: period.id,
        awardBeginDate: period.awardBeginDate,
        awardEndDate: period.awardEndDate,
        numberHours: period.numberHours,
        monthlyRate: period.monthlyRate,
      });
    } else {
      trackEndDate.push(tempMonthYear);
      combineMonths[tempMonthYear] = [
        {
          id: period.id,
          awardBeginDate: period.awardBeginDate,
          awardEndDate: period.awardEndDate,
          numberHours: period.numberHours,
          monthlyRate: period.monthlyRate,
        },
      ];
    }
  });
  return combineMonths;
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};
export const objectHasNoUndefinedValues = obj => {
  return Object.values(obj).every(value => value !== undefined);
};
export const noSuggestedAddress = deliveryPointValidation => {
  return (
    deliveryPointValidation === BAD_UNIT_NUMBER ||
    deliveryPointValidation === MISSING_UNIT_NUMBER ||
    deliveryPointValidation === 'MISSING_ZIP'
  );
};

export const prepareAddressData = formData => {
  let addressData = {
    veteranName: formData.fullName,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    addressLine3: formData.addressLine3,
    addressLine4: formData.addressLine4,
    addressPou: 'CORRESPONDENCE',
    countryCodeIso3: formData.countryCodeIso3,
    city: formData.city,
  };
  if (formData.countryCodeIso3 === 'USA') {
    const baseUSAData = {
      stateCode: formData.stateCode,
      zipCode: formData.zipCode,
      addressType: 'DOMESTIC',
    };
    if (formData['view:livesOnMilitaryBase']) {
      baseUSAData.addressType = 'OVERSEAS MILITARY';
    }
    addressData = { ...addressData, ...baseUSAData };
  } else {
    const internationalData = {
      province: formData.province,
      internationalPostalCode: formData.internationalPostalCode,
      addressType: 'INTERNATIONAL',
    };
    addressData = { ...addressData, ...internationalData };
  }
  return addressData;
};

export const addressLabel = address => (
  <span>
    {`${address?.addressLine1} ${address?.addressLine2 || ''}`}
    <br />
    {`${address?.city}, ${address?.province ||
      address?.stateCode} ${address?.internationalPostalCode ||
      address?.zipCode}`}
  </span>
);
