import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash/fp';
import { getUserPhaseDescription } from '../utils/helpers';

const stepClasses = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five last'
};

const COMPLETE_PHASE = 5;
const INITIAL_ACTIVITY_ROWS = 5;

function getClasses(phase, current) {
  const processClass = 'step wow fadeIn animated';
  const stepClass = stepClasses[phase];
  if (phase === current) {
    return `${stepClass} ${processClass} section-current`;
  } else if (current > phase) {
    return `${stepClass} ${processClass} section-complete`;
  }

  return `${stepClass} ${processClass}`;
}


export default class ClaimPhase extends React.Component {
  constructor(props) {
    super();
    this.state = { open: props.current === props.phase, showAll: false };
    this.expandCollapse = this.expandCollapse.bind(this);
    this.displayActivity = this.displayActivity.bind(this);
    this.showAllActivity = this.showAllActivity.bind(this);
    this.getEventDescription = this.getEventDescription.bind(this);
  }
  getEventDescription(event) {
    const filesPath = `your-claims/${this.props.id}/files`;
    const fromVet = event.type.endsWith('you_list');

    switch (event.type) {
      case 'phase_entered':
        return (
          <div className="claims-evidence-item columns medium-9">
            Your claim moved to {getUserPhaseDescription(this.props.phase)}
          </div>
        );

      case 'filed':
        return <div className="claims-evidence-item columns medium-9">Thank you. VA received your claim</div>;

      case 'completed':
        return <div className="claims-evidence-item columns medium-9">Your claim is complete</div>;

      case 'still_need_from_you_list':
      case 'still_need_from_others_list':
        if (event.uploaded || event.status === 'SUBMITTED_AWAITING_REVIEW') {
          return (
            <div className="claims-evidence-item columns medium-9">
              {fromVet ? 'You' : 'Others'} submitted {event.displayName}. We will notify you when we have reviewed it.
            </div>
          );
        }
        return (
          <div className="claims-evidence-item columns medium-9">
            We added a notice for: <Link to={filesPath}>{event.displayName}</Link>
          </div>
        );

      case 'received_from_you_list':
      case 'received_from_others_list':
        if (event.status === 'SUBMITTED_AWAITING_REVIEW') {
          return (
            <div className="claims-evidence-item columns medium-9">
              {fromVet ? 'You' : 'Others'} submitted {event.displayName}. We will notify you when we have reviewed it.
            </div>
          );
        }
        return (
          <div className="claims-evidence-item columns medium-9">
            We have reviewed your submitted evidence for {event.displayName}. We will notify you if we need additional information.
          </div>
        );

      default:
        return null;
    }
  }
  displayActivity() {
    const activityList = this.props.activity[this.props.phase];

    if (activityList) {
      const limitedList = this.state.showAll || activityList.length <= INITIAL_ACTIVITY_ROWS
        ? activityList
        : _.take(INITIAL_ACTIVITY_ROWS, activityList);

      const activityListContent = limitedList.map((activity, index) =>
        <div key={index} className="claims-evidence row small-collapse">
          <div className="claims-evidence-date columns medium-3">{moment(activity.date).format('MMM D, YYYY')}</div>
          {this.getEventDescription(activity)}
        </div>);

      if (!this.state.showAll && activityList.length > INITIAL_ACTIVITY_ROWS) {
        return (<div>
          <div>
            {activityListContent}
          </div>
          <button
              className="older-updates usa-button-outline"
              onClick={this.showAllActivity}>
            See older updates&nbsp;<i className="fa fa-chevron-down" ariaHidden="true"></i>
          </button>
        </div>);
      }

      return activityListContent;
    }

    return null;
  }
  showAllActivity(event) {
    this.setState({ showAll: true });
    event.stopPropagation();
  }
  expandCollapse() {
    if (this.props.phase <= this.props.current) {
      this.setState({ open: !this.state.open });
    }
  }
  render() {
    const { phase, current, children } = this.props;
    return (
      <li onClick={() => this.expandCollapse()} role="presentation" className={`${getClasses(phase, current)}`}>
        <h5>{getUserPhaseDescription(phase)}</h5>
        {this.state.open || phase === COMPLETE_PHASE
          ? <div>
            {children}
            {this.displayActivity()}
          </div>
          : null}
      </li>
    );
  }
}

ClaimPhase.propTypes = {
  activity: React.PropTypes.object,
  phase: React.PropTypes.number.isRequired,
  current: React.PropTypes.number,
  id: React.PropTypes.string.isRequired
};
