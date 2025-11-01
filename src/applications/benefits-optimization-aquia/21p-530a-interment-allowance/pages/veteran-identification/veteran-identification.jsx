import PropTypes from 'prop-types';
import React from 'react';

import { SSNField, TextInputField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  ssnSchema,
  vaFileNumberSchema,
  serviceNumberSchema,
} from '../../schemas';

/**
 * Schema for veteran identification page
 */
const veteranIdentificationSchema = z.object({
  ssn: ssnSchema,
  serviceNumber: serviceNumberSchema,
  vaFileNumber: vaFileNumberSchema,
});

/**
 * Veteran Identification page component for the interment allowance form
 * This page collects deceased veteran's SSN, service number, and VA file number
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Veteran identification form page
 */
export const VeteranIdentificationPage = ({
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
      title="Veteran's identification information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={veteranIdentificationSchema}
      sectionName="veteranIdentification"
      defaultData={{
        ssn: '',
        serviceNumber: '',
        vaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <SSNField
            name="ssn"
            label="Social Security number"
            schema={ssnSchema}
            value={localData.ssn}
            onChange={handleFieldChange}
            required
            error={errors.ssn}
            forceShowError={formSubmitted}
          />

          <TextInputField
            name="serviceNumber"
            label="VA service number"
            value={localData.serviceNumber}
            onChange={handleFieldChange}
            error={errors.serviceNumber}
            forceShowError={formSubmitted}
            hint="Enter this number only if it's different than their Social Security number"
            schema={serviceNumberSchema}
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

VeteranIdentificationPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
