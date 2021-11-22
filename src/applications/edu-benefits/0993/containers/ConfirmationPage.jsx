import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  render() {
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.claimantFullName;

    return (
      <div>
        <div className="print-only">
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
          <h1 className="vads-u-font-size--h3 vads-u-margin-top--3">
            Opt out of sharing education benefits information
          </h1>
          <span>Form 22-0993</span>
        </div>
        <h3 className="confirmation-page-title screen-only">
          Your opt-out form has been submitted.
        </h3>
        <h4 className="print-only">Your opt-out form has been submitted.</h4>
        <p>
          We may contact you if we have questions or need more information. You
          can print this page for your records.
        </p>

        <p>
          <button
            type="button"
            className="usa-button-primary screen-only"
            onClick={() => window.print()}
          >
            Print this page
          </button>
        </p>

        <div className="inset">
          <h4 className="vads-u-margin-top--0">
            Opt out of sharing education benefits information
          </h4>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Confirmation number</strong>
                <br />
                <span>{response.attributes.confirmationNumber}</span>
              </li>
              <li>
                <strong>Date submitted</strong>
                <br />
                <span>
                  {moment(response.attributes.timestamp).format('MMM D, YYYY')}
                </span>
              </li>
            </ul>
          )}
        </div>

        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">
            What happens after I submit my opt-out form?
          </h4>
          <p className="confirmation-guidance-message">
            After we receive your request, it may take us up to a week to remove
            your school’s access to your education benefits information
          </p>

          <h4 className="confirmation-guidance-heading">
            What should I do if I change my mind and no longer want to opt out?
          </h4>
          <p className="confirmation-guidance-message">
            You’ll need to call the Education Call Center at{' '}
            <a href="tel:+18884424551">1-888-442-4551</a>, Monday through
            Friday, 8:00 a.m. to 7:00 p.m. ET, to ask VA to start sharing your
            education benefits information again.
          </p>

          <h4 className="confirmation-guidance-heading">
            If I’ve opted out, what type of information do I need to give my
            school?
          </h4>
          <p className="confirmation-guidance-message">
            You may need to provide your school with a copy of your education
            benefits paperwork. If you transfer schools, you may also need to
            make sure your new school has your paperwork.
          </p>

          <h4 className="confirmation-guidance-heading vads-u-border-bottom--3px vads-u-border-color--primary vads-u-line-height--4">
            Need help?
          </h4>
          <p className="confirmation-guidance-message">
            If you have questions, call 1-888-GI-BILL-1 (
            <a href="tel:+18884424551">1-888-442-4551</a>
            ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET.
          </p>
        </div>
        <div className="form-progress-buttons schemaform-back-buttons">
          <a href="/">
            <button className="usa-button-primary">Go back to VA.gov</button>
          </a>
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
