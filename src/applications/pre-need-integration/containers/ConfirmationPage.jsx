import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    scrollToTop('topScrollElement');
    focusElement('.confirmation-page-title');
  }

  render() {
    const { form, route } = this.props;
    const { formConfig } = route;
    const { submission } = form;
    const { response } = submission || {};
    const submitDate = new Date(form.submission.submittedAt);
    const confirmationNumber = response?.confirmationNumber || '';

    return (
      <ConfirmationView
        submitDate={submitDate}
        confirmationNumber={confirmationNumber}
        formConfig={formConfig}
        pdfUrl="https://www.va.gov/vaforms/va/pdf/VA%20Form%2040-10007.pdf"
      >
        <ConfirmationView.SubmissionAlert
          title="Your pre-need determination request has been submitted"
          content="We'll review your request and send you a letter in the mail with our decision."
          actions={null}
        />
        <ConfirmationView.SavePdfDownload />
        <ConfirmationView.ChapterSectionCollection />
        <h4>Do you have more documents you need to submit?</h4>
        <p className="mail-or-fax-message">
          To mail or fax additional documents:
        </p>
        <ol className="mail-or-fax-steps">
          <li className="mail-or-fax-step">Make copies of the documents.</li>
          <li className="mail-or-fax-step">
            Make sure you write your name and confirmation number on every page.
          </li>
          <li className="mail-or-fax-step">
            <span>
              Submit application and supporting documents to the VA by mail:
            </span>
            <p>
              <div className="mail-fax-address">
                <div>NCA Intake Center</div>
                <div>P.O. Box 5237</div>
                <div>Janesville, WI 53547</div>
              </div>
            </p>
            <strong>Or</strong>
            <p>
              Fax them to the National Cemetery Scheduling Office:{' '}
              <va-telephone contact="8558408299" />.
            </p>
          </li>
        </ol>
        <ConfirmationView.PrintThisPage />
        <ConfirmationView.WhatsNextProcessList />
        <ConfirmationView.HowToContact />
        <ConfirmationView.GoBackLink />
        <ConfirmationView.NeedHelp />
      </ConfirmationView>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    submission: PropTypes.shape({
      submittedAt: PropTypes.string,
      response: PropTypes.object,
    }),
  }),
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
export { ConfirmationPage };
