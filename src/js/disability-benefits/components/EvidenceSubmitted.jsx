import React from 'react';

export default function EvidenceSubmitted({ item, onClose }) {
  return (
    <div className="usa-alert usa-alert-success claims-alert">
      <button className="va-alert-close" onClick={onClose}>
        <i className="fa fa-close"></i>
      </button>
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">We have your evidence</h4>
        <p className="usa-alert-text">
          Thank you for filing {item}. We'll let you know when we’ve reviewed it.
        </p>
      </div>
    </div>
  );
}

EvidenceSubmitted.propTypes = {
  item: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired
};

