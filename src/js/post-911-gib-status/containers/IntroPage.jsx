import React from 'react';
import { connect } from 'react-redux';

import { getServiceUp } from '../actions/post-911-gib-status';
import { SERVICE_UP_STATES } from '../utils/constants';

class IntroPage extends React.Component {
  constructor(props) {
    super(props);
    // Make the api request
    this.props.getServiceUp();
  }


  getContent() {
    let content;
    switch (this.props.serviceUp) {
      case SERVICE_UP_STATES.unrequested: {
        content = (<div>Unrequested</div>);
        break;
      }
      case SERVICE_UP_STATES.pending: {
        content = (<div>Pending</div>);
        break;
      }
      case SERVICE_UP_STATES.up: {
        content = (<div>Up</div>);
        break;
      }
      case SERVICE_UP_STATES.down:
      default: {
        content = (<div>Down</div>);
      }
    }

    return content;
  }


  render() {
    const content = this.getContent();
    return (
      <div>
        <h1>Post-9/11 GI Bill Statement of Benefits</h1>
        <p>
          If you served on active duty after September 10, 2001, you and your dependents may qualify for Post-9/11 GI Bill education benefits. These benefits can help cover all or some of the costs for school or training. Find out how to check if you have any Post-9/11 GI Bill benefits—and how to track the amount of money you have left to pay for school or training.
        </p>
        {content}
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
