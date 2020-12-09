import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { benefitsLabels } from '../../utils/labels';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  toggleExpanded = e => {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const form = this.props.form;
    const response = this.props.form.submission.response
      ? this.props.form.submission.response.attributes
      : {};
    const name = form.data.veteranFullName;
    const benefit = form.data.benefit;

    const docExplanation = this.state.isExpanded ? (
      <div className="usa-accordion-content" aria-hidden="false">
        <p>In the future, you might need:</p>
        <ul>
          <li>Your reserve kicker</li>
          <li>
            Documentation of additional contributions that would increase your
            monthly benefits
          </li>
        </ul>
        <p>
          Documents can be uploaded using the{' '}
          <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">
            GI Bill site
          </a>
          .
        </p>
      </div>
    ) : null;

    return (
      <div>
        <div className="print-only">
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
          <h1 className="vads-u-font-size--h3 vads-u-margin-top--3">
            Update your education benefits
          </h1>
          <span>Form 22-1995</span>
        </div>
        <h3 className="confirmation-page-title screen-only">
          We've received your application.
        </h3>
        <h4 className="print-only">We've received your application.</h4>
        <p>We usually process applications within 30 days.</p>
        <p>We may contact you if we need more information or documents.</p>
        <p>
          <button
            className="usa-button-primary screen-only"
            onClick={() => window.print()}
          >
            Print this page
          </button>
        </p>
        <div className="inset">
          <h4 className="vads-u-margin-top--0">
            Education benefit application (Form 22-1995)
          </h4>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          <ul className="claim-list">
            <li>
              <strong>Benefit to be transferred</strong>
              <br />
              {benefitsLabels[benefit]}
            </li>
            <li>
              <strong>Confirmation number</strong>
              <br />
              <span>{response.confirmationNumber}</span>
            </li>
            <li>
              <strong>Date received</strong>
              <br />
              <span>
                {moment(form.submission.submittedAt).format('MMM D, YYYY')}
              </span>
            </li>
            <li>
              <strong>Your claim was sent to</strong>
              <br />
              <address className="schemaform-address-view">
                {response.regionalOffice}
              </address>
            </li>
          </ul>
        </div>
        <div
          id="collapsiblePanel"
          className="usa-accordion-bordered screen-only"
        >
          <ul className="usa-unstyled-list">
            <li>
              <div className="accordion-header clearfix">
                <button
                  className="usa-button-unstyled"
                  aria-expanded={this.state.isExpanded ? 'true' : 'false'}
                  aria-controls="collapsible-document-explanation"
                  onClick={this.toggleExpanded}
                >
                  No documents required at this time
                </button>
              </div>
              <div id="collapsible-document-explanation">{docExplanation}</div>
            </li>
          </ul>
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">
            What happens after I apply?
          </h4>
          <p className="confirmation-guidance-message">
            We usually decide on applications within 30 days.
          </p>
          <p className="confirmation-guidance-message">
            You'll get a Certificate of Eligibility (COE) or decision letter in
            the mail. If we've approved your application, you can bring the COE
            to the VA certifying official at your school.
          </p>
          <p className="confirmation-guidance-message screen-only">
            <a href="/education/after-you-apply/">
              Learn more about what happens after you apply
            </a>
          </p>
          <p className="confirmation-guidance-message print-only">
            <a href="/education/after-you-apply/">
              Learn more about what happens after you apply:
            </a>
          </p>
          <h4 className="confirmation-guidance-heading pagebreak vads-u-border-bottom--3px vads-u-border-color--primary vads-u-line-height--4">
            Need help?
          </h4>
          <p className="confirmation-guidance-message">
            If you have questions, call 888-GI-BILL-1 (
            <a href="tel:+18884424551">888-442-4551</a>
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
export { ConfirmationPage };
