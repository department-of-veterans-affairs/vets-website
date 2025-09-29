import PropTypes from 'prop-types';
import React from 'react';

import {
  CheckboxField,
  FormField,
  RadioField,
  TextareaField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { nursingCareInfoSchema } from '../schemas';

/**
 * Nursing Care Information page component for the nursing home information form
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Nursing care information form page
 */
export const NursingCareInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  const careTypeOptions = [
    { label: 'Skilled nursing care', value: 'skilled' },
    { label: 'Intermediate care', value: 'intermediate' },
    { label: 'Domiciliary care', value: 'domiciliary' },
    { label: 'Adult day health care', value: 'adult-day-health' },
    { label: 'Other', value: 'other' },
  ];

  return (
    <PageTemplate
      title="Care and Payment Information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={nursingCareInfoSchema}
      sectionName="nursingCareInfo"
      defaultData={{
        careType: '',
        requiresNursingCare: false,
        nursingCareDetails: '',
        paymentInfo: {
          medicaidCoverage: false,
          medicaidNumber: '',
          monthlyPayment: 0,
          admissionFromHospital: false,
          hospitalName: '',
          hospitalAdmissionDate: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="careType"
            label="Type of care you're receiving"
            value={localData.careType}
            options={careTypeOptions}
            onChange={handleFieldChange}
            required
            error={errors.careType}
            forceShowError={formSubmitted}
          />

          <CheckboxField
            name="requiresNursingCare"
            label="I require nursing home care"
            value={localData.requiresNursingCare}
            onChange={handleFieldChange}
            error={errors.requiresNursingCare}
            forceShowError={formSubmitted}
          />

          {localData.requiresNursingCare && (
            <TextareaField
              name="nursingCareDetails"
              label="Please describe why you require nursing care"
              value={localData.nursingCareDetails}
              onChange={handleFieldChange}
              error={errors.nursingCareDetails}
              forceShowError={formSubmitted}
              maxLength={500}
            />
          )}

          <fieldset>
            <legend className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-margin-top--2">
              Payment Information
            </legend>

            <CheckboxField
              name="paymentInfo.medicaidCoverage"
              label="I have Medicaid coverage"
              value={localData.paymentInfo?.medicaidCoverage}
              onChange={value =>
                handleFieldChange('paymentInfo.medicaidCoverage', value)
              }
              error={errors.paymentInfo?.medicaidCoverage}
              forceShowError={formSubmitted}
            />

            {localData.paymentInfo?.medicaidCoverage && (
              <FormField
                name="paymentInfo.medicaidNumber"
                label="Medicaid Number"
                value={localData.paymentInfo?.medicaidNumber}
                onChange={value =>
                  handleFieldChange('paymentInfo.medicaidNumber', value)
                }
                error={errors.paymentInfo?.medicaidNumber}
                forceShowError={formSubmitted}
              />
            )}

            <FormField
              name="paymentInfo.monthlyPayment"
              label="Monthly payment amount to nursing home (if any)"
              value={localData.paymentInfo?.monthlyPayment}
              onChange={value =>
                handleFieldChange('paymentInfo.monthlyPayment', value)
              }
              type="number"
              hint="Enter the amount in dollars"
              error={errors.paymentInfo?.monthlyPayment}
              forceShowError={formSubmitted}
            />

            <CheckboxField
              name="paymentInfo.admissionFromHospital"
              label="I was admitted from a hospital"
              value={localData.paymentInfo?.admissionFromHospital}
              onChange={value =>
                handleFieldChange('paymentInfo.admissionFromHospital', value)
              }
              error={errors.paymentInfo?.admissionFromHospital}
              forceShowError={formSubmitted}
            />

            {localData.paymentInfo?.admissionFromHospital && (
              <>
                <FormField
                  name="paymentInfo.hospitalName"
                  label="Hospital name"
                  value={localData.paymentInfo?.hospitalName}
                  onChange={value =>
                    handleFieldChange('paymentInfo.hospitalName', value)
                  }
                  error={errors.paymentInfo?.hospitalName}
                  forceShowError={formSubmitted}
                />

                <FormField
                  name="paymentInfo.hospitalAdmissionDate"
                  label="Date admitted to hospital"
                  value={localData.paymentInfo?.hospitalAdmissionDate}
                  onChange={value =>
                    handleFieldChange(
                      'paymentInfo.hospitalAdmissionDate',
                      value,
                    )
                  }
                  type="date"
                  error={errors.paymentInfo?.hospitalAdmissionDate}
                  forceShowError={formSubmitted}
                />
              </>
            )}
          </fieldset>
        </>
      )}
    </PageTemplate>
  );
};

NursingCareInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
