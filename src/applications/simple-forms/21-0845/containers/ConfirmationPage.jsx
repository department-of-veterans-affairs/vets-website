/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
// va-telephone doesn't display 1-800 numbers correctly
import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const submissionAlertContent = (
  <p>
    If you change your mind and want us to stop releasing your personal
    information, you can contact us online through{' '}
    <a href="https://ask.va.gov" target="_blank" rel="noopener noreferrer">
      Ask VA
      <va-icon icon="launch" srtext="opens in a new window" />
    </a>
    or call us at{' '}
    <a href="tel:+18008271000" aria-label="1. 8 0 0. 8 2 7. 1 0 0 0.">
      1-800-827-1000
    </a>
    . We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
  </p>
);

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert
        content={submissionAlertContent}
        // actions={<></>}
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
    data: PropTypes.object,
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
