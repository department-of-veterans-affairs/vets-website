import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import { getAppeals } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import { appealStatusDescriptions } from '../utils/appeal-helpers';

/* eslint-disable react/no-danger */
class AppealStatusPage extends React.Component {
  componentDidMount() {
    if (!this.props.appeal) {
      this.props.getAppeals();
    }
  }

  render() {
    // console.log(this.props.appeal, !this.props.appeal)
    if (!this.props.appeal) {
      return null;
    }

    const { appeal } = this.props;
    const events = _.orderBy(appeal.attributes.events, [(e) => {
      return moment(e.date).unix();
    }]);
    const lastEvent = events.slice(-1)[0];

    const { status, nextAction } = appealStatusDescriptions[lastEvent.type];

    return (
      <div className="claims-status">
        <div className="row">
          <div>
            <h1>Your Compensation Appeal Status {this.props.params.id}</h1>
            <p>This information is accurate as of {moment().format('MMM DD, YYYY')}</p>
          </div>
        </div>
        <div className="row">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <div className="row">
              <div className="next-action">
                <h4>{nextAction.title}</h4>
                {nextAction.description}
              </div>
            </div>
            <div className="row">
              <div className="last-status">
                <h4>{status.title}</h4>
                <strong>{moment(lastEvent.date).format('MMM DD, YYYY')}</strong>
                <p dangerouslySetInnerHTML={{ __html: status.description }}/>
                <Link to="appeals/learn-more">Learn more about the appeals process</Link>
              </div>
            </div>
            <div className="row">
              <div className="previous-activity">
                <h3>Previous Activity for Your Appeal</h3>
              </div>
            </div>
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
