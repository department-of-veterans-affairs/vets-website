import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import BrandConsolidationSummary, {
  VetsDotGovSummary,
} from './IntroPageSummary';
import brandConsolidation from '../../../platform/brand-consolidation';
import { getServiceAvailability } from '../actions/post-911-gib-status';
import { SERVICE_AVAILABILITY_STATES } from '../utils/constants';

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
        content = brandConsolidation.isEnabled() ? (
          <BrandConsolidationSummary />
        ) : (
          <VetsDotGovSummary />
        );
        break;
      }
      case SERVICE_AVAILABILITY_STATES.down:
      default: {
        content = (
          <div className="usa-alert usa-alert-warning">
            <div className="usa-alert-body">
              <h3>
                The Post-9/11 GI Bill Benefits tool is down for maintenance
                right now
              </h3>
              <p className="usa-alert-text">
                You can use the Post-9/11 GI Bill Benefits tool Sunday through
                Friday, 6:00 a.m. to 10:00 p.m. (ET), and Saturday 6:00 a.m. to
                7:00 p.m. (ET). We do regular maintenance on the tool outside of
                these hours, and during that time you won't be able to use it.
              </p>
            </div>
          </div>
        );
      }
    }

    return content;
  }

  render() {
    const gibsWarning = (
      <div className="usa-alert usa-alert-warning intro-warning">
        <div className="usa-alert-body">
          We’re sorry. Something’s not working quite right with the GI Bill
          benefits tool. We’re working to fix the problem. If you encounter any
          errors, please try again later.
        </div>
      </div>
    );

    const content = this.getContent();

    if (brandConsolidation.isEnabled()) {
      return (
        <div>
          {this.props.serviceAvailability === SERVICE_AVAILABILITY_STATES.up &&
            gibsWarning}
          <h1>Check Your Post-9/11 GI Bill Benefits</h1>
          {content}
        </div>
      );
    }

    return (
      <div className="row">
        <div className="medium-8 columns">
          {this.props.serviceAvailability === SERVICE_AVAILABILITY_STATES.up &&
            gibsWarning}
          <h1>Post-9/11 GI Bill Statement of Benefits</h1>
          <p>
            If you were awarded Post-9/11 GI Bill education benefits, your GI
            Bill Statement of Benefits will show you how much of your benefits
            you’ve used and how much you have left to use for your education or
            training. These education benefits can help cover some or all of the
            costs for school or training.
          </p>
          <p>
            You'll be able to view this benefit statement only if you were
            awarded education benefits.
          </p>
          {content}
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { serviceAvailability } = state.post911GIBStatus;
  return {
    serviceAvailability,
  };
};

const mapDispatchToProps = {
  getServiceAvailability,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroPage);
