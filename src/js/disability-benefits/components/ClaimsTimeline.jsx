import React from 'react';
import ClaimPhase from './ClaimPhase';

function getUserPhase(phase) {
  if (phase < 3) {
    return phase;
  } else if (phase >= 3 && phase < 7) {
    return 3;
  }

  return phase - 3;
}

function groupActivity(events) {
  const phases = {};
  const phaseEvents = events
    .filter(event => event.type !== 'completed' && event.type !== 'filed');
  let activity = [];
  let lastPhaseNumber = 1;

  phaseEvents.forEach(event => {
    if (event.type.startsWith('phase')) {
      const phaseNumber = parseInt(event.type.replace('phase', ''), 10);
      const userPhaseNumber = getUserPhase(phaseNumber);
      phases[userPhaseNumber] = (phases[userPhaseNumber] || []).concat(activity);
      activity = [];
      lastPhaseNumber = userPhaseNumber;
    } else {
      activity.push(event);
    }
  });

  if (activity.length > 0) {
    phases[lastPhaseNumber + 1] = (phases[lastPhaseNumber + 1] || []).concat(activity);
  }

  return phases;
}

export default class ClaimsTimeline extends React.Component {
  render() {
    const { events, phase } = this.props;
    const userPhase = getUserPhase(phase);
    const activityByPhase = groupActivity(events);
    return (
      <ol className="process form-process">
        <ClaimPhase phase={1} current={userPhase} activity={activityByPhase[1]}>
          <p>Thank you. VA received your claim</p>
        </ClaimPhase>
        <ClaimPhase phase={2} current={userPhase} activity={activityByPhase[2]}/>
        <ClaimPhase phase={3} current={userPhase} activity={activityByPhase[3]}>
          <p>If VA needs more information, the Veterans Service Representative (VSR) will request it from you on your behalf. Once VA has all the information it needs, the VSR will confirm, issue by issue, that the claim is ready for a decision.</p>
        </ClaimPhase>
        <ClaimPhase phase={4} current={userPhase} activity={activityByPhase[4]}/>
        <ClaimPhase phase={5} current={userPhase} activity={activityByPhase[5]}>
          {userPhase === 5
            ? <p>Your claim is complete.</p>
            : <div className="claim-completion-estimation">
              <p className="date-estimation">Estimated Mar 11, 2018</p>
              <p><a href="/">Learn about this estimation</a></p>
            </div>}
        </ClaimPhase>
      </ol>
    );
  }
}

ClaimsTimeline.propTypes = {
  events: React.PropTypes.array,
  phase: React.PropTypes.number.isRequired
};

