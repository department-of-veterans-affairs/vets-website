import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { name } = form.data.application.claimant;
    const submittedAt = moment(form.submission.submittedAt);

    return (
      <div>
        <h3 className="confirmation-page-title">
          You’ve submitted your application
        </h3>
        <p>
          You’ll receive a confirmation email shortly. We’ll let you know by
          mail or phone if we need more details.
          <br />
          <em>Please print this page for your records.</em>
        </p>

        <div className="inset">
          <h3 className="schemaform-confirmation-claim-header">
            Your application details
          </h3>
          <ul className="claim-list">
            <li>
              <strong>Applicant Name</strong>
              <div>
                {name.first} {name.middle} {name.last} {name.suffix}
              </div>
            </li>
            <li>
              <strong>Form name</strong>
              <br />
              <div>Burial Pre-Need Claim (Form 40-10007)</div>
            </li>

            <li>
              <strong>Date submitted</strong>
              <br />
              <span>{submittedAt.format('MMM D, YYYY')}</span>
            </li>
          </ul>

          <va-button
            class="screen-only"
            onClick={window.print}
            text="Print this page"
          />
        </div>
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
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">
            What happens after I apply?
          </h4>
          <a
            className="confirmation-guidance-message"
            href="/burials-memorials/pre-need-eligibility/after-you-apply/"
          >
            Find out what happens after you apply
          </a>
        </div>
        <p>
          <div className="row form-progress-buttons schemaform-back-buttons">
            <div className="small-6 usa-width-one-half medium-6 columns">
              <a href="/">
                <button className="usa-button-primary">
                  Go back to VA.gov
                </button>
              </a>
            </div>
          </div>
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
