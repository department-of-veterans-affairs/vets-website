import React from 'react';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

import EnrollmentHistory from '../components/EnrollmentHistory';
import UserInfoSection from '../components/UserInfoSection';

class StatusPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  navigateToPrint = () => {
    this.props.router.push('/print');
  };

  render() {
    const { enrollmentData } = this.props;
    let introText;
    let printButton;
    if (enrollmentData.veteranIsEligible) {
      recordEvent({ event: 'post911-status-info-shown' });
      introText = (
        <div className="va-introtext">
          <p>
            The information on this page is the same information that’s in your
            Certificate of Eligibility (COE) letter for Post-9/11 GI Bill
            (Chapter 33) benefits. You can print this page and use it instead of
            your COE to show that you qualify for benefits.
          </p>
        </div>
      );

      printButton = (
        <div className="section">
          <button
            onClick={this.navigateToPrint}
            className="usa-button-primary"
            id="print-button"
          >
            Get Printable Statement of Benefits
          </button>
        </div>
      );
    }

    return (
      <div className="gib-info vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--9">
            <FormTitle title="Post-9/11 GI Bill Statement of Benefits" />
            {introText}
            {printButton}
            <UserInfoSection enrollmentData={enrollmentData} />
            <h4>How can I see my Post-9/11 GI Bill benefit payments?</h4>
            <div>
              If you've received education benefit payments through this
              program,{' '}
              <EbenefitsLink path="ebenefits/about/feature?feature=payment-history">
                you can see your payment history on eBenefits
              </EbenefitsLink>
              .
            </div>
            <EnrollmentHistory enrollmentData={enrollmentData} />
            <div className="feature help-desk">
              <h2>Need help?</h2>
              <div>
                Call 888-GI-BILL-1 (<a href="tel:+18884424551">888-442-4551</a>
                ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    enrollmentData: state.post911GIBStatus.enrollmentData,
  };
}

export default connect(mapStateToProps)(StatusPage);
