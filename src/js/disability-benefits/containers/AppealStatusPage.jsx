import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import AskVAQuestions from '../components/AskVAQuestions';

class AppealStatusPage extends React.Component {
  render() {
    return (
      <div className="your-claims">
        <div className="row">
          <div>
            <h1>Your Compensation Appeal Status {this.props.params.id}</h1>
          </div>
        </div>
        <div className="row">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <Link to="appeals/learn-more">Learn more about the appeals process</Link>
          </div>
          <div className="small-12 usa-width-one-third medium-4 columns">
            <AskVAQuestions/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    message: claimsState.notifications.message,
    lastPage: claimsState.routing.lastPage,
  };
}

export default withRouter(connect(mapStateToProps)(AppealStatusPage));

export { AppealStatusPage };
