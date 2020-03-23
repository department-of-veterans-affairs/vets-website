import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import CallToActionWidget from 'platform/site-wide/cta-widget';

import { getServiceAvailability } from '../actions/post-911-gib-status';
import { SERVICE_AVAILABILITY_STATES } from '../utils/constants';

export class ServiceAvailabilityBanner extends React.Component {
  componentDidMount() {
    this.props.getServiceAvailability();
  }

  render() {
    let content;

    switch (this.props.serviceAvailability) {
      case SERVICE_AVAILABILITY_STATES.unrequested: {
        content = null;
        break;
      }
      case SERVICE_AVAILABILITY_STATES.pending: {
        content = (
          <LoadingIndicator message="Please wait while we check if the tool is available." />
        );
        break;
      }
      case SERVICE_AVAILABILITY_STATES.up: {
        content = (
          <>
            <CallToActionWidget appId="gi-bill-benefits" />
            <p>
              <strong>Note:</strong> The tool is available Sunday through
              Friday, 6:00 a.m. to 10:00 p.m. ET, and Saturday 6:00 a.m. to 7:00
              p.m. ET.
            </p>
          </>
        );
        break;
      }
      case SERVICE_AVAILABILITY_STATES.down:
      default: {
        content = (
          <AlertBox
            headline="The Post-9/11 GI Bill Benefits tool is down for maintenance"
            content="We’re sorry the tool isn’t available right now. The tool will be available again Sunday through Friday, 6:00 a.m. to 10:00 p.m. ET, and Saturday 6:00 a.m. to 7:00 p.m. ET. Please check back during that time."
            isVisible
            status="error"
          />
        );
      }
    }

    return content;
  }
}

const mapStateToProps = state => {
  const { serviceAvailability, uptimeRemaining } = state.post911GIBStatus;
  return {
    serviceAvailability,
    uptimeRemaining,
  };
};

const mapDispatchToProps = {
  getServiceAvailability,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceAvailabilityBanner);
