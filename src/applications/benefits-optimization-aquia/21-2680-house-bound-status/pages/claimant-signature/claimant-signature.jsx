import PropTypes from 'prop-types';
import React from 'react';

import { transformDates } from '@bio-aquia/shared/forms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import {
  MemorableDateField,
  SignatureField,
} from '@bio-aquia/shared/components/atoms';
import {
  claimantSignatureSchema,
  claimantSignatureDateSchema,
  claimantSignaturePageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

const ensureDateStrings = formData => {
  return transformDates(formData, ['claimantSignatureDate']);
};

/**
 * Claimant Signature Page
 * Section V - Items 15A-15B: Claimant certification and signature
 * @module pages/claimant-signature
 */
export const ClaimantSignaturePage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  const expectedName =
    formDataToUse.isVeteranClaimant === 'yes'
      ? `${formDataToUse.veteranFirstName ||
          ''} ${formDataToUse.veteranLastName || ''}`
      : `${formDataToUse.claimantFirstName ||
          ''} ${formDataToUse.claimantLastName || ''}`;

  return (
    <PageTemplate
      title="Claimant certification and signature"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantSignaturePageSchema}
      sectionName="claimantSignature"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      dataProcessor={ensureDateStrings}
      defaultData={{
        claimantSignature: '',
        claimantSignatureDate: new Date().toISOString().split('T')[0],
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">
              <h3 className="vads-u-margin--0">
                Claimant certification and signature
              </h3>
            </legend>

            <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
              <p className="vads-u-margin--0">
                <strong>Important:</strong> By signing this form, you certify
                that the information provided is true and correct to the best of
                your knowledge.
              </p>
            </va-alert>

            <p>
              I certify that the statements made in this claim are true and
              complete to the best of my knowledge. I understand that VA may
              investigate to verify the information I have provided. I also
              understand that if I knowingly give false or misleading
              information, I may be fined or imprisoned, or both.
            </p>

            <p>
              I authorize any person or entity, including but not limited to any
              organization, service provider, employer, or government agency, to
              give VA any information about me except information about drug
              abuse, sickle cell anemia, or infection with Human
              Immunodeficiency Virus, and I waive any privilege which makes the
              information confidential.
            </p>

            <p>
              If the claimant served on active duty after September 7, 1980, as
              an enlisted person, or after October 16, 1981, as an officer and
              became disabled while serving, he/she may be eligible for the home
              loan benefits based upon the disability.
            </p>

            {/* Item 15A - Signature */}
            <SignatureField
              label="Signature of claimant (Type your full name)"
              name="claimantSignature"
              value={localData.claimantSignature || ''}
              onChange={handleFieldChange}
              error={errors.claimantSignature}
              forceShowError={formSubmitted}
              required
              fullName={expectedName.trim()}
              schema={claimantSignatureSchema}
            />

            {/* Item 15B - Date */}
            <MemorableDateField
              label="Date signed"
              name="claimantSignatureDate"
              value={
                localData.claimantSignatureDate ||
                new Date().toISOString().split('T')[0]
              }
              onChange={handleFieldChange}
              error={errors.claimantSignatureDate}
              forceShowError={formSubmitted}
              required
              schema={claimantSignatureDateSchema}
            />

            <va-alert status="warning" show-icon class="vads-u-margin-top--3">
              <h4 className="vads-u-margin-top--0">Next steps</h4>
              <p>
                After you submit this section, a qualified medical professional
                must complete the examination sections (VI-VIII) of this form.
                The medical professional must be:
              </p>
              <ul>
                <li>Physician (MD or DO)</li>
                <li>Physician Assistant (PA)</li>
                <li>Advanced Practice Registered Nurse (APRN)</li>
              </ul>
              <p className="vads-u-margin-bottom--0">
                You’ll need to provide this form to your medical professional
                for completion.
              </p>
            </va-alert>
          </fieldset>
        </>
      )}
    </PageTemplate>
  );
};

ClaimantSignaturePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
