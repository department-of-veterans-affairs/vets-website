import PropTypes from 'prop-types';
import React from 'react';

export default function ConsolidatedClaims({ onClose }) {
  return (
    <div>
      <div className="va-modal-inner">
        <h3 id="consolidated-claims-title">A note about consolidated claims</h3>
        <button
          className="va-modal-close"
          type="button"
          onClick={onClose}>
          <i className="fa fa-close"></i>
          <span className="usa-sr-only">Close this modal</span>
        </button>
        <div className="va-modal-body">
          If you turn in a new claim while we’re reviewing another one from you, we’ll add any new information to the original claim and close the new claim, with no action required from you.
        </div>
      </div>
    </div>
  );
}

ConsolidatedClaims.propTypes = {
  onClose: PropTypes.func.isRequired
};
