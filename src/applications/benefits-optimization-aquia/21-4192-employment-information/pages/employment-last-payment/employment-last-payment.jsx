import PropTypes from 'prop-types';
import React from 'react';

import {
  CurrencyField,
  MemorableDateField,
  RadioField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateOfLastPaymentSchema,
  datePaidSchema,
  employmentLastPaymentSchema,
  grossAmountLastPaymentSchema,
  grossAmountPaidSchema,
  lumpSumPaymentSchema,
} from '../../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfLastPayment', 'datePaid']);
};

/**
 * Employment Last Payment page component
 * This page collects information about the last payment received
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Employment last payment form page
 */
export const EmploymentLastPaymentPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Employment information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={employmentLastPaymentSchema}
      sectionName="employmentLastPayment"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        dateOfLastPayment: '',
        grossAmountLastPayment: '',
        lumpSumPayment: '',
        grossAmountPaid: '',
        datePaid: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h3 className="vads-u-margin-top--0">Last payment</h3>

          <MemorableDateField
            name="dateOfLastPayment"
            label="Date of last payment"
            schema={dateOfLastPaymentSchema}
            value={localData.dateOfLastPayment}
            onChange={handleFieldChange}
            error={errors.dateOfLastPayment}
            forceShowError={formSubmitted}
          />

          <CurrencyField
            name="grossAmountLastPayment"
            label="Gross amount of last payment"
            value={localData.grossAmountLastPayment}
            onChange={handleFieldChange}
            error={errors.grossAmountLastPayment}
            forceShowError={formSubmitted}
            schema={grossAmountLastPaymentSchema}
          />

          <RadioField
            name="lumpSumPayment"
            label="Was lump sum payment made?"
            schema={lumpSumPaymentSchema}
            value={localData.lumpSumPayment}
            onChange={handleFieldChange}
            error={errors.lumpSumPayment}
            forceShowError={formSubmitted}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />

          <CurrencyField
            name="grossAmountPaid"
            label="Gross amount paid"
            value={localData.grossAmountPaid}
            onChange={handleFieldChange}
            error={errors.grossAmountPaid}
            forceShowError={formSubmitted}
            schema={grossAmountPaidSchema}
          />

          <MemorableDateField
            name="datePaid"
            label="Date paid"
            schema={datePaidSchema}
            value={localData.datePaid}
            onChange={handleFieldChange}
            error={errors.datePaid}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

EmploymentLastPaymentPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default EmploymentLastPaymentPage;
