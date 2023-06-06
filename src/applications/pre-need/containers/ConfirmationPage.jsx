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
    const response = this.props.form.submission.response
      ? this.props.form.submission.response.attributes
      : {};
    const { name } = form.data.application.claimant;
    const submittedAt = moment(form.submission.submittedAt);

    return (
      <div>
        <h3 className="confirmation-page-title">
          Your claim has been submitted.
        </h3>
        <p>
          We’ll let you know by mail or phone if we need more information.
          <br />
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4 className="schemaform-confirmation-claim-header">
            Burial Pre-Need Claim{' '}
            <span className="additional">(Form 40-10007)</span>
          </h4>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {response.trackingNumber && (
            <ul className="claim-list">
              <li>
                <strong>Confirmation number</strong>
                <br />
                <span>{response.trackingNumber}</span>
              </li>
              <li>
                <strong>Date submitted</strong>
                <br />
                <span>{submittedAt.format('MMM D, YYYY')}</span>
              </li>
            </ul>
          )}
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
            <p>Submit application and Support Documentation to the VA by:</p>
            <p>Mail:</p>
            <div className="mail-fax-address">
              <div>NCA Intake Center</div>
              <div>P.O. Box 5237</div>
              <div>Janesville, WI 53547</div>
            </div>
            <p>
              Fax: the National Cemetery Scheduling Office at{' '}
              <va-telephone contact="8558408299" not-clickable />
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
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <div>
            <p className="confirmation-guidance-message">
              If you have questions, please call{' '}
              <va-telephone
                className="help-phone-number-link"
                contact="8772228387"
              />
              , Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </div>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">Go back to VA.gov</button>
            </a>
          </div>
        </div>
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
