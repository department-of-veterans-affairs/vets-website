import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import {
  ConfirmationPageSummary,
  ConfirmationPageTitle,
} from '../../components/ConfirmationPage';

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
          <h1 className="vads-u-font-size--h3 vads-u-margin-top--3">
            Apply for the Rogers STEM Scholarship
          </h1>
          <span>Form 22-10203</span>
        </div>
        <ConfirmationPageTitle />
        <ConfirmationPageSummary
          formId={form.formId}
          formName={'Rogers STEM Scholarship'}
          response={response}
          submission={form.submission}
          name={name}
        />
        <div className="confirmation-guidance-container">
          <p>
            <h4 className="confirmation-guidance-heading">
              What happens after I apply?
            </h4>
          </p>
          <p className="confirmation-guidance-message">
            We usually decide on applications within 30 days.
          </p>
          <p>
            You’ll get a Certificate of Eligibility (COE) or decision letter in
            the mail. If we’ve approved your application, you can bring the COE
            to the VA certifying official at your school.
          </p>
          <p>
            <a href="/education/after-you-apply/" className="screen-only">
              Learn more about what happens after you apply
            </a>
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
export { ConfirmationPage };
