import PropTypes from 'prop-types';
import React from 'react';

import { NumberField, SSNField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  ssnSchema,
  vaFileNumberSchema,
  veteranContactInformationSchema,
} from '../../schemas';

/**
 * Veteran Contact Information page component for the employment information form
 * This page collects veteran's SSN and VA file number
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @param {boolean} props.onReviewPage - Whether page is being edited from review
 * @param {Function} props.updatePage - Callback to exit edit mode
 * @returns {JSX.Element} Veteran contact information form page
 */
export const VeteranContactInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get veteran's name for the title
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'Veteran';

  return (
    <PageTemplate
      title={`${veteranName}'s Social Security number and VA file number`}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranContactInformationSchema}
      sectionName="veteranContactInformation"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        ssn: '',
        vaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <SSNField
            name="ssn"
            label="Social security number"
            schema={ssnSchema}
            value={localData.ssn}
            onChange={handleFieldChange}
            required
            error={errors.ssn}
            forceShowError={formSubmitted}
          />

          <NumberField
            name="vaFileNumber"
            label="VA file number (if applicable)"
            value={localData.vaFileNumber}
            onChange={handleFieldChange}
            error={errors.vaFileNumber}
            forceShowError={formSubmitted}
            schema={vaFileNumberSchema}
            hint="VA file number must be 8 or 9 digits"
            inputmode="numeric"
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranContactInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default VeteranContactInformationPage;
