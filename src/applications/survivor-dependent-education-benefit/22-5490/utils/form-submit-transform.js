// this constant maps the values on address.js in vets.json schema from VA.gov values to LTS values
// the lts values were found on the LTS database and LTS validates them, so we need to send correct value from here
const countries = [
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
  { schemaValue: 'MMR', ltsValue: 'BM', label: 'Myanmar' }, // Myanmar is new name of Burma so gave it same code
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
  { schemaValue: 'NFK', ltsValue: 'NF', label: 'Norfolk' }, // Norfolk Island
  { schemaValue: 'NOR', ltsValue: 'NO', label: 'Norway' },
  { schemaValue: 'OMN', ltsValue: 'MU', label: 'Oman' },
  { schemaValue: 'PAK', ltsValue: 'PK', label: 'Pakistan' },
  { schemaValue: 'PAN', ltsValue: 'PM', label: 'Panama' },
  { schemaValue: 'PNG', ltsValue: 'PP', label: 'Papua New Guinea' },
  { schemaValue: 'PRY', ltsValue: 'PA', label: 'Paraguay' },
  { schemaValue: 'PER', ltsValue: 'PE', label: 'Peru' },
  { schemaValue: 'PHL', ltsValue: 'RP', label: 'Philippines' },
  { schemaValue: 'PCN', ltsValue: 'PC', label: 'Pitcairn' }, // Pitcairn Islands
  { schemaValue: 'POL', ltsValue: 'PL', label: 'Poland' },
  { schemaValue: 'PRT', ltsValue: 'PO', label: 'Portugal' },
  { schemaValue: 'QAT', ltsValue: 'QA', label: 'Qatar' },
  { schemaValue: 'REU', ltsValue: 'RE', label: 'Reunion' },
  { schemaValue: 'ROU', ltsValue: 'RO', label: 'Romania' },
  { schemaValue: 'RUS', ltsValue: 'RS', label: 'Russia' },
  { schemaValue: 'RWA', ltsValue: 'RW', label: 'Rwanda' },
  { schemaValue: 'SHN', ltsValue: 'SH', label: 'Saint Helena' }, // not found?
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
  { schemaValue: 'TLS', ltsValue: 'TT', label: 'Timor-Leste' }, // East Timor
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
  countries.find(country => {
    return country.label === 'United States';
  })?.schemaValue || 'USA';

export function getSchemaCountryCode(inputSchemaValue) {
  // Check if inputSchemaValue is undefined or not a string, and return the default value right away.
  if (typeof inputSchemaValue !== 'string') {
    return DEFAULT_SCHEMA_COUNTRY_CODE;
  }
  // Try to find the country based on a three-character code
  let country = countries.find(
    countryInfo => countryInfo.schemaValue === inputSchemaValue,
  );
  // If not found and the input is a two-character code, try finding it based on the LTS value
  if (!country && inputSchemaValue.length === 2) {
    country = countries.find(
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
  let country = countries?.find(
    countryInfo => countryInfo.schemaValue === schemaCountryValue,
  );
  // If no match was found, and the input is a two-character code, try to match against the ltsValue.
  if (!country && schemaCountryValue?.length === 2) {
    country = countries?.find(
      countryInfo => countryInfo?.ltsValue === schemaCountryValue,
    );
  }
  // If a country was found, return the two-character code. If not, return 'ZZ' for unknown.
  return country?.ltsValue ? country.ltsValue : 'ZZ'; // 'ZZ' is the LTS code for unknown.
}

const trimObjectValuesWhiteSpace = (key, value) => {
  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
};

const getNotificationMethod = notificationMethod => {
  switch (notificationMethod) {
    case 'Yes, send me text message notifications':
      return 'TEXT';
    case 'No, just send me email notifications':
      return 'EMAIL';
    default:
      return 'NONE';
  }
};

export function getAddressType(mailingAddress) {
  if (!mailingAddress) {
    return null;
  }

  if (mailingAddress?.livesOnMilitaryBase) {
    return 'MILITARY_OVERSEAS';
  }
  if (mailingAddress?.address?.country === DEFAULT_SCHEMA_COUNTRY_CODE) {
    return 'DOMESTIC';
  }
  return 'FOREIGN';
}

export function transform5490Form(_formConfig, form) {
  const formFieldUserFullName = form?.data?.claimantFullName;
  const viewComponentUserFullName =
    form?.loadedData?.formData?.claimantFullName;

  const userFullName =
    formFieldUserFullName !== undefined &&
    Object.keys(formFieldUserFullName).length > 0
      ? formFieldUserFullName
      : viewComponentUserFullName;

  const payload = {
    formId: form?.formId,
    '@type': 'Chapter35Submission',
    chosenBenefit: form?.data?.chosenBenefit,
    claimant: {
      firstName: userFullName?.first,
      middleName: userFullName?.middle,
      lastName: userFullName?.last,
      suffix: userFullName?.suffix,
      dateOfBirth: form?.data?.claimantDateOfBirth,
      notificationMethod: getNotificationMethod(form?.data?.notificationMethod),
      contactInfo: {
        addressLine1: form?.data?.mailingAddressInput?.address?.street,
        addressLine2: form?.data?.mailingAddressInput?.address?.street2,
        city: form?.data?.mailingAddressInput?.address?.city,
        zipcode: form?.data?.mailingAddressInput?.address?.postalCode,
        emailAddress: form?.data?.email,
        addressType: getAddressType(form?.data?.mailingAddressInput),
        mobilePhoneNumber: form?.data?.mobilePhone?.phone,
        homePhoneNumber: form?.data?.homePhone?.phone,
        countryCode: getLTSCountryCode(
          form?.data?.mailingAddressInput?.address?.country,
        ),
        stateCode: form?.data?.mailingAddressInput?.address?.state,
      },
      preferredContact: form?.data?.contactMethod,
    },
    serviceMember: {
      firstName: form?.data?.fullName?.first,
      lastName: form?.data?.fullName?.last,
      middleName: form?.data?.fullName?.middle,
      relationship: form?.data?.relationshipToMember,
      dateOfBirth: form?.data?.dateOfBirth,
      ssn: form?.data?.ssn,
    },
    highSchoolDiplomaInfo: {
      highSchoolDiplomaOrCertificate: form?.data?.highSchoolDiploma === 'yes',
      highSchoolDiplomaOrCertificateDate: form?.data?.graduationDate,
    },
    directDeposit: {
      directDepositAccountType: form?.data[
        'view:directDeposit'
      ]?.bankAccount?.accountType?.toLowerCase(),
      directDepositAccountNumber:
        form?.data['view:directDeposit']?.bankAccount?.accountNumber,
      directDepositRoutingNumber:
        form?.data['view:directDeposit']?.bankAccount?.routingNumber,
    },
    additionalConsiderations: {
      outstandingFelony: form?.data?.felonyOrWarrant,
      marriageDate: form?.data?.marriageDate,
      marriageStatus: form?.data?.marriageStatus,
      remarriageDate: form?.data?.remarriageDate,
      remarriedSinceDivorce: form?.data?.remarriageStatus,
    },
  };

  return JSON.stringify(payload, trimObjectValuesWhiteSpace, 4);
}
