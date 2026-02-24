import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const attributes = submission?.response?.attributes || {};
  const confirmationNumber = attributes?.confirmationNumber || '';

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={attributes?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList />
      <h2>If you need to submit supporting documents</h2>
      <p>
        If you didn’t already submit your supporting documents and additional
        evidence, you can submit copies of your documents by mail.
      </p>
      <p>Mail and supporting documents to this address:</p>
      <p className="va-address-block">
        Department of Veterans Affairs
        <br />
        Pension Intake Center
        <br />
        PO Box 5365
        <br />
        Janesville, WI 53547-5365
        <br />
        United States of America
        <br />
      </p>
      <p>
        <span className="vads-u-font-weight--bold">Note:</span> Mail us copies
        of your documents only. Don’t send us your original documents. We can’t
        return them.
      </p>
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
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
