import React from 'react';
import { connect } from 'react-redux';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import CallToActionWidget from 'applications/static-pages/cta-widget';

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
          <va-loading-indicator message="Please wait while we check if the tool is available." />
        );
        break;
      }
      case SERVICE_AVAILABILITY_STATES.up: {
        content = (
          <>
            <CallToActionWidget appId="gi-bill-benefits" />
          </>
        );
        break;
      }
      case SERVICE_AVAILABILITY_STATES.down:
      default: {
        content = <VaAlert visible status="error" />;
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
