import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

export default function ClaimsListItem({ claim }) {
  return (
    <Link className="claim-list-item" to={`/your-claims/${claim.id}/status`}>
      <h4 className="claim-list-item-header">Compensation Claim</h4>
      <p className="status">Status: TODO</p>
      <p className="communications">
        {claim.attributes.developmentLetterSent && !claim.attributes.decisionLetter
          ? <p><i className="fa fa-envelope"></i>We sent you a development letter</p>
          : null}
        {claim.attributes.decisionLetterSent
          ? <p><i className="fa fa-envelope"></i>We sent you a decision letter</p>
          : null}
        {!claim.attributes.decisionLetterSent
          ? <p><i className="fa fa-exclamation-triangle"></i>We need files from you TODO</p>
          : null}
      </p>
      <p>Last update: {moment(claim.attributes.phaseChangeDate).format('MMM M, YYYY')}</p>
    </Link>
  );
}

ClaimsListItem.propTypes = {
  claim: React.PropTypes.object
};
