import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { SignatureField } from '@bio-aquia/shared/components/atoms/signature-field';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms/memorable-date-field';
import {
  examinationDateSchema,
  examinerSignatureSchema,
  examinerSignatureDateSchema,
  examinerSignaturePageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Examiner Signature Page
 * Section VIII - Items 43-45: Examination date and examiner signature
 * @module pages/examiner-signature
 */
const ExaminerSignaturePage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      schema: examinerSignaturePageSchema,
      onSubmit: async updateData => {
        try {
          const validatedData = await examinerSignaturePageSchema.parseAsync(
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

  const expectedName = localData.examinerName || '';

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Examination certification</h3>
        </legend>

        <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
          <p className="vads-u-margin--0">
            <strong>Medical Examiner Certification:</strong> By signing below,
            you certify that you have examined the patient and that the
            information provided in this examination is accurate and complete.
          </p>
        </va-alert>

        <p>
          I certify that I have examined the above-named patient and the
          examination findings recorded in this report are true and accurate to
          the best of my professional knowledge. I understand that this
          information will be used to determine eligibility for VA benefits.
        </p>

        {/* Item 43 - Examination date */}
        <MemorableDateField
          label="Date of examination"
          name="examinationDate"
          value={localData.examinationDate || ''}
          onChange={handleFieldChange}
          error={errors.examinationDate}
          required
          schema={examinationDateSchema}
        />

        {/* Item 44 - Examiner signature */}
        <SignatureField
          label="Examiner's signature (Type your full name)"
          name="examinerSignature"
          value={localData.examinerSignature || ''}
          onChange={handleFieldChange}
          error={errors.examinerSignature}
          required
          fullName={expectedName}
          schema={examinerSignatureSchema}
        />

        {/* Item 45 - Date signed */}
        <MemorableDateField
          label="Date signed"
          name="examinerSignatureDate"
          value={
            localData.examinerSignatureDate ||
            new Date().toISOString().split('T')[0]
          }
          onChange={handleFieldChange}
          error={errors.examinerSignatureDate}
          required
          schema={examinerSignatureDateSchema}
        />

        <va-alert status="success" show-icon class="vads-u-margin-top--3">
          <h4 className="vads-u-margin-top--0">Examination complete</h4>
          <p>
            Thank you for completing this examination. The form will now be
            submitted to VA for processing.
          </p>
          <p className="vads-u-margin-bottom--0">
            <strong>Important:</strong> Please provide a copy of this completed
            examination to the patient for their records.
          </p>
        </va-alert>

        <va-additional-info trigger="What happens next?">
          <p>
            After submission, VA will review this examination along with the
            claimant’s application to determine eligibility for Aid and
            Attendance or Housebound benefits.
          </p>
          <p>
            The review process typically takes 3-6 months. The claimant will be
            notified of the decision by mail.
          </p>
          <p>
            If additional information is needed, VA may contact you or request
            additional medical documentation.
          </p>
        </va-additional-info>
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

ExaminerSignaturePage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ExaminerSignaturePage;
