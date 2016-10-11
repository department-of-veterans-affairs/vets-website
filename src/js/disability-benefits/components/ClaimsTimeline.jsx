import React from 'react';
import moment from 'moment';
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
  let lastPhaseNumber = 0;

  phaseEvents.forEach(event => {
    if (event.type.startsWith('phase')) {
      const phaseNumber = parseInt(event.type.replace('phase', ''), 10);
      const userPhaseNumber = getUserPhase(phaseNumber);
      if (userPhaseNumber !== lastPhaseNumber) {
        activity.push({
          type: 'phase_entered',
          date: event.date
        });
      }
      phases[userPhaseNumber + 1] = (phases[userPhaseNumber + 1] || []).concat(activity);
      activity = [];
      lastPhaseNumber = userPhaseNumber;
    } else {
      activity.push(event);
    }
  });

  if (activity.length > 0) {
    phases[lastPhaseNumber] = (phases[lastPhaseNumber] || []).concat(activity);
  }

  return phases;
}

export default class ClaimsTimeline extends React.Component {
  render() {
    const { events, phase, estimatedDate, id } = this.props;
    const userPhase = getUserPhase(phase);
    const activityByPhase = groupActivity(events);
    return (
      <ol className="process form-process">
        <ClaimPhase phase={1} current={userPhase} activity={activityByPhase[1]} id={id}>
          <p>Thank you. VA received your claim</p>
        </ClaimPhase>
        <ClaimPhase phase={2} current={userPhase} activity={activityByPhase[2]} id={id}/>
        <ClaimPhase phase={3} current={userPhase} activity={activityByPhase[3]} id={id}>
          <p>If VA needs more information, the Veterans Service Representative (VSR) will request it from you on your behalf. Once VA has all the information it needs, the VSR will confirm, issue by issue, that the claim is ready for a decision.</p>
        </ClaimPhase>
        <ClaimPhase phase={4} current={userPhase} activity={activityByPhase[4]} id={id}/>
        <ClaimPhase phase={5} current={userPhase} activity={activityByPhase[5]} id={id}>
          {userPhase === 5
            ? <p>Your claim is complete.</p>
            : <div className="claim-completion-estimation">
              <p className="date-estimation">Estimated {moment(estimatedDate).format('MMM D, YYYY')}</p>
              <p><a href="/">Learn about this estimation</a></p>
            </div>}
        </ClaimPhase>
      </ol>
    );
  }
}

ClaimsTimeline.propTypes = {
  events: React.PropTypes.array,
  phase: React.PropTypes.number.isRequired,
  id: React.PropTypes.string.isRequired
};

