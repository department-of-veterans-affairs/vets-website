import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import scrollTo from 'platform/utilities/ui/scrollTo';
import sendNextStepsEmail from '../api/sendNextStepsEmail';
import { getFormNumber, getFormName } from '../utilities/helpers';

import GetFormHelp from '../components/GetFormHelp';

import ConfirmationDigitalSubmission from './ConfirmationDigitalSubmission';

export default function ConfirmationPage({ router }) {
  const checkboxRef = useRef(null);
  const [signedForm, setSignedForm] = useState(false);
  const [signedFormError, setSignedFormError] = useState(false);
  const { data: formData } = useSelector(state => state.form);
  const selectedEntity = formData['view:selectedRepresentative'];
  const sendNextStepsEmailPayload = {
    formNumber: getFormNumber(formData),
    formName: getFormName(formData),
    firstName: formData.applicantName?.first || formData.veteranFullName.first,
    emailAddress: formData.applicantEmail || formData.veteranEmail,
    entityId: selectedEntity.id,
    entityType:
      selectedEntity.type === 'organization' ? 'organization' : 'individual',
  };

  const isDigitalSubmission =
    formData.representativeSubmissionMethod === 'digital';

  const v2IsEnabled = formData?.['view:v2IsEnabled'];
  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  const handlers = {
    onChangeSignedFormCheckbox: () => {
      setSignedForm(prevState => !prevState);

      if (signedFormError) setSignedFormError(false);
    },
    onClickContinueButton: async () => {
      if (signedForm) {
        try {
          await sendNextStepsEmail(sendNextStepsEmailPayload);
        } catch (error) {
          // Don't do anything if we fail to send the email
        }

        router.push('/next-steps');
      } else {
        setSignedFormError(true);

        if (checkboxRef.current) {
          checkboxRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          const { shadowRoot } = checkboxRef.current;
          const inputElement = shadowRoot?.querySelector(
            'input[type="checkbox"]',
          );
          if (inputElement) {
            inputElement.focus();
          }
        }
      }
    },
  };

  if (isDigitalSubmission && v2IsEnabled) {
    return <ConfirmationDigitalSubmission />;
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3">
        Download, print, and sign your form
      </h2>
      <p>First, you’ll need to download your form.</p>
      <va-link
        download
        filetype="PDF"
        href={localStorage.getItem('pdfUrl')}
        filename={`VA Form ${getFormNumber(formData)}`}
        label="Download your form"
        text="Download your form"
      />
      <p className="vads-u-margin-top--4">
        Then, you’ll need to print and sign your form.
      </p>
      <VaCheckbox
        ref={checkboxRef}
        checked={signedForm}
        className="vads-u-margin-bottom--4"
        error={
          signedFormError
            ? "Please confirm that you've downloaded, printed, and signed your form."
            : null
        }
        label="I’ve downloaded, printed, and signed my form"
        name="signedForm"
        required
        onVaChange={handlers.onChangeSignedFormCheckbox}
      />
      <va-button continue onClick={handlers.onClickContinueButton} />

      <div>
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </>
  );
}

ConfirmationPage.propTypes = {
  router: PropTypes.object,
};
