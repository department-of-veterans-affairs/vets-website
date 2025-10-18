import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';

/**
 * Certification Page
 * Final section - Employer certification and signature
 * @module pages/certification
 */
const CertificationPage = ({ data, goBack, goForward, updatePage }) => {
  const [certificationChecked, setCertificationChecked] = useState(false);
  const [signatureMatches, setSignatureMatches] = useState(false);

  const {
    localData,
    handleFieldChange,
    handleSubmit,
    errors,
    setErrors,
  } = useFormSection({
    initialData: data,
    // schema: certificationSchema,
    onSubmit: updateData => {
      // Additional validation for certification
      const newErrors = {};

      if (!certificationChecked) {
        newErrors.certification =
          'You must certify the information is accurate';
      }

      if (!localData.employerSignature) {
        newErrors.employerSignature = 'Signature is required';
      }

      if (!localData.signerTitle) {
        newErrors.signerTitle = 'Title is required';
      }

      if (!signatureMatches) {
        newErrors.employerSignature =
          'Signature must match the name of the person signing';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      updatePage({
        ...updateData,
        certificationChecked,
        signatureDate: new Date().toISOString(),
      });
      goForward();
    },
  });

  // Check if signature matches signer name
  const handleSignatureChange = value => {
    handleFieldChange('employerSignature', value);
    if (localData.signerName) {
      setSignatureMatches(
        value.toLowerCase() === localData.signerName.toLowerCase(),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Employer certification</h3>
        </legend>

        <va-alert status="warning" show-icon class="vads-u-margin-bottom--2">
          <h4 slot="headline">Certification required</h4>
          <p>
            By signing this form, you certify that the information provided is
            true and complete to the best of your knowledge. False statements
            may result in criminal prosecution.
          </p>
        </va-alert>

        {/* Signer information */}
        <va-text-input
          label="Name of person signing (employer or authorized representative)"
          name="signerName"
          value={localData.signerName || ''}
          onInput={e => handleFieldChange('signerName', e.target.value)}
          error={errors.signerName}
          required
        />

        <va-text-input
          label="Title/Position"
          name="signerTitle"
          value={localData.signerTitle || ''}
          onInput={e => handleFieldChange('signerTitle', e.target.value)}
          error={errors.signerTitle}
          required
          hint="Examples: HR Manager, Payroll Supervisor, Unit Commander"
        />

        <va-text-input
          label="Phone number"
          name="signerPhone"
          value={localData.signerPhone || ''}
          onInput={e => handleFieldChange('signerPhone', e.target.value)}
          error={errors.signerPhone}
          required
          type="tel"
          hint="10-digit phone number"
        />

        <va-text-input
          label="Email address"
          name="signerEmail"
          value={localData.signerEmail || ''}
          onInput={e => handleFieldChange('signerEmail', e.target.value)}
          error={errors.signerEmail}
          type="email"
        />

        {/* Certification checkbox */}
        <va-checkbox
          label="I certify that the information in this form is true and complete"
          name="certification"
          checked={certificationChecked}
          onVaChange={e => setCertificationChecked(e.detail.checked)}
          error={errors.certification}
          required
          message-aria-describedby="certification-text"
        />

        <div id="certification-text" className="vads-u-margin-y--2">
          <p className="vads-u-font-size--sm">I understand that:</p>
          <ul className="vads-u-font-size--sm">
            <li>
              The information provided will be used to determine the Veteran’s
              eligibility for Individual Unemployability benefits
            </li>
            <li>
              Providing false or fraudulent information may result in criminal
              prosecution under 18 U.S.C. §§ 287, 1001
            </li>
            <li>VA may contact me for additional information if needed</li>
          </ul>
        </div>

        {/* Electronic signature - Item 23A */}
        <va-text-input
          label="Electronic signature of employer or supervisor"
          name="employerSignature"
          value={localData.employerSignature || ''}
          onInput={e => handleSignatureChange(e.target.value)}
          error={errors.employerSignature}
          required
          hint="Type your full name as it appears above to serve as your electronic signature"
        />

        {localData.employerSignature &&
          !signatureMatches && (
            <va-alert status="warning" class="vads-u-margin-top--1">
              <p className="vads-u-margin--0">
                Signature must match the name of the person signing
              </p>
            </va-alert>
          )}

        {/* Display signature date - Item 23B */}
        <div className="vads-u-margin-top--2">
          <strong>Date signed:</strong> {new Date().toLocaleDateString()}
        </div>

        {/* Additional notes */}
        <va-textarea
          label="Additional comments or clarifications (optional)"
          name="additionalComments"
          value={localData.additionalComments || ''}
          onInput={e => handleFieldChange('additionalComments', e.target.value)}
          error={errors.additionalComments}
          maxlength="500"
        />
      </fieldset>

      <va-alert status="info" show-icon class="vads-u-margin-y--2">
        <h4 slot="headline">Next steps</h4>
        <p>
          After submitting this form, it should be sent to VA along with the
          Veteran’s VA Form 21-8940. The form can be submitted by mail to the
          Evidence Intake Center or uploaded online.
        </p>
      </va-alert>

      <div className="vads-u-margin-top--4">
        <va-button back onClick={goBack}>
          Back
        </va-button>
        <va-button continue type="submit">
          Submit form
        </va-button>
      </div>
    </form>
  );
};

CertificationPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default CertificationPage;
