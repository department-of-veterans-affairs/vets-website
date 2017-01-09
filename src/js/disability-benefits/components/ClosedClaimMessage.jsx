import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import { getClaimType } from '../utils/helpers';

export default function ClosedClaimMessage({ claims }) {
  const closedClaims = claims.filter(claim => {
    return !claim.attributes.open && moment(claim.attributes.phaseChangeDate).isAfter(moment().add(-30, 'days'));
  });

  if (!closedClaims.length) {
    return null;
  }

  return (
    <div>
      {closedClaims.map(claim => (
        <div className="usa-alert usa-alert-warning claims-alert claims-list-alert" key={claim.id}>
          <div className="usa-alert-body">
            <h4 className="usa-alert-heading">A claim has been closed</h4>
            <p className="usa-alert-text">
              <Link to={`your-claims/${claim.id}/status`}>Your {getClaimType(claim)} Claim – Received {moment(claim.attributes.dateFiled).format('MMMM D, YYYY')}</Link> has been closed as of {moment(claim.attributes.phaseChangeDate).format('MMMM D, YYYY')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
