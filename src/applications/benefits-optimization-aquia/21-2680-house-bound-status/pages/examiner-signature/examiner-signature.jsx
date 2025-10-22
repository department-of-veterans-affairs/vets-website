import PropTypes from 'prop-types';
import React from 'react';

import { transformDates } from '@bio-aquia/shared/forms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import {
  MemorableDateField,
  SignatureField,
} from '@bio-aquia/shared/components/atoms';
import {
  examinationDateSchema,
  examinerSignatureSchema,
  examinerSignatureDateSchema,
  examinerSignaturePageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

const ensureDateStrings = formData => {
  return transformDates(formData, ['examinationDate', 'examinerSignatureDate']);
};

/**
 * Examiner Signature Page
 * Section VIII - Items 43-45: Examination date and examiner signature
 * @module pages/examiner-signature
 */
export const ExaminerSignaturePage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  const expectedName = formDataToUse.examinerName || '';

  return (
    <PageTemplate
      title="Examination certification"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={examinerSignaturePageSchema}
      sectionName="examinerSignature"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      dataProcessor={ensureDateStrings}
      defaultData={{
        examinationDate: '',
        examinerSignature: '',
        examinerSignatureDate: new Date().toISOString().split('T')[0],
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">
              <h3 className="vads-u-margin--0">Examination certification</h3>
            </legend>

            <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
              <p className="vads-u-margin--0">
                <strong>Medical Examiner Certification:</strong> By signing
                below, you certify that you have examined the patient and that
                the information provided in this examination is accurate and
                complete.
              </p>
            </va-alert>

            <p>
              I certify that I have examined the above-named patient and the
              examination findings recorded in this report are true and accurate
              to the best of my professional knowledge. I understand that this
              information will be used to determine eligibility for VA benefits.
            </p>

            {/* Item 43 - Examination date */}
            <MemorableDateField
              label="Date of examination"
              name="examinationDate"
              value={localData.examinationDate || ''}
              onChange={handleFieldChange}
              error={errors.examinationDate}
              forceShowError={formSubmitted}
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
              forceShowError={formSubmitted}
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
              forceShowError={formSubmitted}
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
                <strong>Important:</strong> Please provide a copy of this
                completed examination to the patient for their records.
              </p>
            </va-alert>

            <va-additional-info trigger="What happens next?">
              <p>
                After submission, VA will review this examination along with the
                claimant’s application to determine eligibility for Aid and
                Attendance or Housebound benefits.
              </p>
              <p>
                The review process typically takes 3-6 months. The claimant will
                be notified of the decision by mail.
              </p>
              <p>
                If additional information is needed, VA may contact you or
                request additional medical documentation.
              </p>
            </va-additional-info>
          </fieldset>
        </>
      )}
    </PageTemplate>
  );
};

ExaminerSignaturePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
