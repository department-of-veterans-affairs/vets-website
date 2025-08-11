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
      >
        <ConfirmationView.SubmissionAlert
          title="Your pre-need determination request has been submitted"
          content="We'll review your request and send you a letter in the mail with our decision."
          actions={null}
        />
        <ConfirmationView.PrintThisPage />
        <ConfirmationView.WhatsNextProcessList
          item1Header="We'll review your request"
          item1Content="We'll determine if you're eligible for burial in a VA national cemetery based on the information you provided."
          item2Header="We'll send you our decision by mail"
          item2Content="You should receive our decision within 60 days after we receive your request."
        />
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
