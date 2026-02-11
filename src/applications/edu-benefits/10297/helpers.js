import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { countries } from 'platform/forms/address';
import { focusElement } from '~/platform/utilities/ui';
import { isValid, parseISO, parse } from 'date-fns';
import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { isValidRoutingNumber } from 'platform/forms/validations';

export const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';
export const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';

export const ConfirmationSubmissionAlert = ({ confirmationNumber }) => (
  <>
    <p>Your submission is in progress.</p>
    <p>
      It can take up to 30 days for us to review your application and make a
      decision.
      {confirmationNumber &&
        ` Your confirmation number is ${confirmationNumber}.`}
    </p>
  </>
);

ConfirmationSubmissionAlert.propTypes = {
  confirmationNumber: PropTypes.string,
};

export const ConfirmationWhatsNextProcessList = () => (
  <>
    <h2>What to expect next</h2>
    <va-process-list>
      <va-process-list-item header="We'll review your application and determine your eligibility">
        <p>
          If you’re eligible and the yearly cap of 4,000 students hasn’t been
          met, we’ll send you a Certificate of Eligibility. If not, we’ll send
          you a letter explaining why you’re not eligible.
        </p>
      </va-process-list-item>
      <va-process-list-item header="We'll check the training provider(s) you listed">
        <p>
          If you reported a school you want to attend, we’ll review whether that
          school has programs currently approved for the High Technology
          Program. If it doesn’t, we’ll reach out to the school to explore if
          approval can be set up.
        </p>
      </va-process-list-item>
      <va-process-list-item header="We'll keep you updated">
        <p>
          You’ll get an email with our decision. If you’re signed up for VA
          Notify, we’ll also send updates there.
        </p>
      </va-process-list-item>
    </va-process-list>
  </>
);

export const ConfirmationHowToContact = () => (
  <p>
    If you have questions about this form or need help, you can submit a request
    through <va-link external href="https://ask.va.gov/" text="Ask VA" />
  </p>
);

export const ConfirmationGoBackLink = () => (
  <div
    className={classNames(
      'confirmation-go-back-link-section',
      'screen-only',
      'vads-u-margin-top--2',
    )}
  >
    <va-link-action href="/" text="Go back to VA.gov homepage" type="primary" />
  </div>
);

// Expects a birthDate as a string in YYYY-MM-DD format
export const getAgeInYears = birthDate =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

export const getCardDescription = item => {
  const countryCode = item?.providerAddress?.country;
  const countryObj = countries.find(country => country.value === countryCode);
  const countryName = countryObj?.label || countryCode;

  return item ? (
    <>
      <div className=" vads-u-margin-y--2" data-testid="card-street">
        <p className="vads-u-margin-bottom--0">
          {item?.providerAddress?.street}
        </p>
        <p className="vads-u-margin-y--0" data-testid="card-address">
          {`${item?.providerAddress?.city}${
            item?.providerAddress?.state ||
            item?.providerAddress?.postalCode !== 'NA'
              ? ','
              : ''
          }`}
          {item?.providerAddress?.state
            ? ` ${item?.providerAddress?.state}`
            : ''}
          {item?.providerAddress?.postalCode !== 'NA'
            ? ` ${item?.providerAddress?.postalCode}`
            : ''}
        </p>
        {countryCode !== 'USA' && (
          <p className="vads-u-margin-top--0" data-testid="card-country">
            {countryName}
          </p>
        )}
      </div>
    </>
  ) : null;
};

export const trainingProviderArrayOptions = {
  arrayPath: 'trainingProviders',
  nounSingular: 'training provider',
  nounPlural: 'training providers',
  required: false,
  isItemIncomplete: item => {
    return (
      !item?.providerName ||
      !item?.providerAddress?.street ||
      !item?.providerAddress?.city ||
      !item?.providerAddress?.country ||
      !item?.providerAddress?.postalCode
    );
  },
  maxItems: 4,
  text: {
    getItemName: item =>
      item?.providerName ? `${item?.providerName}`.trim() : 'training provider',
    cardDescription: item => getCardDescription(item),
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
    summaryTitle: 'Review your training provider information',
    cancelAddButtonText: 'Cancel adding this training provider',
  },
};

export const validateTrainingProviderStartDate = (errors, dateString) => {
  if (!dateString) return;
  const picked = new Date(`${dateString}T00:00:00`);
  const startDate = new Date('2025-01-02T00:00:00');

  if (picked < startDate) errors.addError('Enter a date after 1/2/2025');
};

export const dateSigned = () => {
  const date = new Date();
  date.setDate(date.getDate() + 365);
  return date.toISOString().split('T')[0];
};

export const viewifyFields = formData => {
  const newFormData = {};
  Object.keys(formData).forEach(key => {
    const viewKey = /^view:/.test(key) ? key : `view:${key}`;
    // Recurse if necessary
    newFormData[viewKey] =
      typeof formData[key] === 'object' && !Array.isArray(formData[key])
        ? viewifyFields(formData[key])
        : formData[key];
  });
  return newFormData;
};

export const focusOnH3 = () => {
  focusElement('#main h3');
};

export const getPrefillIntlPhoneNumber = (phone = {}) => {
  const areaCode = (phone.areaCode || '').trim();
  const phoneNumber = (phone.phoneNumber || '').trim();

  /**
   * All user profile numbers set to the *US* country code by default.
   * This is due to the user endpoint only returning a calling code which is not unique.
   */
  return {
    callingCode: 1,
    countryCode: 'US',
    contact: `${areaCode}${phoneNumber}`,
  };
};

export const getTransformIntlPhoneNumber = (phone = {}) => {
  let _contact = '';
  const { callingCode, contact, countryCode } = phone;

  if (contact) {
    const _callingCode = callingCode ? `+${callingCode} ` : '';
    const _countryCode = countryCode ? ` (${countryCode})` : '';
    _contact = `${_callingCode}${contact}${_countryCode}`;
  }

  return _contact;
};
export const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(number, `ending with ${number.split('').join(' ')}`);
};
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (template) {
      newDate = parse(date, template, new Date());
    }
  } else if (date instanceof Date && isValid(date)) {
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  }
  return isValid(newDate) ? newDate : null;
};

export function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function obfuscate(str, numVisibleChars = 4, obfuscateChar = '●') {
  if (!str) {
    return '';
  }

  if (str.length <= numVisibleChars) {
    return str;
  }

  return (
    obfuscateChar.repeat(str.length - numVisibleChars) +
    str.substring(str.length - numVisibleChars, str.length)
  );
}

const isValidAccountNumber = accountNumber => {
  return /^[a-z0-9]+$/.test(accountNumber);
};

export const validateBankAccountNumber = (
  errors,
  accountNumber,
  formData,
  schema,
  errorMessages,
) => {
  // Compile the regular expression based on the schema pattern
  const accountNumberRegex = new RegExp(schema.pattern);
  // Check if the account number matches the obfuscated format
  const isValidObfuscated = accountNumberRegex.test(accountNumber.trim());
  // Access bank account data from the form
  const { bankAccount } = formData;

  // Check if the provided account number matches the original (obfuscated) account number
  const matchesOriginal =
    accountNumber.trim() === bankAccount.originalAccountNumber;
  // Check if the provided routing number matches the original (obfuscated) routing number
  const routingNumberMatchesOriginal =
    bankAccount.routingNumber === bankAccount.originalRoutingNumber;
  // Validate the account number
  if (
    !isValidAccountNumber(accountNumber) &&
    !(isValidObfuscated && matchesOriginal && routingNumberMatchesOriginal)
  ) {
    errors.addError(errorMessages.pattern);
  }
};

export const validateRoutingNumber = (
  errors,
  routingNumber,
  formData,
  schema,
  errorMessages,
) => {
  // Compile the regular expression based on the schema pattern
  const routingNumberRegex = new RegExp(schema.pattern);
  // Check if the routing number matches the obfuscated format
  const isValidObfuscated = routingNumberRegex.test(routingNumber.trim());
  // Access bank account data from the form
  const { bankAccount } = formData;
  // Check if the provided routing number matches the original (obfuscated) routing number
  const matchesOriginal =
    routingNumber.trim() === bankAccount.originalRoutingNumber;
  // Check if the provided account number matches the original (obfuscated) account number
  const accountNumberMatchesOriginal =
    bankAccount.accountNumber === bankAccount.originalAccountNumber;
  // Validate the routing number
  if (
    !isValidRoutingNumber(routingNumber) &&
    !(isValidObfuscated && matchesOriginal && accountNumberMatchesOriginal)
  ) {
    errors.addError(errorMessages.pattern);
  }
};
