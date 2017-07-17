import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import { getAppeals } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import { appealStatusDescriptions, hearingDescriptions } from '../utils/appeal-helpers.jsx';
import { setPageFocus } from '../utils/page';

class AppealStatusPage extends React.Component {
  componentDidMount() {
    if (!this.props.appeal) {
      this.props.getAppeals();
    }
    setPageFocus();
  }

  renderStatusNextAction(lastEvent, previousHistory) {
    const { nextAction } = appealStatusDescriptions(lastEvent, previousHistory);
    const className = `next-action ${lastEvent.type}`;

    if (lastEvent.type === 'ssoc' && previousHistory[0].type !== 'soc') {
      return null;
    }

    if (nextAction) {
      return (
        <div className={className}>
          <h5>{nextAction.title}</h5>
          {nextAction.description}
        </div>
      );
    }

    return null;
  }

  renderHearingInfo() {
    const { appeal } = this.props;

    const activeHearings = _.filter(appeal.attributes.hearings, (h) => {
      return moment().isBefore(h.date);
    });

    const upcomingHearing = _.orderBy(activeHearings, [e => moment(e.date).unix()], ['asc'])[0];

    if (upcomingHearing) {
      const hearingContent = hearingDescriptions[upcomingHearing.type];

      return (
        <div className="next-action hearing">
          <h5>{hearingContent.title}</h5>
          {hearingContent.description}
        </div>
      );
    }

    return null;
  }

  renderPreviousActivity(lastEvent, previousHistory) {
    if (lastEvent.type === 'nod') {
      return (
        <div>
          <p>
            The NOD is the first step in your appeal. As your appeal moves through the process, the history of your appeal will be added here. On average, Veterans with appeals in the NOD stage, wait about 18 months for VBA to complete the necessary action.
          </p>
        </div>
      );
    }

    return (
      <table className="events-list">
        <tbody>
          {previousHistory.map((e, i) => {
            return (
              <tr key={i}>
                <td><i className="fa fa-check-circle"></i></td>
                <td className="date">
                  <strong>{moment(e.date).format('MMMM DD, YYYY')}</strong>
                </td>
                <td>{appealStatusDescriptions(e).status.title}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    if (!this.props.appeal) {
      return null;
    }

    const { appeal } = this.props;
    // always show merged event on top
    const events = _.orderBy(appeal.attributes.events, [e => e.type === 'merged', e => moment(e.date).unix()], ['desc', 'desc']);
    const lastEvent = events[0];
    const previousHistory = events.slice(1);
    const { status } = appealStatusDescriptions(lastEvent, previousHistory);

    return (
      <div className="claims-status">
        <div className="row">
          <div>
            <h1>Your Compensation Appeal Status</h1>
            <p>This information is accurate as of {moment().format('MMMM DD, YYYY')}.</p>
          </div>
        </div>
        <div className="row">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <div className="row">
              <div className="next-action-container">
                {this.renderHearingInfo()}
              </div>
            </div>
            <div className="row">
              <div className="next-action-container">
                {this.renderStatusNextAction(lastEvent, previousHistory)}
              </div>
            </div>
            <div className="row">
              <div className="last-status">
                <div className="content">
                  <i className="fa fa-check-circle"></i>
                  <h5>{status.title}</h5>
                  <strong>{moment(lastEvent.date).format('MMMM DD, YYYY')}</strong>
                  {status.description}
                  <p>
                    <a href="/disability-benefits-beta/claims-appeal/">Learn more about the appeals process</a>.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="previous-activity">
                <h4>Previous Activity for Your Appeal</h4>
                {this.renderPreviousActivity(lastEvent, previousHistory)}
              </div>
            </div>
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

  // append starting event for post-remand and post-cavc remand appeals
  if (appeal && appeal.attributes.type !== 'original' && appeal.attributes.prior_decision_date) {
    appeal.attributes.events.unshift({
      type: appeal.attributes.type === 'post_cavc_remand' ? 'cavc_decision' : 'bva_remand',
      date: appeal.attributes.prior_decision_date,
    });
  }

  return {
    appeal,
  };
}

const mapDispatchToProps = {
  getAppeals,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppealStatusPage));

export { AppealStatusPage };
