import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import NeedHelp from '../components/NeedHelp';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const veteranEmail = useSelector(state => {
    return state.user?.profile?.email || '';
  });
  const { submission } = form;
  const submitDate = submission?.timestamp;
  // no confirmation number is returned from the API currently
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  // used for WhatsNextProcessList item1Content
  const processListItem1Content = (
    <p>
      After we receive your submission, we’ll review your dispute. You will
      receive an email and a letter in the mail confirming receipt. You’ll need
      to <strong>continue making payments</strong> on your debt while we review
      your dispute.{' '}
    </p>
  );

  const alertContent = (
    <>
      <p>
        When we receive your form, we’ll mail you a letter and send an email to{' '}
        <strong>{veteranEmail}</strong> to confirm we have it.{' '}
        {confirmationNumber
          ? `Your confirmation
        number is ${confirmationNumber}.`
          : null}
      </p>
      <p className="vads-u-margin-bottom--0">
        It may take up to 30 days to process your dispute.
      </p>
    </>
  );

  return (
    <ConfirmationView
      confirmationNumber={confirmationNumber}
      formConfig={props.route?.formConfig}
      pdfUrl={submission.response?.pdfUrl}
      submitDate={submitDate}
    >
      <ConfirmationView.SubmissionAlert
        title="Your dispute submission is in progress"
        content={alertContent}
        actions={null}
      />
      <ConfirmationView.SavePdfDownload />
      {/* <ConfirmationView.ChapterSectionCollection /> */}
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList
        item1Header="We'll confirm when we receive your dispute request"
        item1Content={processListItem1Content}
        item1Actions={null}
        item2Header="We'll review your dispute"
        item2Content="Then we’ll mail you a letter with our decision."
      />
      <ConfirmationView.HowToContact />
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp content={<NeedHelp />} />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
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
