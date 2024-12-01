import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NeedHelp from '../components/NeedHelp';
import sendNextStepsEmail from '../api/sendNextStepsEmail';
import { getFormNumber, getFormName } from '../utilities/helpers';

export default function ConfirmationPage({ router }) {
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
          // Should we set an error state to display a message in the UI?
        }

        router.push('/next-steps');
      } else {
        setSignedFormError(true);
      }
    },
  };

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
        checked={signedForm}
        className="vads-u-margin-bottom--4"
        error={
          signedFormError
            ? "Please confirm that you've downloaded, printed, and signed your form."
            : null
        }
        label="I've downloaded, printed, and signed my form"
        name="signedForm"
        required
        onVaChange={handlers.onChangeSignedFormCheckbox}
      />
      <va-button continue onClick={handlers.onClickContinueButton} />
      <NeedHelp />
    </>
  );
}

ConfirmationPage.propTypes = {
  router: PropTypes.object,
};
