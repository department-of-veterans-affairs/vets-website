import React from 'react';

export default function EvidenceSubmitted({ item, onClose }) {
  return (
    <div className="usa-alert usa-alert-success evidence-submitted-alert">
      <button className="va-alert-close" onClick={onClose}>
        <i className="fa fa-close"></i>
      </button>
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">Evidence Submitted</h4>
        <p className="usa-alert-text">
          Thank you. Your evidence for {item} has been submitted. We will let you know when the VA has received it.
        </p>
      </div>
    </div>
  );
}

EvidenceSubmitted.propTypes = {
  item: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired
};

