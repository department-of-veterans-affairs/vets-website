import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import { getClaimType } from '../utils/helpers';

export default function ClosedClaimMessage({ claims, onClose }) {
  const closedClaims = claims.filter(claim => {
    return !claim.attributes.open
      && moment(claim.attributes.phaseChangeDate).startOf('day').isAfter(moment().add(-30, 'days').startOf('day'));
  });

  if (!closedClaims.length) {
    return null;
  }

  return (
    <div className="usa-alert usa-alert-warning claims-alert claims-list-alert" role="alert">
      <button className="va-alert-close notification-close" onClick={onClose} aria-label="Close notification">
        <i className="fa fa-close" aria-label="Close icon"></i>
      </button>
      <div className="usa-alert-body">
        <h5 className="usa-alert-heading">Recently closed:</h5>
        {closedClaims.map(claim => (
          <p className="usa-alert-text claims-closed-text" key={claim.id}>
            <Link to={`your-claims/${claim.id}/status`}>Your {getClaimType(claim)} Claim – Received {moment(claim.attributes.dateFiled).format('MMMM D, YYYY')}</Link> has been closed as of {moment(claim.attributes.phaseChangeDate).format('MMMM D, YYYY')}
          </p>
        ))}
      </div>
    </div>
  );
}
