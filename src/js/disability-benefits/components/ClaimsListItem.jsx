import React from 'react';
import { Link } from 'react-router';

export default function ClaimsListItem({ claim }) {
  const filesNeeded = claim.attributes.trackedItems.stillNeedFromYouList ? claim.attributes.trackedItems.stillNeedFromYouList.length : null;
  return (
    <Link className="claim-list-item" to={`/your-claims/${claim.id}/status`}>
      <h4 className="claim-list-item-header">Compensation Claim</h4>
      <p className="status">Status: {claim.attributes.phaseDates.latestPhaseType}</p>
      {filesNeeded !== null
        ? <p><i className="fa fa-exclamation-triangle"></i>We need {filesNeeded} {filesNeeded > 1 ? 'files' : 'file'} from you</p>
        : null}
      <p><i className="fa fa-envelope"></i>We sent you a development letter (TODO)</p>
      <p>Last Update: TODO</p>
    </Link>
  );
}

ClaimsListItem.propTypes = {
  claim: React.PropTypes.object
};
