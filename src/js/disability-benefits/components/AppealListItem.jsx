import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import { getAppealsStatusDescription } from '../utils/helpers';

function nextAction(claim) {
  const iconName = 'fa-exclamation-triangle';
  const icon = claim ? <i className={`fa ${iconName}`}></i> : null;
  return <p>{icon} Next action text</p>;
}

export default function AppealListItem({ claim }) {
  const lastEvent = claim.attributes.events.slice(-1)[0];
  const firstEvent = claim.attributes.events[0];

  return (
    <Link className="claim-list-item" to={`appeals/${claim.id}/status`}>
      <h4 className="claim-list-item-header">Compensation Appeal – Received {moment(firstEvent.date).format('MMMM D, YYYY')}</h4>
      <p className="status"><span className="claim-item-label">Status:</span> {getAppealsStatusDescription(lastEvent)}</p>
      <div className="communications">
        {nextAction(lastEvent)}
      </div>
      <p><span className="claim-item-label">Last update:</span> {moment(lastEvent.date).format('MMM D, YYYY')}</p>
    </Link>
  );
}

AppealListItem.propTypes = {
  claim: PropTypes.object
};
