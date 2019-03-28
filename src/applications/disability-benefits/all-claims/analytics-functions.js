import { recordEventOnce } from './utils';
import get from 'platform/utilities/data/get';

const objectIsEmpty = (path, formData) =>
  Object.values(get(path, formData, {})).every(option => !option);

const recordMissingField = name =>
  recordEventOnce(
    {
      event: 'disability-526EZ--response-missing',
      'missing-field-question': name,
    },
    'missing-field-question',
  );

export default {
  claimType: formData => {
    if (objectIsEmpty('view:claimType', formData))
      recordMissingField(
        'Disability - Form 526EZ - Military Service - Start Date',
      );
  },
  militaryHistory: formData => {
    const servicePeriods = get(
      'serviceInformation.servicePeriods',
      formData,
      [],
    );
    if (servicePeriods.some(sp => !get('dateRange.from', sp)))
      recordMissingField(
        'Disability - Form 526EZ - Military Service - Start Date',
      );
    if (servicePeriods.some(sp => !get('dateRange.to', sp)))
      recordMissingField(
        'Disability - Form 526EZ - Military Service - End Date',
      );
  },
  unemployabilityFormIntro: formData => {
    if (!get('view:unemployabilityUploadChoice', formData))
      recordMissingField(
        'Disability - Form 526EZ - Unemployability Walkthrough - Choice',
      );
  },
  pastEmploymentFormIntro: formData => {
    if (objectIsEmpty('view:upload4192Choice', formData))
      recordMissingField(
        'Disability - Form 526EZ - Past Employment Walkthrough - Choice',
      );
  },
  paymentInformation: formData => {
    const paymentInformation = get('view:bankAccount', formData);
    if (paymentInformation && !objectIsEmpty(paymentInformation)) {
      if (!paymentInformation.bankAccountType)
        recordMissingField(
          'Disability - Form 526EZ - Payment Information - Account Type',
        );
      if (!paymentInformation.bankAccountNumber)
        recordMissingField(
          'Disability - Form 526EZ - Payment Information - Account Number',
        );
      if (!paymentInformation.bankRoutingNumber)
        recordMissingField(
          'Disability - Form 526EZ - Payment Information - Routing Number',
        );
      if (!paymentInformation.bankName)
        recordMissingField(
          'Disability - Form 526EZ - Payment Information - Bank Name',
        );
    }
  },
};
