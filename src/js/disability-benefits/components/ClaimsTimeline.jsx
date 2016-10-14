import React from 'react';
import moment from 'moment';
import ClaimPhase from './ClaimPhase';
import { getUserPhase, groupTimelineActivity } from '../utils/helpers';

export default class ClaimsTimeline extends React.Component {
  render() {
    const { events, phase, estimatedDate, id } = this.props;
    const userPhase = getUserPhase(phase);
    const activityByPhase = groupTimelineActivity(events);

    return (
      <ol className="process form-process disability-benefits-timeline">
        <ClaimPhase phase={1} current={userPhase} activity={activityByPhase} id={id}/>
        <ClaimPhase phase={2} current={userPhase} activity={activityByPhase} id={id}/>
        <ClaimPhase phase={3} current={userPhase} activity={activityByPhase} id={id}>
          <p>If VA needs more information, the Veterans Service Representative (VSR) will request it from you on your behalf. Once VA has all the information it needs, the VSR will confirm, issue by issue, that the claim is ready for a decision.</p>
        </ClaimPhase>
        <ClaimPhase phase={4} current={userPhase} activity={activityByPhase} id={id}/>
        <ClaimPhase phase={5} current={userPhase} activity={activityByPhase} id={id}>
          {userPhase !== 5
            ? <div className="claim-completion-estimation">
              <p className="date-estimation">Estimated {moment(estimatedDate).format('MMM D, YYYY')}</p>
              <p><a href="/">Learn about this estimation</a></p>
            </div>
            : null}
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

