import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

export function ConfirmationPage(props) {
  const form = useSelector(state => state.form || {});
  const { submission, data = {} } = form;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission?.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert
        content={
          <>
            <p>
              We'll review your response to verify your continued eligibility
              for DIC benefits.
            </p>
            {data?.hasRemarried === false ? (
              <p>
                Since you indicated that you have not remarried, your DIC
                benefits should continue without interruption. We'll contact you
                if we need any additional information.
              </p>
            ) : (
              <>
                <p>
                  Since you indicated that you have remarried, we'll review your
                  information to determine your continued eligibility for DIC
                  benefits based on:
                </p>
                <ul>
                  <li>Your age at the time of remarriage</li>
                  <li>Whether the remarriage has ended</li>
                </ul>
                <p>
                  We'll send you a letter with our determination. If we
                  determine that you're no longer eligible for DIC benefits, the
                  letter will explain your appeal rights.
                </p>
              </>
            )}
            <p>Your confirmation number is {confirmationNumber}.</p>
          </>
        }
      />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList />
      <ConfirmationView.HowToContact />
      <ConfirmationView.NeedHelp />
      <ConfirmationView.GoBackLink />
    </ConfirmationView>
  );
}

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
