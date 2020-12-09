import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import appendQuery from 'append-query';

import { focusElement } from 'platform/utilities/ui';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import {
  ConfirmationPageTitle,
  ConfirmationPageSummary,
} from '../../components/ConfirmationPage';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};
const nextQuery = { next: window.location.pathname };
const url1990 = appendQuery(
  '/education/apply-for-education-benefits/application/1990',
  nextQuery,
);

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const form = this.props.form;
    const response = form.submission.response
      ? form.submission.response.attributes
      : {};
    const name = form.data.applicantFullName;
    const appliedForVaEducationBenefits = _.get(
      form.data,
      'appliedForVaEducationBenefits',
      true,
    );
    return (
      <div>
        <ConfirmationPageTitle />
        <AlertBox
          isVisible={!appliedForVaEducationBenefits}
          status="warning"
          headline="Don’t forget to apply for VA education benefits"
          content={
            <span>
              Now that you've submitted your application for VET TEC, you’ll
              need to complete an Application for VA Education Benefits (VA Form
              22-1990). Click the button on the bottom of this page to go to
              that application.
            </span>
          }
        />
        <ConfirmationPageSummary
          formId={form.formId}
          response={response}
          submission={form.submission}
          name={name}
        />
        {!appliedForVaEducationBenefits && (
          <div>
            <p>
              <strong>{'Note: '}</strong>
              We’ll also need you to complete the Application for VA Education
              Benefits (VA Form 22-1990) to determine your eligibility for VET
              TEC. We recommend you do that now.
            </p>
            <div className="row form-progress-buttons">
              <div className="small-6 usa-width-one-half medium-6 columns">
                <a href={url1990}>
                  <button className="usa-button-primary">
                    Continue to VA Form 22-1990
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
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
