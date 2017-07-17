import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';

import { getEnrollmentData } from '../actions/post-911-gib-status';

class Main extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentData();
  }

  render() {
    let appContent;
    switch (this.props.availability) {
      case 'available':
        appContent = this.props.children;
        break;
      case 'awaitingResponse':
        appContent = <LoadingIndicator message="Loading your Post-9/11 GI Bill benefit information..."/>;
        break;
      case 'backendServiceError':
        // TODO: show the vets.gov standard system-down message
        // https://github.com/department-of-veterans-affairs/vets.gov-team/blob/master/Products/EVSS%20Integration/Letters%20and%20GIBS%20error%20messages%20mapping.md
        appContent = (<div>EVSS is down or timing out or partner service is down</div>);
        break;
      case 'backendAuthenticationError':
        // TODO: Backend authentication issues. Something like
        // "We weren't able to find your records / Please call 855-574-7286 between Monday - Friday, 8:00 a.m. - 8:00 p.m. ET."
        // as seen in src/js/disability-benefits/components/MviRecordsUnavailable.jsx
        // TODO: move this into a helper file.
        appContent = (
          <div>
            <div className="usa-alert usa-alert-error" role="alert">
              <div className="usa-alert-body">
                <h4 className="usa-alert-heading">Post-9/11 GI Bill Benefit Information Unavailable</h4>
                <p className="usa-alert-text">
                  We weren't able to retrieve your Post-9/11 GI Bill benefit information. Please call
                  888-442-4551 (888-GI-BILL-1) from 8 a.m. to 7 p.m. (ET).
                </p>
              </div>
            </div>
            <br/>
          </div>
        );
        break;
      case 'noChapter33Record':
        // TODO: render https://marvelapp.com/8d6igd9/screen/30345545,
        // Scenario G in
        // https://github.com/department-of-veterans-affairs/vets.gov-team/issues/3839
        appContent = (<div>You don't have any Post-9/11 GI Bill Benefits</div>);
        break;
      case 'unavailable':
      default:
        // TODO: This should never happen; log a Sentry error and show same as serviceError
        appContent = (<div>This should never happen.</div>);
    }


    return (
      <div className="gib-info">
        {appContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    enrollmentData: state.post911GIBStatus.enrollmentData,
    availability: state.post911GIBStatus.availability
  };
}

const mapDispatchToProps = {
  getEnrollmentData
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
