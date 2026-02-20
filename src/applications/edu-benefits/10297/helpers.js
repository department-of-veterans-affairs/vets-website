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
// this constant maps the values on address.js in vets.json schema from VA.gov values to LTS values
// the lts values were found on the LTS database and LTS validates them, so we need to send correct value from here
const ltsCountries = [
  { schemaValue: 'USA', ltsValue: 'US', label: 'United States' },
  { schemaValue: 'AFG', ltsValue: 'AF', label: 'Afghanistan' },
  { schemaValue: 'ALB', ltsValue: 'AL', label: 'Albania' },
  { schemaValue: 'DZA', ltsValue: 'AG', label: 'Algeria' },
  { schemaValue: 'AND', ltsValue: 'AN', label: 'Andorra' },
  { schemaValue: 'AGO', ltsValue: 'AO', label: 'Angola' },
  { schemaValue: 'AIA', ltsValue: 'AV', label: 'Anguilla' },
  { schemaValue: 'ATA', ltsValue: 'AY', label: 'Antarctica' },
  { schemaValue: 'ATG', ltsValue: 'AC', label: 'Antigua' },
  { schemaValue: 'ARG', ltsValue: 'AR', label: 'Argentina' },
  { schemaValue: 'ARM', ltsValue: 'AM', label: 'Armenia' },
  { schemaValue: 'ABW', ltsValue: 'AA', label: 'Aruba' },
  { schemaValue: 'AUS', ltsValue: 'AS', label: 'Australia' },
  { schemaValue: 'AUT', ltsValue: 'AU', label: 'Austria' },
  { schemaValue: 'AZE', ltsValue: 'AJ', label: 'Azerbaijan' },
  { schemaValue: 'BHS', ltsValue: 'BF', label: 'Bahamas' },
  { schemaValue: 'BHR', ltsValue: 'BA', label: 'Bahrain' },
  { schemaValue: 'BGD', ltsValue: 'BG', label: 'Bangladesh' },
  { schemaValue: 'BRB', ltsValue: 'BB', label: 'Barbados' },
  { schemaValue: 'BLR', ltsValue: 'BO', label: 'Belarus' },
  { schemaValue: 'BEL', ltsValue: 'BE', label: 'Belgium' },
  { schemaValue: 'BLZ', ltsValue: 'BH', label: 'Belize' },
  { schemaValue: 'BEN', ltsValue: 'BN', label: 'Benin' },
  { schemaValue: 'BMU', ltsValue: 'BD', label: 'Bermuda' },
  { schemaValue: 'BTN', ltsValue: 'BT', label: 'Bhutan' },
  { schemaValue: 'BOL', ltsValue: 'BL', label: 'Bolivia' },
  { schemaValue: 'BIH', ltsValue: 'BK', label: 'Bosnia' },
  { schemaValue: 'BWA', ltsValue: 'BC', label: 'Botswana' },
  { schemaValue: 'BVT', ltsValue: 'BV', label: 'Bouvet Island' },
  { schemaValue: 'BRA', ltsValue: 'BR', label: 'Brazil' },
  {
    schemaValue: 'IOT',
    ltsValue: 'IO',
    label: 'British Indian Ocean Territories',
  },
  { schemaValue: 'BRN', ltsValue: 'BX', label: 'Brunei Darussalam' },
  { schemaValue: 'BGR', ltsValue: 'BU', label: 'Bulgaria' },
  { schemaValue: 'BFA', ltsValue: 'UV', label: 'Burkina Faso' },
  { schemaValue: 'BDI', ltsValue: 'BY', label: 'Burundi' },
  { schemaValue: 'KHM', ltsValue: 'CB', label: 'Cambodia' },
  { schemaValue: 'CMR', ltsValue: 'CM', label: 'Cameroon' },
  { schemaValue: 'CAN', ltsValue: 'CA', label: 'Canada' },
  { schemaValue: 'CPV', ltsValue: 'CV', label: 'Cape Verde' },
  { schemaValue: 'CYM', ltsValue: 'CJ', label: 'Cayman' },
  { schemaValue: 'CAF', ltsValue: 'CT', label: 'Central African Republic' },
  { schemaValue: 'TCD', ltsValue: 'CD', label: 'Chad' },
  { schemaValue: 'CHL', ltsValue: 'CI', label: 'Chile' },
  { schemaValue: 'CHN', ltsValue: 'CH', label: 'China' },
  { schemaValue: 'CXR', ltsValue: 'KT', label: 'Christmas Island' },
  { schemaValue: 'CCK', ltsValue: 'CK', label: 'Cocos Islands' },
  { schemaValue: 'COL', ltsValue: 'CO', label: 'Colombia' },
  { schemaValue: 'COM', ltsValue: 'CN', label: 'Comoros' },
  { schemaValue: 'COG', ltsValue: 'CF', label: 'Congo' },
  {
    schemaValue: 'COD',
    ltsValue: 'CG',
    label: 'Democratic Republic of the Congo',
  },
  { schemaValue: 'COK', ltsValue: 'CW', label: 'Cook Islands' },
  { schemaValue: 'CRI', ltsValue: 'CS', label: 'Costa Rica' },
  { schemaValue: 'CIV', ltsValue: 'IV', label: 'Ivory Coast' },
  { schemaValue: 'HRV', ltsValue: 'HR', label: 'Croatia' },
  { schemaValue: 'CUB', ltsValue: 'CU', label: 'Cuba' },
  { schemaValue: 'CYP', ltsValue: 'CY', label: 'Cyprus' },
  { schemaValue: 'CZE', ltsValue: 'EZ', label: 'Czech Republic' },
  { schemaValue: 'DNK', ltsValue: 'DA', label: 'Denmark' },
  { schemaValue: 'DJI', ltsValue: 'DJ', label: 'Djibouti' },
  { schemaValue: 'DMA', ltsValue: 'DO', label: 'Dominica' },
  { schemaValue: 'DOM', ltsValue: 'DR', label: 'Dominican Republic' },
  { schemaValue: 'ECU', ltsValue: 'EC', label: 'Ecuador' },
  { schemaValue: 'EGY', ltsValue: 'EG', label: 'Egypt' },
  { schemaValue: 'SLV', ltsValue: 'ES', label: 'El Salvador' },
  { schemaValue: 'GNQ', ltsValue: 'EK', label: 'Equatorial Guinea' },
  { schemaValue: 'ERI', ltsValue: 'ER', label: 'Eritrea' },
  { schemaValue: 'EST', ltsValue: 'EN', label: 'Estonia' },
  { schemaValue: 'ETH', ltsValue: 'ET', label: 'Ethiopia' },
  { schemaValue: 'FLK', ltsValue: 'FK', label: 'Falkland Islands' },
  { schemaValue: 'FRO', ltsValue: 'FO', label: 'Faroe Islands' },
  { schemaValue: 'FJI', ltsValue: 'FJ', label: 'Fiji' },
  { schemaValue: 'FIN', ltsValue: 'FI', label: 'Finland' },
  { schemaValue: 'FRA', ltsValue: 'FR', label: 'France' },
  { schemaValue: 'GUF', ltsValue: 'FG', label: 'French Guiana' },
  { schemaValue: 'PYF', ltsValue: 'FP', label: 'French Polynesia' },
  { schemaValue: 'ATF', ltsValue: 'FS', label: 'French Southern Territories' },
  { schemaValue: 'GAB', ltsValue: 'GB', label: 'Gabon' },
  { schemaValue: 'GMB', ltsValue: 'GA', label: 'Gambia' },
  { schemaValue: 'GEO', ltsValue: 'GG', label: 'Georgia' },
  { schemaValue: 'DEU', ltsValue: 'GM', label: 'Germany' },
  { schemaValue: 'GHA', ltsValue: 'GH', label: 'Ghana' },
  { schemaValue: 'GIB', ltsValue: 'GI', label: 'Gibraltar' },
  { schemaValue: 'GRC', ltsValue: 'GR', label: 'Greece' },
  { schemaValue: 'GRL', ltsValue: 'GL', label: 'Greenland' },
  { schemaValue: 'GRD', ltsValue: 'GJ', label: 'Grenada' },
  { schemaValue: 'GLP', ltsValue: 'GP', label: 'Guadeloupe' },
  { schemaValue: 'GTM', ltsValue: 'GT', label: 'Guatemala' },
  { schemaValue: 'GIN', ltsValue: 'GV', label: 'Guinea' },
  { schemaValue: 'GNB', ltsValue: 'PU', label: 'Guinea-Bissau' },
  { schemaValue: 'GUY', ltsValue: 'GY', label: 'Guyana' },
  { schemaValue: 'HTI', ltsValue: 'HA', label: 'Haiti' },
  { schemaValue: 'HMD', ltsValue: 'HM', label: 'Heard Island' },
  { schemaValue: 'HND', ltsValue: 'HO', label: 'Honduras' },
  { schemaValue: 'HKG', ltsValue: 'HK', label: 'Hong Kong' },
  { schemaValue: 'HUN', ltsValue: 'HU', label: 'Hungary' },
  { schemaValue: 'ISL', ltsValue: 'IC', label: 'Iceland' },
  { schemaValue: 'IND', ltsValue: 'IN', label: 'India' },
  { schemaValue: 'IDN', ltsValue: 'ID', label: 'Indonesia' },
  { schemaValue: 'IRN', ltsValue: 'IR', label: 'Iran' },
  { schemaValue: 'IRQ', ltsValue: 'IZ', label: 'Iraq' },
  { schemaValue: 'IRL', ltsValue: 'EI', label: 'Ireland' },
  { schemaValue: 'ISR', ltsValue: 'IS', label: 'Israel' },
  { schemaValue: 'ITA', ltsValue: 'IT', label: 'Italy' },
  { schemaValue: 'JAM', ltsValue: 'JM', label: 'Jamaica' },
  { schemaValue: 'JPN', ltsValue: 'JA', label: 'Japan' },
  { schemaValue: 'JOR', ltsValue: 'JO', label: 'Jordan' },
  { schemaValue: 'KAZ', ltsValue: 'KZ', label: 'Kazakhstan' },
  { schemaValue: 'KEN', ltsValue: 'KE', label: 'Kenya' },
  { schemaValue: 'KIR', ltsValue: 'KR', label: 'Kiribati' },
  { schemaValue: 'PRK', ltsValue: 'KN', label: 'North Korea' },
  { schemaValue: 'KOR', ltsValue: 'KS', label: 'South Korea' },
  { schemaValue: 'KWT', ltsValue: 'KU', label: 'Kuwait' },
  { schemaValue: 'KGZ', ltsValue: 'KG', label: 'Kyrgyzstan' },
  { schemaValue: 'LAO', ltsValue: 'LA', label: 'Laos' },
  { schemaValue: 'LVA', ltsValue: 'LG', label: 'Latvia' },
  { schemaValue: 'LBN', ltsValue: 'LE', label: 'Lebanon' },
  { schemaValue: 'LSO', ltsValue: 'LT', label: 'Lesotho' },
  { schemaValue: 'LBR', ltsValue: 'LI', label: 'Liberia' },
  { schemaValue: 'LBY', ltsValue: 'LY', label: 'Libya' },
  { schemaValue: 'LIE', ltsValue: 'LS', label: 'Liechtenstein' },
  { schemaValue: 'LTU', ltsValue: 'LH', label: 'Lithuania' },
  { schemaValue: 'LUX', ltsValue: 'LU', label: 'Luxembourg' },
  { schemaValue: 'MAC', ltsValue: 'MC', label: 'Macao' },
  { schemaValue: 'MKD', ltsValue: 'MK', label: 'Macedonia' },
  { schemaValue: 'MDG', ltsValue: 'MA', label: 'Madagascar' },
  { schemaValue: 'MWI', ltsValue: 'MI', label: 'Malawi' },
  { schemaValue: 'MYS', ltsValue: 'MY', label: 'Malaysia' },
  { schemaValue: 'MDV', ltsValue: 'MV', label: 'Maldives' },
  { schemaValue: 'MLI', ltsValue: 'ML', label: 'Mali' },
  { schemaValue: 'MLT', ltsValue: 'MT', label: 'Malta' },
  { schemaValue: 'MTQ', ltsValue: 'MB', label: 'Martinique' },
  { schemaValue: 'MRT', ltsValue: 'MR', label: 'Mauritania' },
  { schemaValue: 'MUS', ltsValue: 'MP', label: 'Mauritius' },
  { schemaValue: 'MYT', ltsValue: 'MF', label: 'Mayotte' },
  { schemaValue: 'MEX', ltsValue: 'MX', label: 'Mexico' },
  { schemaValue: 'FSM', ltsValue: 'FM', label: 'Micronesia' },
  { schemaValue: 'MDA', ltsValue: 'MD', label: 'Moldova' },
  { schemaValue: 'MCO', ltsValue: 'MN', label: 'Monaco' },
  { schemaValue: 'MNG', ltsValue: 'MG', label: 'Mongolia' },
  { schemaValue: 'MSR', ltsValue: 'MH', label: 'Montserrat' },
  { schemaValue: 'MAR', ltsValue: 'MO', label: 'Morocco' },
  { schemaValue: 'MOZ', ltsValue: 'MZ', label: 'Mozambique' },
  { schemaValue: 'MMR', ltsValue: 'BM', label: 'Myanmar' },
  { schemaValue: 'NAM', ltsValue: 'WA', label: 'Namibia' },
  { schemaValue: 'NRU', ltsValue: 'NR', label: 'Nauru' },
  { schemaValue: 'NPL', ltsValue: 'NP', label: 'Nepal' },
  { schemaValue: 'ANT', ltsValue: 'NT', label: 'Netherlands Antilles' },
  { schemaValue: 'NLD', ltsValue: 'NL', label: 'Netherlands' },
  { schemaValue: 'NCL', ltsValue: 'NC', label: 'New Caledonia' },
  { schemaValue: 'NZL', ltsValue: 'NZ', label: 'New Zealand' },
  { schemaValue: 'NIC', ltsValue: 'NU', label: 'Nicaragua' },
  { schemaValue: 'NER', ltsValue: 'NG', label: 'Niger' },
  { schemaValue: 'NGA', ltsValue: 'NI', label: 'Nigeria' },
  { schemaValue: 'NIU', ltsValue: 'NE', label: 'Niue' },
  { schemaValue: 'NFK', ltsValue: 'NF', label: 'Norfolk' },
  { schemaValue: 'NOR', ltsValue: 'NO', label: 'Norway' },
  { schemaValue: 'OMN', ltsValue: 'MU', label: 'Oman' },
  { schemaValue: 'PAK', ltsValue: 'PK', label: 'Pakistan' },
  { schemaValue: 'PAN', ltsValue: 'PM', label: 'Panama' },
  { schemaValue: 'PNG', ltsValue: 'PP', label: 'Papua New Guinea' },
  { schemaValue: 'PRY', ltsValue: 'PA', label: 'Paraguay' },
  { schemaValue: 'PER', ltsValue: 'PE', label: 'Peru' },
  { schemaValue: 'PHL', ltsValue: 'RP', label: 'Philippines' },
  { schemaValue: 'PCN', ltsValue: 'PC', label: 'Pitcairn' },
  { schemaValue: 'POL', ltsValue: 'PL', label: 'Poland' },
  { schemaValue: 'PRT', ltsValue: 'PO', label: 'Portugal' },
  { schemaValue: 'QAT', ltsValue: 'QA', label: 'Qatar' },
  { schemaValue: 'REU', ltsValue: 'RE', label: 'Reunion' },
  { schemaValue: 'ROU', ltsValue: 'RO', label: 'Romania' },
  { schemaValue: 'RUS', ltsValue: 'RS', label: 'Russia' },
  { schemaValue: 'RWA', ltsValue: 'RW', label: 'Rwanda' },
  { schemaValue: 'SHN', ltsValue: 'SH', label: 'Saint Helena' },
  { schemaValue: 'KNA', ltsValue: 'SC', label: 'Saint Kitts and Nevis' },
  { schemaValue: 'LCA', ltsValue: 'ST', label: 'Saint Lucia' },
  { schemaValue: 'SPM', ltsValue: 'SB', label: 'Saint Pierre and Miquelon' },
  {
    schemaValue: 'VCT',
    ltsValue: 'VC',
    label: 'Saint Vincent and the Grenadines',
  },
  { schemaValue: 'SMR', ltsValue: 'SM', label: 'San Marino' },
  { schemaValue: 'STP', ltsValue: 'TP', label: 'Sao Tome and Principe' },
  { schemaValue: 'SAU', ltsValue: 'SA', label: 'Saudi Arabia' },
  { schemaValue: 'SEN', ltsValue: 'SG', label: 'Senegal' },
  { schemaValue: 'SCG', ltsValue: 'SR', label: 'Serbia' },
  { schemaValue: 'SYC', ltsValue: 'SE', label: 'Seychelles' },
  { schemaValue: 'SLE', ltsValue: 'SL', label: 'Sierra Leone' },
  { schemaValue: 'SGP', ltsValue: 'SN', label: 'Singapore' },
  { schemaValue: 'SVK', ltsValue: 'LO', label: 'Slovakia' },
  { schemaValue: 'SVN', ltsValue: 'SI', label: 'Slovenia' },
  { schemaValue: 'SLB', ltsValue: 'BP', label: 'Solomon Islands' },
  { schemaValue: 'SOM', ltsValue: 'SO', label: 'Somalia' },
  { schemaValue: 'ZAF', ltsValue: 'SF', label: 'South Africa' },
  {
    schemaValue: 'SGS',
    ltsValue: 'SX',
    label: 'South Georgia and the South Sandwich Islands',
  },
  { schemaValue: 'ESP', ltsValue: 'SP', label: 'Spain' },
  { schemaValue: 'LKA', ltsValue: 'CE', label: 'Sri Lanka' },
  { schemaValue: 'SDN', ltsValue: 'SU', label: 'Sudan' },
  { schemaValue: 'SUR', ltsValue: 'NS', label: 'Suriname' },
  { schemaValue: 'SWZ', ltsValue: 'WZ', label: 'Swaziland' },
  { schemaValue: 'SWE', ltsValue: 'SW', label: 'Sweden' },
  { schemaValue: 'CHE', ltsValue: 'SZ', label: 'Switzerland' },
  { schemaValue: 'SYR', ltsValue: 'SY', label: 'Syrian Arab Republic' },
  { schemaValue: 'TWN', ltsValue: 'TW', label: 'Taiwan' },
  { schemaValue: 'TJK', ltsValue: 'TI', label: 'Tajikistan' },
  { schemaValue: 'TZA', ltsValue: 'TZ', label: 'Tanzania' },
  { schemaValue: 'THA', ltsValue: 'TH', label: 'Thailand' },
  { schemaValue: 'TLS', ltsValue: 'TT', label: 'Timor-Leste' },
  { schemaValue: 'TGO', ltsValue: 'TO', label: 'Togo' },
  { schemaValue: 'TKL', ltsValue: 'TL', label: 'Tokelau' },
  { schemaValue: 'TON', ltsValue: 'TN', label: 'Tonga' },
  { schemaValue: 'TTO', ltsValue: 'TD', label: 'Trinidad and Tobago' },
  { schemaValue: 'TUN', ltsValue: 'TS', label: 'Tunisia' },
  { schemaValue: 'TUR', ltsValue: 'TU', label: 'Turkey' },
  { schemaValue: 'TKM', ltsValue: 'TX', label: 'Turkmenistan' },
  { schemaValue: 'TCA', ltsValue: 'TK', label: 'Turks and Caicos Islands' },
  { schemaValue: 'TUV', ltsValue: 'TV', label: 'Tuvalu' },
  { schemaValue: 'UGA', ltsValue: 'UG', label: 'Uganda' },
  { schemaValue: 'UKR', ltsValue: 'UP', label: 'Ukraine' },
  { schemaValue: 'ARE', ltsValue: 'AE', label: 'United Arab Emirates' },
  { schemaValue: 'GBR', ltsValue: 'UK', label: 'United Kingdom' },
  { schemaValue: 'URY', ltsValue: 'UY', label: 'Uruguay' },
  { schemaValue: 'UZB', ltsValue: 'UZ', label: 'Uzbekistan' },
  { schemaValue: 'VUT', ltsValue: 'NH', label: 'Vanuatu' },
  { schemaValue: 'VAT', ltsValue: 'VT', label: 'Vatican' },
  { schemaValue: 'VEN', ltsValue: 'VE', label: 'Venezuela' },
  { schemaValue: 'VNM', ltsValue: 'VM', label: 'Vietnam' },
  { schemaValue: 'VGB', ltsValue: 'VI', label: 'British Virgin Islands' },
  { schemaValue: 'WLF', ltsValue: 'WF', label: 'Wallis and Futuna' },
  { schemaValue: 'ESH', ltsValue: 'WI', label: 'Western Sahara' },
  { schemaValue: 'YEM', ltsValue: 'YM', label: 'Yemen' },
  { schemaValue: 'ZMB', ltsValue: 'ZA', label: 'Zambia' },
  { schemaValue: 'ZWE', ltsValue: 'ZI', label: 'Zimbabwe' },
];

const DEFAULT_SCHEMA_COUNTRY_CODE =
  ltsCountries.find(country => {
    return country.label === 'United States';
  })?.schemaValue || 'USA';

export function getSchemaCountryCode(inputSchemaValue) {
  // Check if inputSchemaValue is undefined or not a string, and return the default value right away.
  if (typeof inputSchemaValue !== 'string') {
    return DEFAULT_SCHEMA_COUNTRY_CODE;
  }
  // Try to find the country based on a three-character code
  let country = ltsCountries.find(
    countryInfo => countryInfo.schemaValue === inputSchemaValue,
  );
  // If not found and the input is a two-character code, try finding it based on the LTS value
  if (!country && inputSchemaValue.length === 2) {
    country = ltsCountries.find(
      countryInfo => countryInfo.ltsValue === inputSchemaValue,
    );
  }
  // Return the found schemaValue or the default one if no country was found
  return country?.schemaValue
    ? country.schemaValue
    : DEFAULT_SCHEMA_COUNTRY_CODE;
}

export function getLTSCountryCode(schemaCountryValue) {
  // Start by assuming the input is a three-character code.
  let country = ltsCountries.find(
    countryInfo => countryInfo.schemaValue === schemaCountryValue,
  );
  // If no match was found, and the input is a two-character code, try to match against the ltsValue.
  if (!country && schemaCountryValue?.length === 2) {
    country = ltsCountries.find(
      countryInfo => countryInfo.ltsValue === schemaCountryValue,
    );
  }
  // If a country was found, return the two-character code. If not, return 'ZZ' for unknown.
  return country?.ltsValue ? country.ltsValue : 'ZZ';
}

export const lastDayOfMonth = (month, year = NaN) => {
  const lastDay = new Date(year, month, 0).getDate();

  // default values if provided year or month are invalid/blank
  if (isNaN(lastDay)) {
    switch (month) {
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      case 2:
        return 29;
      default:
        return 31;
    }
  }

  return lastDay;
};
