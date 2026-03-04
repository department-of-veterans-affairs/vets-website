import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const DEFAULT_DOWNLOAD_PDF_BASE = `${
  environment.API_URL
}/automobile_adaptive_equipment/v0/form4502/`;

const alertContent = confirmationNumber => (
  <>
    <p>
      Thank you for submitting your application for automobile or adaptive
      equipment.
    </p>
    <p>
      After we review your application, we will contact you if we need any
      additional information.
    </p>
    <p>Your confirmation number is {confirmationNumber}.</p>
  </>
);

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission = {}, data = {} } = form;
  const veteran = data.veteran || {};
  const veteranName = veteran.fullName;
  const submitterName =
    veteranName?.first && veteranName?.last ? veteranName : null;
  const submitDate = submission.timestamp;
  const confirmationNumber =
    submission.response?.attributes?.confirmationNumber ||
    submission.response?.data?.attributes?.confirmationNumber;
  const downloadPdfBase =
    props.route?.formConfig?.downloadPdfUrl || DEFAULT_DOWNLOAD_PDF_BASE;
  const pdfUrl = confirmationNumber
    ? `${downloadPdfBase}${confirmationNumber}/download_pdf`
    : submission.response?.attributes?.pdfUrl ||
      submission.response?.data?.attributes?.pdfUrl;

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      submitterName={submitterName}
      pdfUrl={pdfUrl}
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
