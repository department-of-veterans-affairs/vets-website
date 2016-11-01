import React from 'react';

export default function MailOrFax({ onClose }) {
  return (
    <div>
      <div className="claims-status-upload-header">Mail and Fax Instructions</div>
      <div className="claims-status-upload-inner">
        <p>
          Please upload your documents online to help VA process your claim quickly.
        </p>
        <p>
          If you can’t upload documents:
        </p>
        <ol>
          <li>Make copies of the documents.</li>
          <li>Make sure you write your name and claim number on every page.</li>
          <li>Mail or fax them to the <a target="_blank" href="http://www.benefits.va.gov/COMPENSATION/mailingaddresses.asp">VA Claims Intake Center.</a></li>
        </ol>
        <p>
          <button className="usa-button" onClick={onClose}>Close</button>
        </p>
      </div>
    </div>
  );
}

MailOrFax.propTypes = {
  onClose: React.PropTypes.func.isRequired
};

