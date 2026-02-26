export const TELEPHONE_VALIDATION_ENDPOINT =
  'https://qa.vaprofile.va.gov:7005/telephone-validation-service/v1/validate';

export const validationCodes = {
  CORE100:
    'There was an error encountered processing the Request. Please retry, if problem persists, please contact support with a copy of the Response',
  CORE101:
    'You do not have access to perform the requested operation. Please correct your request before trying again! If you believe you have received this access denied error incorrect, please contact your system administrator.',
  CORE105:
    'The request was malformed and could not be processed. Please correct your request before trying again',
  CORE106:
    'The request cannot be null. Please correct your request and try again.',
  PHON100: 'must not be null',
  PHON104: 'size must be between 3 and 3',
  PHON105: 'must not be null',
  PHON106:
    'Invalid Phone Number. Domestic Phone Numbers do not start with 0 or 1, [^0-9[2-9]+-',
  PHON107: 'size must be between 1 and 14',
  PHON108: 'must match "^[0-9]{1,6}$"',
  PHON109: 'must not be null',
  PHON126: 'must match "[2-9]0-9]*-"',
  PHON127: 'size must be between 1 and 6',
  PHON132: 'Country Codes must be between 1 and 3 digits',
  PHON207: 'Domestic phone numbers size must be 7 characters',
  PHON208: 'International phone number must have 12 characters or less.',
  PHON209:
    'Domestic numbers must have an area code and country code must be 1.',
  PHON210:
    'International numbers must have a valid country code that is not 1 and no area code',
  PHON211: 'Invalid Area Code. Area Codes do not end with the same two digits',
  PHON212: 'Invalid Area Code. Area Codes that end with 11 are Service Codes',
  PHON213: 'Invalid Area Code. Area Codes do not include 9 as the middle digit',
  PHON214: 'Invalid Area Code. Area Codes do not start with 37',
  PHON215: 'Invalid Area Code. Area Codes do not start with 96',
  PHON302: 'The phone classification is invalid and may be unusable',
  // TEL101:
  //   'no-cache cache control directive was requested, but authenticated system is not authorized to bypass cache',
  // TEL102:
  //   'Pinpoint service returned error response with message: {0}. Metadata fields will not be populated',
  // TEL103:
  //   'The number of calls to pinpoint has exceeded the configured limit of {0} per 24 hours. Calls to pinpoint will be suspended until the 24 hour counter is reset. Metadata fields will not be populated during this period.',
};
