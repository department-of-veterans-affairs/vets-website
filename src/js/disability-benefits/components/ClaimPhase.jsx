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
  }
  displayActivity() {
    const activityList = this.props.activity[this.props.phase];

    if (activityList) {
      const filesPath = `your-claims/${this.props.id}/files`;
      const limitedList = this.state.showAll || activityList.length <= INITIAL_ACTIVITY_ROWS
        ? activityList
        : _.take(INITIAL_ACTIVITY_ROWS, activityList);

      const activityListContent = limitedList.map((activity, index) =>
        <div key={index} className="claims-evidence">
          <p className="claims-evidence-date">{moment(activity.date).format('MMM D, YYYY')}</p>
          {activity.type === 'still_need_from_you_list'
            ? <p className="claims-evidence-item">We requested <Link to={filesPath}>{activity.displayName}</Link> from you</p>
            : null}
          {activity.type === 'still_need_from_others_list'
            ? <p className="claims-evidence-item">We requested <Link to={filesPath}>{activity.displayName}</Link> from others</p>
            : null}
          {activity.type === 'received_from_others_list'
            ? <p className="claims-evidence-item">We received {activity.displayName} from others</p>
            : null}
          {activity.type === 'received_from_you_list'
            ? <p className="claims-evidence-item">We received {activity.displayName} from you</p>
            : null}
          {activity.type === 'phase_entered'
            ? <p className="claims-evidence-item">Your claim moved to {getUserPhaseDescription(this.props.phase)}</p>
            : null}
          {activity.type === 'filed'
            ? <p className="claims-evidence-item">Thank you. VA received your claim</p>
            : null}
          {activity.type === 'completed'
            ? <p className="claims-evidence-item">Your claim is complete</p>
            : null}
        </div>);

      if (!this.state.showAll && activityList.length > INITIAL_ACTIVITY_ROWS) {
        return (<div>
          <div>
            {activityListContent}
          </div>
          <button className="usa-button-outline" onClick={this.showAllActivity}>See older updates</button>
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

