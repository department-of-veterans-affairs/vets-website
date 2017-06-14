import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import { isClaimComplete, getAppealsStatusDescription } from '../utils/helpers';

export default function AppealListItem({ claim }) {
  const inProgress = !isClaimComplete(claim);

  const lastEvent = claim.attributes.events.slice(-1)[0];
  const firstEvent = claim.attributes.events[0];

  return (
    <Link className="claim-list-item" to={`your-claims/${claim.id}/status`}>
      <h4 className="claim-list-item-header">Compensation Appeal – Received {moment(firstEvent.date).format('MMMM D, YYYY')}</h4>
      <p className="status"><span className="claim-item-label">Status:</span> {getAppealsStatusDescription(lastEvent)}</p>
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
      <p><span className="claim-item-label">Last update:</span> {moment(lastEvent.date).format('MMM D, YYYY')}</p>
    </Link>
  );
}

AppealListItem.propTypes = {
  claim: PropTypes.object
};
