import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import moment from 'moment';

import { getAppeals } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';

class AppealStatusPage extends React.Component {
  componentDidMount() {
    if (!this.props.appeal) {
      this.props.getAppeals();
    }
  }

  render() {
    return (
      <div className="claims-status">
        <div className="row">
          <div>
            <h1>Your Compensation Appeal Status {this.props.params.id}</h1>
            <p>This information is accurate as of {moment().format('MMM DD, YYYY')}</p>
          </div>
        </div>
        <div className="row">
          <div className="next-action">
            next action explanation
          </div>
        </div>
        <div className="row">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <Link to="appeals/learn-more">Learn more about the appeals process</Link>
            <pre>
              {JSON.stringify(this.props.appeal, null, 2)}
            </pre>
          </div>
          <div className="small-12 usa-width-one-third medium-4 columns">
            <AskVAQuestions/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const appeal = claimsState.claims.appeals.filter(a => {
    return a.id === ownProps.params.id;
  })[0];

  return {
    appeal,
  };
}

const mapDispatchToProps = {
  getAppeals,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppealStatusPage));

export { AppealStatusPage };
