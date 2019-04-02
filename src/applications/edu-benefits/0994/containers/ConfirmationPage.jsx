import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import appendQuery from 'append-query';

import { focusElement } from '../../../../platform/utilities/ui';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';
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
    const response = this.props.form.submission.response
      ? this.props.form.submission.response.attributes
      : {};
    const name = form.data.applicantFullName;

    return (
      <div>
        <h3 className="confirmation-page-title">
          Your claim has been received
        </h3>
        <p>
          We usually process claims within <strong>30 days</strong>.
        </p>
        <p>
          We may contact you for more information or documents.
          <br />
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>
            Education Claim <span className="additional">(Form 22-0994)</span>
          </h4>
          <span>
            for {name && name.first} {name && name.middle} {name && name.last}{' '}
            {name && name.suffix}
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
        {!_.get(form.data, 'appliedForVaEducationBenefits', true) && (
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
          <h4 className="confirmation-guidance-heading">
            What happens after I apply?
          </h4>
          <p className="confirmation-guidance-message">
            <a href="/education/after-you-apply/">
              Find out what happens after you apply
            </a>
            .
          </p>
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">
            If you have questions, call 1-888-GI-BILL-1 (
            <a href="tel:+18884424551">1-888-442-4551</a>
            ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. (ET).
          </p>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">
                Go Back to {propertyName}
              </button>
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
