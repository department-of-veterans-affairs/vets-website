import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import LoadingIndicator from '../../common/components/LoadingIndicator';

import { getServiceUp } from '../actions/post-911-gib-status';
import { SERVICE_UP_STATES } from '../utils/constants';

export class IntroPage extends React.Component {
  constructor(props) {
    super(props);
    // Make the api request
    this.props.getServiceUp();
  }


  getContent() {
    let content;
    switch (this.props.serviceUp) {
      case SERVICE_UP_STATES.unrequested: {
        // This is never actually even seen
        content = (<div></div>);
        break;
      }
      case SERVICE_UP_STATES.pending: {
        // TODO: Change the loading message
        content = <LoadingIndicator message="Checking whether the service is up..."/>;
        break;
      }
      case SERVICE_UP_STATES.up: {
        // TODO: Determine whether h2 is right--accessibility-wise, it is, but it's larger than the design
        content = (
          <div>
            <h2>Check your Post-9/11 GI Bill benefits during these hours</h2>
            <p>The Post-9/11 GI Bill Benefits tool is available Sunday through Friday, 6:00 a.m. to 10:00 p.m. (ET), and Saturday 6:00 a.m. to 7:00 p.m. (ET).</p>
            <Link to="status" className="usa-button va-button-primary">View your GI Bill Benefits</Link>
            <h2>What if I have trouble accessing my benefit statement?</h2>
            <p>There have been some recent problems with this tool on eBenefits. If it's not working, we recommend you bookmark the eBenefits page in your browser and check back in a few days.</p>
          </div>
        );
        break;
      }
      case SERVICE_UP_STATES.down:
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
    const content = this.getContent();
    return (
      <div className="row">
        <div className="medium-8 columns">
          <h1>Post-9/11 GI Bill Statement of Benefits</h1>
          <p>
            If you served on active duty after September 10, 2001, you and your dependents may qualify for Post-9/11 GI Bill education benefits. These benefits can help cover all or some of the costs for school or training. Find out how to check if you have any Post-9/11 GI Bill benefits—and how to track the amount of money you have left to pay for school or training.
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
  const { serviceUp } = state.post911GIBStatus;
  return {
    serviceUp
  };
};

const mapDispatchToProps = {
  getServiceUp
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroPage);

