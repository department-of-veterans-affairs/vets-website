/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */ // keys are defined, error being thrown in eslint even when key is defined
import React from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import { v4 as uuidv4 } from 'uuid';
import {
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  TIMS_DOCUMENTS,
} from './constants';

export const translateDateIntoMonthYearFormat = dateString => {
  // Parse the date string as UTC
  if (dateString === null) {
    return 'Date unavailable';
  }

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

export const toLocalISOString = date => {
  const pad = num => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  const ms = date
    .getMilliseconds()
    .toString()
    .padStart(3, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
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
  const dateUnavailable = 'Date unavailable';
  const parseDateUTC = dateString => {
    const [year, month, day] = dateString
      .split('-')
      .map(num => parseInt(num, 10));
    return new Date(Date.UTC(year, month - 1, day));
  };

  const date1 =
    startDateString !== null ? parseDateUTC(startDateString) : dateUnavailable;
  const date2 =
    endDateString !== null ? parseDateUTC(endDateString) : dateUnavailable;

  // Function to format a date into MM/DD/YYYY in UTC
  function formatDate(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  }
  // Format both dates and concatenate them
  return `${date1 === dateUnavailable ? date1 : formatDate(date1)} - ${
    date2 === dateUnavailable ? date2 : formatDate(date2)
  }`;
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

export const isSameMonth = (date1, date2) => {
  const [year1, month1] = date1.split('-').map(str => parseInt(str, 10));
  const [year2, month2] = date2.split('-').map(str => parseInt(str, 10));

  return month1 === month2 && year1 === year2;
};

export const getEndOfMonth = (year, month) => {
  return new Date(year, month, 0).getDate(); // Last day of the month
};

export const getDateRangesBetween = (date1, date2) => {
  const [year1, month1] = date1.split('-').map(str => parseInt(str, 10));
  const [year2, month2] = date2.split('-').map(str => parseInt(str, 10));

  const ranges = [];

  // Range for the first month
  const endOfMonth1 = getEndOfMonth(year1, month1);
  ranges.push(
    `${date1} - ${year1}-${String(month1).padStart(2, '0')}-${endOfMonth1}`,
  );

  // Add ranges for full months in between
  let currentYear = year1;
  let currentMonth = month1 + 1;
  while (
    currentYear < year2 ||
    (currentYear === year2 && currentMonth < month2)
  ) {
    const endOfMonth = getEndOfMonth(currentYear, currentMonth);
    ranges.push(
      `${currentYear}-${String(currentMonth).padStart(
        2,
        '0',
      )}-01 - ${currentYear}-${String(currentMonth).padStart(
        2,
        '0',
      )}-${endOfMonth}`,
    );

    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear += 1;
    } else {
      currentMonth += 1;
    }
  }

  // Range for the last month
  ranges.push(`${year2}-${String(month2).padStart(2, '0')}-01 - ${date2}`);

  return ranges;
};
export const getPeriodsToVerify = (pendingEnrollments, review = false) => {
  return pendingEnrollments
    .map(enrollmentToBeVerified => {
      const {
        actBegin,
        actEnd,
        monthlyRate,
        numberHours,
      } = enrollmentToBeVerified;
      const myUUID = uuidv4();

      return (
        <div
          className="vads-u-margin-y--2"
          key={`Enrollment-to-be-verified-${myUUID}`}
        >
          <p
            className={
              review
                ? 'vads-u-margin--0 vads-u-margin-left--1p5 vads-u-font-size--base'
                : 'vads-u-margin--0 vads-u-font-size--base'
            }
          >
            <span className="vads-u-font-weight--bold">
              {translateDatePeriod(actBegin, actEnd)}
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
              Total credit hours:
            </span>{' '}
            {numberHours === null ? 'Hours unavailable' : numberHours}
          </p>
          <p
            className={
              review
                ? 'vads-u-margin--0 vads-u-margin-left--1p5 vads-u-font-size--base'
                : 'vads-u-margin--0 vads-u-font-size--base'
            }
          >
            <span className="vads-u-font-weight--bold">Monthly rate:</span>{' '}
            {monthlyRate === null
              ? 'Rate unavailable'
              : formatCurrency(monthlyRate)}
          </p>
        </div>
      );
    })
    .reverse();
};

export const getGroupedPreviousEnrollments = month => {
  const { transactDate, actBegin, actEnd, id, paymentDate } = month[0];
  const myUUID = uuidv4();

  return (
    <div className="vye-top-border" key={id || myUUID}>
      {transactDate && paymentDate ? (
        <>
          <h3 className="vads-u-font-size--h4 vads-u-display--flex vads-u-align-items--center">
            <span className="vads-u-display--inline-block ">
              {actBegin !== null
                ? translateDateIntoMonthYearFormat(actBegin)
                : translateDateIntoMonthYearFormat(actEnd)}
            </span>{' '}
            <va-icon
              icon="check_circle"
              class="icon-color"
              aria-hidden="true"
            />{' '}
            <span className="vads-u-display--block">Verified</span>
          </h3>
          <p>We processed your payment for this month.</p>
          <va-additional-info
            trigger={`
              ${
                actBegin !== null
                  ? translateDateIntoMonthYearFormat(actBegin)
                  : translateDateIntoMonthYearFormat(actEnd)
              } verification details
            `}
            class="vads-u-margin-bottom--4"
          >
            {month.map((monthAward, index) => {
              const { numberHours, monthlyRate } = monthAward;
              return (
                <div key={index}>
                  <p className="vads-u-font-weight--bold vads-u-margin--0">
                    {translateDatePeriod(
                      monthAward.actBegin,
                      monthAward.actEnd,
                    )}
                  </p>
                  <p className="vads-u-margin--0">
                    <span className="vads-u-font-weight--bold">
                      Total credit hours:
                    </span>{' '}
                    {numberHours === null ? 'Hours unavailable' : numberHours}
                  </p>
                  <p className="vads-u-margin--0">
                    <span className="vads-u-font-weight--bold">
                      Monthly Rate:
                    </span>{' '}
                    {monthlyRate === null
                      ? 'Rate unavailable'
                      : formatCurrency(monthlyRate)}
                  </p>
                  <div className="vads-u-font-style--italic vads-u-margin--0">
                    You verified on{' '}
                    {translateDateIntoMonthDayYearFormat(
                      monthAward.transactDate,
                    )}
                  </div>
                  <div
                    className={
                      index === month.length - 1
                        ? 'vads-u-margin-bottom--0'
                        : 'vads-u-margin-bottom--3'
                    }
                  />
                </div>
              );
            })}
          </va-additional-info>
        </>
      ) : transactDate && !paymentDate ? (
        <>
          <h3 className="vads-u-font-size--h4 vads-u-display--flex vads-u-align-items--center">
            <span className="vads-u-display--inline-block ">
              {actBegin !== null
                ? translateDateIntoMonthYearFormat(actBegin)
                : translateDateIntoMonthYearFormat(actEnd)}
            </span>{' '}
            <va-icon
              icon="check_circle"
              class="icon-color"
              aria-hidden="true"
            />{' '}
            <span className="vads-u-display--block">Verified</span>
          </h3>
          <va-additional-info
            trigger={`${translateDateIntoMonthYearFormat(
              actBegin,
            )} verification details`}
            class="vads-u-margin-bottom--4"
          >
            {month.map((monthAward, index) => {
              const { numberHours, monthlyRate } = monthAward;
              return (
                <div key={index}>
                  <p className="vads-u-font-weight--bold vads-u-margin--0">
                    {translateDatePeriod(
                      monthAward.actBegin,
                      monthAward.actEnd,
                    )}
                  </p>
                  <p className="vads-u-margin--0">
                    <span className="vads-u-font-weight--bold">
                      Total credit hours:
                    </span>{' '}
                    {numberHours === null ? 'Hours unavailable' : numberHours}
                  </p>
                  <p className="vads-u-margin--0">
                    <span className="vads-u-font-weight--bold">
                      Monthly Rate:
                    </span>{' '}
                    {monthlyRate === null
                      ? 'Rate unavailable'
                      : formatCurrency(monthlyRate)}
                  </p>
                  <div className="vads-u-font-style--italic vads-u-margin--0">
                    You verified on{' '}
                    {translateDateIntoMonthDayYearFormat(
                      monthAward.transactDate,
                    )}
                  </div>
                  <div
                    className={
                      index === month.length - 1
                        ? 'vads-u-margin-bottom--0'
                        : 'vads-u-margin-bottom--3'
                    }
                  />
                </div>
              );
            })}
          </va-additional-info>
        </>
      ) : (
        <>
          <h3 className="vads-u-font-size--h4">
            {translateDateIntoMonthYearFormat(actBegin)}
          </h3>
          <div>
            <va-alert
              background-only
              class="vads-u-margin-bottom--3"
              close-btn-aria-label="Close notification"
              disable-analytics="true"
              full-width="false"
              status="info"
              visible="true"
              slim
            >
              <p
                className="vads-u-margin-y--0 text-color vads-u-font-family--sans"
                data-testid="have-not-verified"
              >
                You haven’t verified your enrollment for the month.
              </p>
            </va-alert>
          </div>
        </>
      )}
    </div>
  );
};

export const getSignlePreviousEnrollments = awards => {
  const myUUID = uuidv4();
  return (
    <div className="vye-top-border" key={myUUID}>
      {awards.transactDate &&
        awards.paymentDate && (
          <>
            <h3 className="vads-u-font-size--h4 vads-u-display--flex vads-u-align-items--center">
              <span className="vads-u-display--inline-block ">
                {awards.actBegin !== null
                  ? translateDateIntoMonthYearFormat(awards.actBegin)
                  : translateDateIntoMonthYearFormat(awards.actEnd)}
              </span>{' '}
              <va-icon
                icon="check_circle"
                class="icon-color"
                aria-hidden="true"
              />{' '}
              <span className="vads-u-display--block">Verified</span>
            </h3>
            <p>We processed your payment for this month.</p>
            <va-additional-info
              trigger={`
            ${
              awards.actBegin !== null
                ? translateDateIntoMonthYearFormat(awards.actBegin)
                : translateDateIntoMonthYearFormat(awards.actEnd)
            } verification details
          `}
              class="vads-u-margin-bottom--4"
            >
              <p className="vads-u-font-weight--bold">
                {translateDatePeriod(awards.actBegin, awards.actEnd)}
              </p>
              <p>
                <span className="vads-u-font-weight--bold">
                  Total credit hours:
                </span>{' '}
                {awards.numberHours === null
                  ? 'Hours unavailable'
                  : awards.numberHours}
              </p>
              <p>
                <span className="vads-u-font-weight--bold">Monthly Rate:</span>{' '}
                {awards.monthlyRate === null
                  ? 'Rate unavailable'
                  : formatCurrency(awards.monthlyRate)}
              </p>
              <div className="vads-u-font-style--italic">
                You verified on{' '}
                {translateDateIntoMonthDayYearFormat(awards.transactDate)}
              </div>
            </va-additional-info>
          </>
        )}
      {awards.transactDate &&
        !awards.paymentDate && (
          <>
            <h3 className="vads-u-font-size--h4 vads-u-display--flex vads-u-align-items--center">
              <span className="vads-u-display--inline-block ">
                {awards.actBegin !== null
                  ? translateDateIntoMonthYearFormat(awards.actBegin)
                  : translateDateIntoMonthYearFormat(awards.actEnd)}
              </span>{' '}
              <va-icon
                icon="check_circle"
                class="icon-color"
                aria-hidden="true"
              />{' '}
              <span className="vads-u-display--block">Verified</span>
            </h3>
            <va-additional-info
              trigger={`${translateDateIntoMonthYearFormat(
                awards.actBegin,
              )} verification details`}
              class="vads-u-margin-bottom--4"
            >
              <p className="vads-u-font-weight--bold">
                {translateDatePeriod(awards.actBegin, awards.actEnd)}
              </p>
              <p>
                <span className="vads-u-font-weight--bold">
                  Total credit hours:
                </span>{' '}
                {awards.numberHours === null
                  ? 'Hours unavailable'
                  : awards.numberHours}
              </p>
              <p>
                <span className="vads-u-font-weight--bold">Monthly Rate:</span>{' '}
                {awards.monthlyRate === null
                  ? 'Rate unavailable'
                  : formatCurrency(awards.monthlyRate)}
              </p>
              <div className="vads-u-font-style--italic">
                You verified on{' '}
                {translateDateIntoMonthDayYearFormat(awards.transactDate)}
              </div>
            </va-additional-info>
          </>
        )}
      {!awards.transactDate &&
        !awards.paymentDate && (
          <>
            <h3 className="vads-u-font-size--h4">
              {translateDateIntoMonthYearFormat(awards.actBegin)}
            </h3>
            <va-alert
              background-only
              class="vads-u-margin-bottom--3"
              close-btn-aria-label="Close notification"
              disable-analytics="true"
              full-width="false"
              status="info"
              visible="true"
              slim
            >
              <p
                className="vads-u-margin-y--0 text-color vads-u-font-family--sans"
                data-testid="have-not-verified"
              >
                You haven’t verified your enrollment for the month.
              </p>
            </va-alert>
          </>
        )}
    </div>
  );
};

export const combineEnrollmentsWithStartMonth = enrollmentPeriods => {
  const isArray = Array.isArray(enrollmentPeriods);

  const trackDate = [];
  const combineMonths = {};
  const dateUnavailable = 'Date unavailable';

  if (isArray) {
    enrollmentPeriods.forEach(period => {
      // if award begin date is null, assign value as Date unavailable
      let tempMonthYear =
        period.actBegin !== null
          ? translateDateIntoMonthYearFormat(period.actBegin)
          : dateUnavailable;

      // if value is Date unavailable and there is an award end date, use the award end date instead
      if (tempMonthYear === dateUnavailable) {
        tempMonthYear =
          period.actEnd !== null
            ? translateDateIntoMonthYearFormat(period.actEnd)
            : dateUnavailable;
      }

      if (trackDate.includes(tempMonthYear)) {
        combineMonths[tempMonthYear].push({
          id: period.id,
          actBegin: period.actBegin,
          actEnd: period.actEnd,
          numberHours: period.numberHours,
          monthlyRate: period.monthlyRate,
          transactDate: period.transactDate,
          PendingVerificationSubmitted: period.PendingVerificationSubmitted,
          paymentDate: period.paymentDate,
        });
      } else {
        trackDate.push(tempMonthYear);
        combineMonths[tempMonthYear] = [
          {
            id: period.id,
            actBegin: period.actBegin,
            actEnd: period.actEnd,
            numberHours: period.numberHours,
            monthlyRate: period.monthlyRate,
            transactDate: period.transactDate,
            PendingVerificationSubmitted: period.PendingVerificationSubmitted,
            paymentDate: period.paymentDate,
          },
        ];
      }
    });
    return combineMonths;
  }
  return enrollmentPeriods;
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};
export const noSuggestedAddress = deliveryPointValidation => {
  return (
    deliveryPointValidation === BAD_UNIT_NUMBER ||
    deliveryPointValidation === MISSING_UNIT_NUMBER ||
    deliveryPointValidation === 'MISSING_ZIP' ||
    deliveryPointValidation === 'UNDELIVERABLE'
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
export const formatAddress = address => {
  const city = address?.city ?? '';
  const stateCode = address?.stateCode ?? '';
  const zipCode = address?.zipCode ?? '';

  return `${city}${
    stateCode || zipCode ? ',' : ''
  } ${stateCode} ${zipCode}`.trim();
};
export const addressLabel = address => {
  // Destructure address object for easier access
  const {
    addressLine1,
    addressLine2,
    city,
    province,
    stateCode,
    internationalPostalCode,
    zipCode,
  } = address;

  const line1 = addressLine1 || '';
  const line2 = addressLine2 || '';

  const cityState = city && (province || stateCode) ? `${city}, ` : city;

  const state = province || stateCode || '';

  const postalCode = internationalPostalCode || zipCode || '';

  return (
    <span>
      {line1 && <>{line1} </>}
      {line2 && <>{` ${line2}`}</>}
      {cityState && (
        <>
          <br /> {cityState}
        </>
      )}
      {state && <>{state}</>}
      {postalCode && (state || cityState) && ' '}
      {postalCode}
    </span>
  );
};

export const hasFormChanged = obj => {
  const keys = Object.keys(obj ?? {});
  for (const key of keys) {
    const value = obj[key];
    // Skip the specific key
    if (key === 'view:livesOnMilitaryBaseInfo') {
      // eslint-disable-next-line no-continue
      continue;
    }
    // Checking if there is value that is not undefined
    if (value !== undefined) {
      return true;
    }
  }
  return false;
};

export function compareAddressObjects(obj1, obj2) {
  const { hasOwnProperty } = Object.prototype;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length === 0 && keys2.length === 0) {
    return false;
  }
  for (const key of keys1) {
    if (key === 'view:livesOnMilitaryBaseInfo') {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (
      hasOwnProperty.call(obj1, key) &&
      hasOwnProperty.call(obj2, key) &&
      obj1[key] !== obj2[key]
    ) {
      return true;
    }
  }

  for (const key of keys2) {
    if (key === 'view:livesOnMilitaryBaseInfo') {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (
      hasOwnProperty.call(obj2, key) &&
      hasOwnProperty.call(obj1, key) &&
      obj2[key] !== obj1[key]
    ) {
      return true;
    }
  }

  return false;
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (
      key === 'view:livesOnMilitaryBaseInfo' ||
      key === 'view:livesOnMilitaryBase'
    ) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

const initialState = {
  addressLine1: undefined,
  addressLine2: undefined,
  addressLine3: undefined,
  addressLine4: undefined,
  city: undefined,
  countryCodeIso3: 'USA',
  internationalPostalCode: undefined,
  province: undefined,
  stateCode: '- Select -',
  'view:livesOnMilitaryBase': undefined,
  'view:livesOnMilitaryBaseInfo': {},
  zipCode: undefined,
};

// Function to check if the object has changed
export function hasAddressFormChanged(currentState) {
  const filledCurrentState = {
    ...initialState,
    ...currentState,
    stateCode:
      currentState.stateCode !== undefined
        ? currentState.stateCode
        : initialState.stateCode,
  };
  return !deepEqual(initialState, filledCurrentState);
}
