import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const alertContent = confirmationNumber => (
  <>
    <p>Thank you for submitting your authorization request</p>
    <p>
      After we review your authorization, we’ll contact the private provider or
      hospital to get the requested records. If we can’t get the records within
      15 days we’ll send you a follow-up letter by mail.
    </p>
    <p>Your confirmation number is {confirmationNumber}.</p>
  </>
);

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission, data } = form;
  const preparerNameDefined =
    data.preparerIdentification?.preparerFullName?.first &&
    data.preparerIdentification?.preparerFullName?.last;
  const preparerName = preparerNameDefined
    ? data.preparerIdentification.preparerFullName
    : data.veteran.fullName;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      submitterName={preparerName}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert
        content={alertContent(confirmationNumber)}
      />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList />
      <ConfirmationView.HowToContact />
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({
        attributes: PropTypes.shape({
          confirmationNumber: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
