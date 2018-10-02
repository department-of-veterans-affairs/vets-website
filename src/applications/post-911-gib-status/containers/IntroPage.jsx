import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

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
        content = (<div></div>);
        break;
      }
      case SERVICE_AVAILABILITY_STATES.pending: {
        content = <LoadingIndicator message="Please wait while we check if the tool is available."/>;
        break;
      }
      case SERVICE_AVAILABILITY_STATES.up: {
        // TODO: Determine whether h2 is right--accessibility-wise, it is, but it's larger than the design
        content = (
          <div>
            <h2>How can I review my Post-9/11 GI Bill benefits?</h2>
            <p>The Post-9/11 GI Bill Benefits tool is available for you during these hours, Sunday through Friday, 6:00 a.m. to 10:00 p.m. (ET), and Saturday 6:00 a.m. to 7:00 p.m. (ET).</p>
            <Link id="viewGIBS" to="status" className="usa-button va-button-primary">View Your GI Bill Benefits</Link>
            <h2>What if I’m having trouble accessing my benefit statement?</h2>
            <p>Your Post-9/11 GI Bill Statement of Benefits might not be available if one of these is true:
              <ul>
                <li>The name on your Vets.gov account doesn’t exactly match the name we have in our Post-9/11 GI Bill records.</li>
                <li>We’re still processing your education benefits application and we haven’t yet created a record for you. We usually process applications within 60 days. If you applied less than 60 days ago, please check back soon.</li>
                <li>You haven’t yet applied for Post-9/11 GI Bill education benefits. <a href="/education/apply/" target="_blank">Apply for education benefits.</a>
                </li>
                <li>You’re not eligible for Post-9/11 GI Bill education benefits.</li>
                <li>You’re trying to access the tool during its scheduled downtime. The tool is available Sunday through Friday, 6:00 a.m. to 10:00 p.m. (ET), and Saturday 6:00 a.m. to 7:00 p.m. (ET).</li>
              </ul>
              If none of the above situations applies to you, and you think your Statement of Benefits should be here, please call the Vets.gov Help Desk at 1-855-574-7286. We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. (ET).

            </p>
          </div>
        );
        break;
      }
      case SERVICE_AVAILABILITY_STATES.down:
      default: {
        content = (
          <div className="usa-alert usa-alert-warning">
            <div className="usa-alert-body">
              <h3>The Post-9/11 GI Bill Benefits tool is down for maintenance right now</h3>
              <p className="usa-alert-text">You can use the Post-9/11 GI Bill Benefits tool Sunday through Friday, 6:00 a.m. to 10:00 p.m. (ET), and Saturday 6:00 a.m. to 7:00 p.m. (ET). We do regular maintenance on the tool outside of these hours, and during that time you won't be able to use it.</p>
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
          benefits tool. We’re working to fix the problem. If you encounter
          any errors, please try again later.
        </div>
      </div>
    );

    const content = this.getContent();
    return (
      <div className="row">
        <div className="medium-8 columns">
          {this.props.serviceAvailability === SERVICE_AVAILABILITY_STATES.up && gibsWarning}
          <h1>Post-9/11 GI Bill Statement of Benefits</h1>
          <p>
            If you were awarded Post-9/11 GI Bill education benefits, your GI Bill Statement of Benefits will show you how much of your benefits you’ve used and how much you have left to use for your education or training. These education benefits can help cover some or all of the costs for school or training.
          </p>
          <p>
            You'll be able to view this benefit statement only if you were awarded education benefits.
          </p>
          {content}
          <br/>
          <br/>
          <br/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { serviceAvailability } = state.post911GIBStatus;
  return {
    serviceAvailability
  };
};

const mapDispatchToProps = {
  getServiceAvailability
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroPage);

