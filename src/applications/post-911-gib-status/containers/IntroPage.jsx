import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import IntroPageSummary from './IntroPageSummary';
import { getServiceAvailability } from '../actions/post-911-gib-status';
import { SERVICE_AVAILABILITY_STATES } from '../utils/constants';

const DOWNTIME_SOON_CUTOFF = 60 * 30; // 30 minutes
const systemUpAlertHeadline = `The Post-9/11 GI Bill Benefits tool is available`;
const systemUpAlertContent = `The tool is available Sunday through Friday, 6:00 a.m. to 10:00 p.m. ET, and Saturday 6:00 a.m. to 7:00 p.m. ET.`;
const downtimeAlertHeadline = `The Post-9/11 GI Bill Benefits tool is down for maintenance`;
const downtimeAlertContent = `We’re sorry the tool isn’t available right now. The tool will be available again Sunday through Friday, 6:00 a.m. to 10:00 p.m. ET, and Saturday 6:00 a.m. to 7:00 p.m. ET. Please check back during that time.`;
const downtimeSoonAlertHeadline = `The Post-9/11 GI Bill Benefits tool will be down soon for maintenance`;
const downtimeSoonAlertContent = `The tool is available Sunday through Friday, 6:00 a.m. to 10:00 p.m. ET, and Saturday 6:00 a.m. to 7:00 p.m. ET. Please check back during that time.`;

export class IntroPage extends React.Component {
  constructor(props) {
    super(props);
    // Make the api request
    this.props.getServiceAvailability();
  }

  getContent() {
    let content;
    switch (this.props.serviceAvailability) {
      case SERVICE_AVAILABILITY_STATES.unrequested: {
        // This is never actually even seen
        content = <div />;
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
          <div>
            <AlertBox
              headline={downtimeSoonAlertHeadline}
              content={downtimeSoonAlertContent}
              isVisible={
                this.props.uptimeRemaining &&
                this.props.uptimeRemaining <= DOWNTIME_SOON_CUTOFF
              }
              status="warning"
            />
            <AlertBox
              headline={systemUpAlertHeadline}
              content={systemUpAlertContent}
              isVisible={
                !this.props.uptimeRemaining ||
                this.props.uptimeRemaining > DOWNTIME_SOON_CUTOFF
              }
              status="success"
            />
            <IntroPageSummary />
          </div>
        );
        break;
      }
      case SERVICE_AVAILABILITY_STATES.down:
      default: {
        content = (
          <AlertBox
            headline={downtimeAlertHeadline}
            content={downtimeAlertContent}
            isVisible
            status="error"
          />
        );
      }
    }

    return content;
  }

  render() {
    const content = this.getContent();

    return (
      <div>
        <h1>Post-9/11 GI Bill Statement of Benefits</h1>
        {content}
      </div>
    );
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
)(IntroPage);
