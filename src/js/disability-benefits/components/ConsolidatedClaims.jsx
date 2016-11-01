import React from 'react';

export default function ConsolidatedClaims({ onClose }) {
  return (
    <div>
      <div className="claims-status-upload-header">Claim status update</div>
      <div className="claims-status-upload-inner">
        <h4 className="modal-title">A note about consolidated claims</h4>
        <p>
          If you turn in a new claim while we're reviewing another one from you, we'll add any new information to the original claim and close the new claim, with no action required from you.
        </p>
        <p>
          <button className="usa-button" onClick={onClose}>Close</button>
        </p>
      </div>
    </div>
  );
}

ConsolidatedClaims.propTypes = {
  onClose: React.PropTypes.func.isRequired
};

