import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormSignature from 'platform/forms-system/src/js/components/FormSignature';
import PrivacyActStatement from './PrivacyActStatement';

function PreSubmitInfo({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const [showModal, setShowModal] = useState(false);

  const federalLawNote = (
    <div className="vads-u-margin-bottom--3 vads-u-padding-x--3">
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information (Reference:
      18 U.S.C. 1001).
    </div>
  );

  const privacyPolicyContent = (
    <span data-testid="privacy-policy-text">
      I have read and accept the{' '}
      <va-link
        onClick={() => setShowModal(true)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setShowModal(true);
          }
        }}
        text="privacy policy."
        aria-label="View the privacy policy"
        role="button"
        tabIndex="0"
      />
    </span>
  );

  const certificationContent = (
    <>
      <p>
        The information you provide in this application will help us determine
        if you’re eligible for the High Technology Program. We may audit this
        information to make sure it’s accurate.
      </p>
      <p>By checking the box below, you’re confirming that:</p>
      <ul>
        <li>
          You understand that if you have benefits left under chapter 30, 32,
          33, or 35, we’ll use the one that gives you the most support. If you’d
          rather use a different benefit, just contact us.
        </li>
        <li>
          If you don’t have any benefits left under those chapters, we’ll still
          provide support through this program. It won’t affect the benefits
          you’ve already used.
        </li>
        <li>
          Everything you’ve shared here is true and correct to the best of your
          knowledge.
        </li>
      </ul>
      {privacyPolicyContent}
    </>
  );

  return (
    <>
      <div className="vads-u-margin-y--3">{federalLawNote}</div>
      <div>
        <section className="box vads-u-background-color--gray-lightest vads-u-padding--3">
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
            Certification statement
          </h3>
          {certificationContent}
          <FormSignature
            formData={formData}
            setFormData={setPreSubmit}
            showError={showError}
            onSectionComplete={onSectionComplete}
            signatureLabel="Your full name"
            signaturePath="statementOfTruthSignature"
            checkboxLabel="I certify that the information above is true and correct to the best of my knowledge and belief."
            required
          />
        </section>
      </div>
      <VaModal
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => setShowModal(!showModal)}
        visible={showModal}
        large
      >
        <PrivacyActStatement />
      </VaModal>
    </>
  );
}

PreSubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  showError: PropTypes.bool,
};

PreSubmitInfo.defaultProps = {
  showError: false,
};

export default PreSubmitInfo;
