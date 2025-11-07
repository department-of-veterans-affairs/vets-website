import PropTypes from 'prop-types';
import React from 'react';

import {
  CurrencyField,
  MemorableDateField,
  TextareaField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  benefitTypeSchema,
  benefitsDetailsSchema,
  firstPaymentDateSchema,
  grossMonthlyAmountSchema,
  startReceivingDateSchema,
  stopReceivingDateSchema,
} from '../../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, [
    'startReceivingDate',
    'firstPaymentDate',
    'stopReceivingDate',
  ]);
};

/**
 * Benefits Details page component
 * This page collects additional details about benefit entitlements
 * This page is conditional and only shown if benefitEntitlement === 'yes'
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Benefits details form page
 */
export const BenefitsDetailsPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get veteran name
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  return (
    <PageTemplate
      title="Benefit entitlement and/or payments"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={benefitsDetailsSchema}
      sectionName="benefitsDetails"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        benefitType: '',
        grossMonthlyAmount: '',
        startReceivingDate: '',
        firstPaymentDate: '',
        stopReceivingDate: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <div className="vads-u-margin-top--neg2">
            <TextareaField
              name="benefitType"
              label="Type of benefit"
              schema={benefitTypeSchema}
              value={localData.benefitType}
              onChange={handleFieldChange}
              error={errors.benefitType}
              forceShowError={formSubmitted}
              rows={3}
              maxLength={500}
            />

            <CurrencyField
              name="grossMonthlyAmount"
              label="Gross monthly amount of benefit"
              schema={grossMonthlyAmountSchema}
              value={localData.grossMonthlyAmount}
              onChange={handleFieldChange}
              error={errors.grossMonthlyAmount}
              forceShowError={formSubmitted}
            />

            <MemorableDateField
              name="startReceivingDate"
              label={`When did ${veteranName} start receiving this benefit?`}
              schema={startReceivingDateSchema}
              value={localData.startReceivingDate}
              onChange={handleFieldChange}
              error={errors.startReceivingDate}
              forceShowError={formSubmitted}
              required
            />

            <MemorableDateField
              name="firstPaymentDate"
              label={`When did ${veteranName} receive their first payment for this benefit?`}
              schema={firstPaymentDateSchema}
              value={localData.firstPaymentDate}
              onChange={handleFieldChange}
              error={errors.firstPaymentDate}
              forceShowError={formSubmitted}
              required
            />

            <MemorableDateField
              name="stopReceivingDate"
              label={`When will ${veteranName} no longer receive this benefit (if known)?`}
              schema={stopReceivingDateSchema}
              value={localData.stopReceivingDate}
              onChange={handleFieldChange}
              error={errors.stopReceivingDate}
              forceShowError={formSubmitted}
            />
          </div>
        </>
      )}
    </PageTemplate>
  );
};

BenefitsDetailsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default BenefitsDetailsPage;
