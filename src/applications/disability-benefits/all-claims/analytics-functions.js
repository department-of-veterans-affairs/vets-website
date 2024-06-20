import { recordEventOnce } from 'platform/monitoring/record-event';
import get from 'platform/utilities/data/get';
import { HOMELESSNESS_TYPES } from './constants';

const objectIsEmpty = (obj, path) =>
  Object.values(typeof path === 'string' ? get(path, obj, {}) : obj).every(
    option => !option,
  );

const recordMissingField = name =>
  recordEventOnce(
    {
      event: 'disability-526EZ--response-missing',
      'missing-field-question': name,
    },
    'missing-field-question',
  );

export default {
  /**
   * Records a missing field event once when claim type is not specified
   * @param {Object} formData - Full formData for the form
   */
  claimType: formData => {
    if (objectIsEmpty(formData, 'view:claimType')) {
      recordMissingField(
        'Disability - Form 526EZ - Military Service - Start Date',
      );
    }
  },
  /**
   * Records a missing field event when the military service history items are
   * missing a start date or end date
   * @param {Object} formData - Full formData for the form
   */
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
  /**
   * Records missing field event if unemployability upload choice is not specified
   * @param {Object} formData - Full formData for the form
   */
  unemployabilityFormIntro: formData => {
    if (!get('view:unemployabilityUploadChoice', formData))
      recordMissingField(
        'Disability - Form 526EZ - Unemployability Walkthrough - Choice',
      );
  },
  /**
   * Records missing field event when 4192 upload choice is not specified
   * @param {Object} formData - Full formData for the form
   */
  pastEmploymentFormIntro: formData => {
    if (objectIsEmpty(formData, 'view:upload4192Choice'))
      recordMissingField(
        'Disability - Form 526EZ - Past Employment Walkthrough - Choice',
      );
  },
  /**
   * Records missing field events for account type, account number, routing
   * number or bank name
   * @param {Object} formData - Full formData for the form
   */
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
  /**
   * Records missing field events when various housing situation data is missing
   * @param {Object} formData - Full formData for the form
   */
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
      if (!contact?.name)
        recordMissingField(
          `Disability - Form 526EZ - Housing Situation - ${
            isHomeless ? 'Homeless' : 'At Risk'
          } Contact Name`,
        );
      if (!contact?.phoneNumber)
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
