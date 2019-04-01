import { recordEventOnce } from './utils';
import get from 'platform/utilities/data/get';
import { HOMELESSNESS_TYPES } from './constants';

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
  homelessOrAtRisk: formData => {
    // Much of the logic in here to get when a field is required is duplicated from the homelessness page
    const isHomeless =
      formData.homelessOrAtRisk === HOMELESSNESS_TYPES.homeless;
    const isAtRisk = formData.homelessOrAtRisk === HOMELESSNESS_TYPES.atRisk;
    const isHomelessOrAtRisk = isHomeless || isAtRisk;

    if (!formData.homelessOrAtRisk)
      recordMissingField('Disability - Form 526EZ - Housing Situation - Risk');

    if (isHomeless && !get('view:isHomeless.homelessHousingSituation'))
      recordMissingField(
        'Disability - Form 526EZ - Housing Situation - Homeless Living Situation',
      );

    if (isHomeless && get('view:isHomeless.needToLeaveHousing') === undefined)
      recordMissingField(
        'Disability - Form 526EZ - Housing Situation - Homeless Leave Situation',
      );

    if (isHomelessOrAtRisk) {
      const contact = formData.homelessnessContact;
      if (!contact.name)
        recordMissingField(
          `Disability - Form 526EZ - Housing Situation - ${
            isHomeless ? 'Homeless' : 'At Risk'
          } Contact Name`,
        );
      if (!contact.phoneNumber)
        recordMissingField(
          `Disability - Form 526EZ - Housing Situation - ${
            isHomeless ? 'Homeless' : 'At Risk'
          } Contact Phone`,
        );
    }

    if (isAtRisk && !get('view:isAtRisk.atRiskHousingSituation'))
      recordMissingField(
        'Disability - Form 526EZ - Housing Situation - Homeless Living Situation',
      );
  },
};
