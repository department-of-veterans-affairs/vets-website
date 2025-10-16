import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { SignatureField } from '@bio-aquia/shared/components/atoms/signature-field';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms/memorable-date-field';
import {
  claimantSignatureSchema,
  claimantSignatureDateSchema,
  claimantSignaturePageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Claimant Signature Page
 * Section V - Items 15A-15B: Claimant certification and signature
 * @module pages/claimant-signature
 */
const ClaimantSignaturePage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      schema: claimantSignaturePageSchema,
      onSubmit: async updateData => {
        try {
          const validatedData = await claimantSignaturePageSchema.parseAsync(
            updateData,
          );
          updatePage(validatedData);
          goForward();
        } catch (error) {
          // Validation error is handled by the form
        }
      },
    },
  );

  const expectedName =
    localData.isVeteranClaimant === 'yes'
      ? `${localData.veteranFirstName || ''} ${localData.veteranLastName || ''}`
      : `${localData.claimantFirstName || ''} ${localData.claimantLastName ||
          ''}`;

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">
            Claimant certification and signature
          </h3>
        </legend>

        <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
          <p className="vads-u-margin--0">
            <strong>Important:</strong> By signing this form, you certify that
            the information provided is true and correct to the best of your
            knowledge.
          </p>
        </va-alert>

        <p>
          I certify that the statements made in this claim are true and complete
          to the best of my knowledge. I understand that VA may investigate to
          verify the information I have provided. I also understand that if I
          knowingly give false or misleading information, I may be fined or
          imprisoned, or both.
        </p>

        <p>
          I authorize any person or entity, including but not limited to any
          organization, service provider, employer, or government agency, to
          give VA any information about me except information about drug abuse,
          sickle cell anemia, or infection with Human Immunodeficiency Virus,
          and I waive any privilege which makes the information confidential.
        </p>

        <p>
          If the claimant served on active duty after September 7, 1980, as an
          enlisted person, or after October 16, 1981, as an officer and became
          disabled while serving, he/she may be eligible for the home loan
          benefits based upon the disability.
        </p>

        {/* Item 15A - Signature */}
        <SignatureField
          label="Signature of claimant (Type your full name)"
          name="claimantSignature"
          value={localData.claimantSignature || ''}
          onChange={handleFieldChange}
          error={errors.claimantSignature}
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
          required
          schema={claimantSignatureDateSchema}
        />

        <va-alert status="warning" show-icon class="vads-u-margin-top--3">
          <h4 className="vads-u-margin-top--0">Next steps</h4>
          <p>
            After you submit this section, a qualified medical professional must
            complete the examination sections (VI-VIII) of this form. The
            medical professional must be:
          </p>
          <ul>
            <li>Physician (MD or DO)</li>
            <li>Physician Assistant (PA)</li>
            <li>Advanced Practice Registered Nurse (APRN)</li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            You’ll need to provide this form to your medical professional for
            completion.
          </p>
        </va-alert>
      </fieldset>

      <div className="vads-u-margin-top--4">
        <va-button back onClick={goBack}>
          Back
        </va-button>
        <va-button continue type="submit">
          Continue
        </va-button>
      </div>
    </form>
  );
};

ClaimantSignaturePage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ClaimantSignaturePage;
