import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import { getPhaseDescription, isClaimComplete } from '../utils/helpers';

export default function ClaimsListItem({ claim }) {
  const inProgress = !isClaimComplete(claim);
  return (
    <Link className="claim-list-item" to={`your-claims/${claim.id}/status`}>
      <h4 className="claim-list-item-header">Disability Compensation Claim – Received {moment(claim.attributes.dateFiled).format('MMMM D, YYYY')}</h4>
      <p className="status">Status: {getPhaseDescription(claim.attributes.phase)}</p>
      <div className="communications">
        {inProgress && claim.attributes.developmentLetterSent
          ? <p><i className="fa fa-envelope"></i>We sent you a development letter</p>
          : null}
        {claim.attributes.decisionLetterSent
          ? <p><i className="fa fa-envelope"></i>We sent you a decision letter</p>
          : null}
        {inProgress && claim.attributes.documentsNeeded
          ? <p><i className="fa fa-exclamation-triangle"></i>Items need attention</p>
          : null}
      </div>
      {claim.attributes.phaseChangeDate &&
        <p>Last update: {moment(claim.attributes.phaseChangeDate).format('MMM D, YYYY')}</p>}
    </Link>
  );
}

ClaimsListItem.propTypes = {
  claim: React.PropTypes.object
};
