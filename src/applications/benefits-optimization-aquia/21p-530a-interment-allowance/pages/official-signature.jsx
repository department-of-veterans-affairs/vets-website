import PropTypes from 'prop-types';
import React from 'react';

import {
  FormField,
  MemorableDateField,
  SignatureField,
  TextareaField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  officialSignatureSchema,
  officialTitleSchema,
  remarksSchema,
  signatureDateSchema,
  signatureSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['signatureDate']);
};

/**
 * Official Signature page component for the interment allowance form
 * This page collects state or tribal official's certification and signature
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Official signature form page
 */
export const OfficialSignaturePage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Certification and signature"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={officialSignatureSchema}
      sectionName="officialSignature"
      dataProcessor={ensureDateStrings}
      defaultData={{
        officialSignature: '',
        officialTitle: '',
        signatureDate: '',
        remarks: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <va-alert status="warning" show-icon class="vads-u-margin-bottom--4">
            <h3 slot="headline">Certification statement</h3>
            <p>
              I hereby certify that the veteran named in Item 1 was buried in a
              State-owned Veterans Cemetery or Tribal Cemetery (without charge).
            </p>
            <p>
              I understand that this certification is being made for the purpose
              of claiming the interment allowance under 38 U.S.C. § 2303(b) and
              that any false statement may result in criminal prosecution.
            </p>
          </va-alert>

          <p className="vads-u-margin-bottom--3">
            By signing below, you certify that all information provided in this
            form is true and correct to the best of your knowledge.
          </p>

          <SignatureField
            name="officialSignature"
            label="Signature of state or tribal official delegated responsibility to apply for federal funds"
            schema={signatureSchema}
            value={localData.officialSignature}
            onChange={handleFieldChange}
            required
            signatureHint="Please sign your full name"
            error={errors.officialSignature}
            forceShowError={formSubmitted}
          />

          <FormField
            name="officialTitle"
            label="Title of state or tribal official"
            value={localData.officialTitle}
            onChange={handleFieldChange}
            required
            hint="For example: Cemetery Director, Veterans Affairs Officer"
            error={errors.officialTitle}
            forceShowError={formSubmitted}
            schema={officialTitleSchema}
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

          <TextareaField
            name="remarks"
            label="Remarks (optional)"
            value={localData.remarks}
            onChange={handleFieldChange}
            hint="Provide any additional information relevant to this claim"
            error={errors.remarks}
            forceShowError={formSubmitted}
            schema={remarksSchema}
          />

          <va-alert status="info" show-icon class="vads-u-margin-top--4">
            <h3 slot="headline">Submit to VA</h3>
            <p>
              After completing this form, submit it to:
              <br />
              <strong>VA Pension Intake Center</strong>
              <br />
              P.O. Box 5365
              <br />
              Janesville, WI 53547-5365
            </p>
            <p>Or fax to: 1-844-531-7818</p>
          </va-alert>
        </>
      )}
    </PageTemplate>
  );
};

OfficialSignaturePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
