import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

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

    return (
      <div>
        <div className="print-only">
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
          <h1 className="vads-u-font-size--h3">
            Apply for the Rogers STEM Scholarship
          </h1>
          <span>Form 22-10203</span>
        </div>
        <h3 className="confirmation-page-title screen-only">
          We've received your application.
        </h3>
        <h4 className="print-only">We've received your application.</h4>
        <p>
          We usually process claims within <strong>30 days</strong>.<br />
          We may contact you for more information or documents.
        </p>
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
            Rogers STEM Scholarship{' '}
            <span className="vads-u-margin--0 vads-u-display--inline-block">
              (Form 22-10203)
            </span>
          </h4>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          <ul className="claim-list">
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
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">
            What happens after I apply?
          </h4>
          <p className="confirmation-guidance-message">
            <a href="/education/after-you-apply/">
              Find out what happens after you apply
            </a>
          </p>
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">
            If you have questions, call 888-GI-BILL-1 (
            <a href="tel:+18884424551">888-442-4551</a>
            ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET.
          </p>
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
