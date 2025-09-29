import PropTypes from 'prop-types';
import React from 'react';

import {
  FormField,
  MemorableDateField,
  PhoneField,
  SignatureField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  officialInfoAndSignatureSchema,
  officialPhoneSchema,
  officialSignatureSchema,
  signatureDateSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['signatureDate']);
};

/**
 * Official Info and Signature page component for the nursing home information form
 * This page collects nursing home official's information and signature
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Official info and signature form page
 */
export const OfficialInfoAndSignaturePage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Nursing home official information and signature"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={officialInfoAndSignatureSchema}
      sectionName="officialInfoAndSignature"
      dataProcessor={ensureDateStrings}
      defaultData={{
        officialName: '',
        officialTitle: '',
        officialPhone: '',
        officialSignature: '',
        signatureDate: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide the following information for the nursing home
            official certifying this form.
          </p>

          <FormField
            name="officialName"
            label="Official's full name"
            value={localData.officialName}
            onChange={handleFieldChange}
            required
            error={errors.officialName}
            forceShowError={formSubmitted}
          />

          <FormField
            name="officialTitle"
            label="Official's title"
            value={localData.officialTitle}
            onChange={handleFieldChange}
            required
            hint="For example: Administrator, Director of Nursing, Medical Director"
            error={errors.officialTitle}
            forceShowError={formSubmitted}
          />

          <PhoneField
            name="officialPhone"
            label="Official's office phone number"
            schema={officialPhoneSchema}
            value={localData.officialPhone}
            onChange={handleFieldChange}
            required
            error={errors.officialPhone}
            forceShowError={formSubmitted}
          />

          <va-alert status="warning" show-icon class="vads-u-margin-y--2">
            <h3 slot="headline">Certification</h3>
            <p>
              By signing below, I certify and declare under penalty of perjury
              under the laws of the United States of America that the
              information I have provided is true and correct. I understand that
              providing false or fraudulent information may result in criminal
              prosecution under 18 U.S.C. §§ 287, 1001.
            </p>
          </va-alert>

          <SignatureField
            name="officialSignature"
            label="Official's signature"
            schema={officialSignatureSchema}
            value={localData.officialSignature}
            onChange={handleFieldChange}
            required
            signatureHint="Please sign your full name"
            error={errors.officialSignature}
            forceShowError={formSubmitted}
          />

          <MemorableDateField
            name="signatureDate"
            label="Date signed"
            schema={signatureDateSchema}
            value={
              localData.signatureDate || new Date().toISOString().split('T')[0]
            }
            onChange={handleFieldChange}
            required
            hint="Enter today's date"
            error={errors.signatureDate}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

OfficialInfoAndSignaturePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
