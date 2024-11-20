import React from 'react';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import {
  VaButton,
  VaNeedHelp,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import UserInfoSection from '../components/UserInfoSection';

class StatusPage extends React.Component {
  componentDidMount() {
    focusElement('va-breadcrumbs');
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
            You can print your statement and use it as a replacement for a
            Certificate of Eligibility (COE) to show that you qualify for
            benefits.
          </p>
        </div>
      );

      printButton = (
        <div className="section">
          <VaButton
            text="Get printable statement of benefits"
            onClick={this.navigateToPrint}
            id="print-button"
          />
        </div>
      );
    }

    return (
      <div className="gib-info vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--9">
            <h1>Your Post-9/11 GI Bill Statement of Benefits</h1>
            {introText}
            {printButton}
            <UserInfoSection enrollmentData={enrollmentData} />
            <h3>How can I see my Post-9/11 GI Bill benefit payments?</h3>
            <div>
              If you've received education benefit payments through this
              program,{' '}
              <a href="/va-payment-history/payments/">
                you can see your payment history
              </a>
              .
            </div>
            <VaNeedHelp>
              <div slot="content">
                <p>
                  Call us at <VaTelephone contact="8008271000" />. We're here
                  Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
                  hearing loss, call <VaTelephone contact="711" tty="true" />.
                </p>
              </div>
            </VaNeedHelp>
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
