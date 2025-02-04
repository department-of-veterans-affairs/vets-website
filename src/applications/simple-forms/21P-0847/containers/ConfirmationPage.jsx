import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const childContent = (
  <>
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
      What are my next steps?
    </h2>
    <p>
      After we approve your substitution request, you’re responsible for taking
      any next steps that are needed to help finish the claim. You’ll have the
      same deadlines to take the next steps as the deceased claimant would have
      had if they survived. You’ll also have the same rights as the original
      claimant would have had if they survived. This means you can request a
      decision review if you disagree with a decision. You also have a right to
      submit new evidence and ask for help from a representative. For most VA
      benefits, you have 1 year from the date on your decision letter to request
      a Higher-Level Review or a Board Appeal.
    </p>
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
      What if I change my mind?
    </h2>
    <p>
      If you no longer want to be the substitute claimant, send us a letter to
      tell us to withdraw your request.
    </p>
    <p>For disability compensation claims, mail your letter to this address:</p>
    <p className="va-address-block">
      Department of Veterans Affairs <br />
      Claims Intake Center
      <br />
      PO Box 4444
      <br />
      Janesville, WI 53547-5192
      <br />
    </p>
    <p>
      For pension and survivor benefit claims, mail your letter to this address:
    </p>
    <p className="va-address-block">
      Department of Veterans Affairs <br />
      Pension Intake Center
      <br />
      PO Box 5365
      <br />
      Janesville, WI 53547-5192
      <br />
    </p>
    <p className="vads-u-margin-bottom--0">
      You may also bring the letter to cancel your request to your nearest VA
      regional office.
    </p>
    <a href="/find-locations">Find a VA regional office near you</a>
    <br />
    <br />
  </>
);

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

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
      <ConfirmationView.SubmissionAlert />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList />
      {childContent}
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
