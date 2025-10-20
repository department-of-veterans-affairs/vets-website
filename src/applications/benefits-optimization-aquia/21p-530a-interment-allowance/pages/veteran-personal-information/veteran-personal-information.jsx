import PropTypes from 'prop-types';
import React from 'react';

import { TextInputField, SSNField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  fullNameSchema,
  serviceNumberSchema,
  ssnSchema,
  vaFileNumberSchema,
} from '../../schemas';

/**
 * Schema for veteran personal information page
 */
const veteranPersonalInformationSchema = z.object({
  fullName: fullNameSchema,
  ssn: ssnSchema,
  serviceNumber: serviceNumberSchema,
  vaFileNumber: vaFileNumberSchema,
});

/**
 * Veteran Personal Information page component for the interment allowance form.
 * Collects the deceased Veteran's name, Social Security number, VA service number, and VA file number.
 * This is the first page in the "Deceased Veteran information" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Veteran personal information form page
 *
 * @example
 * ```jsx
 * <VeteranPersonalInformationPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const VeteranPersonalInformationPage = ({
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
      title="Personal information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={veteranPersonalInformationSchema}
      sectionName="veteranPersonalInformation"
      defaultData={{
        fullName: {
          first: '',
          middle: '',
          last: '',
          suffix: '',
        },
        ssn: '',
        serviceNumber: '',
        vaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <FullnameField
            value={localData.fullName}
            onChange={handleFieldChange}
            errors={errors.fullName}
            required
            legend="Full name"
            forceShowError={formSubmitted}
          />

          <SSNField
            name="ssn"
            label="Social Security number"
            value={localData.ssn}
            onChange={handleFieldChange}
            required
            error={errors.ssn}
            forceShowError={formSubmitted}
            schema={ssnSchema}
          />

          <TextInputField
            name="serviceNumber"
            label="VA service number"
            value={localData.serviceNumber}
            onChange={handleFieldChange}
            error={errors.serviceNumber}
            forceShowError={formSubmitted}
            schema={serviceNumberSchema}
            hint="Enter this number only if it's different than their Social Security number"
          />

          <TextInputField
            name="vaFileNumber"
            label="VA file number"
            value={localData.vaFileNumber}
            onChange={handleFieldChange}
            error={errors.vaFileNumber}
            forceShowError={formSubmitted}
            schema={vaFileNumberSchema}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranPersonalInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
