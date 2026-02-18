// These utilities are used for Supplemental Claims and Higher-Level Review /start pages
// where we ask about whether the user is filing for a disability compensation claim or
// a claim other than disability compensation. If you select "a claim other than disability
// compensation", you are seeing the "other" page rather than the "start" page (although the
// URL remains the same)
import recordEvent from 'platform/monitoring/record-event';
import { DEFAULT_BENEFIT_TYPE } from '../constants';

export const PAGE_NAMES = {
  start: 'start',
  other: 'other',
};

export const recordBenefitTypeEvent = (benefitType, label) => {
  recordEvent({
    event: 'howToWizard-formChange',
    'form-field-type': 'form-radio-buttons',
    'form-field-label': label,
    'form-field-value': benefitType,
  });

  if (benefitType !== DEFAULT_BENEFIT_TYPE) {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'veteran wants to submit an unsupported claim type',
    });
  }
};

export const options = [
  {
    value: DEFAULT_BENEFIT_TYPE,
    label: 'Disability compensation claim',
  },
  {
    value: PAGE_NAMES.other,
    label: 'A claim other than disability compensation',
  },
];

export const optionValues = options.map(option => option.value);

export const getNextPage = (baseUrl, data) =>
  data?.benefitType === optionValues[0]
    ? `${baseUrl}/introduction` // valid benefit type, go to intro page
    : PAGE_NAMES.other; // benefit type not supported

export const validateBenefitType = benefitType =>
  optionValues.includes(benefitType);

export const recordBenefitOfficeClickEvent = () => {
  recordEvent({
    event: 'howToWizard-alert-link-click',
    'howToWizard-alert-link-click-label': 'benefit office',
  });
};
