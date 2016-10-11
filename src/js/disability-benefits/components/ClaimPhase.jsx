import React from 'react';
import { getUserPhaseDescription } from '../utils/helpers';

const stepClasses = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five last'
};

function getClasses(phase, current) {
  const processClass = 'step wow fadeIn animated';
  const stepClass = stepClasses[phase];
  if (phase === current) {
    return `${stepClass} ${processClass} section-current`;
  } else if (current > phase) {
    return `${stepClass} ${processClass} section-complete`;
  }

  return processClass;
}

function displayActivity(activityList) {
  if (activityList) {
    return activityList.map((activity, index) =>
      <div key={index} className="claims-evidence">
        <p className="claims-evidence-date">Jul 17, 2016</p>
        <p className="claims-evidence-item">We requested <a href="/">Copy of DD214</a> from you</p>
      </div>);
  }

  return null;
}

export default class ClaimPhase extends React.Component {
  constructor(props) {
    super();
    this.state = { open: props.current === props.phase };
    this.expandCollapse = this.expandCollapse.bind(this);
  }
  expandCollapse() {
    this.setState({ open: !this.state.open });
  }
  render() {
    const { activity, phase, current, children } = this.props;
    return (
      <li onClick={() => this.expandCollapse()} role="presentation" className={`${getClasses(phase, current)}`}>
        <h5>{getUserPhaseDescription(phase)}</h5>
        {this.state.open
          ? <div>
            {children}
            {displayActivity(activity)}
          </div>
          : null}
      </li>
    );
  }
}

ClaimPhase.propTypes = {
  activity: React.PropTypes.array,
  phase: React.PropTypes.number.isRequired,
  current: React.PropTypes.number
};

