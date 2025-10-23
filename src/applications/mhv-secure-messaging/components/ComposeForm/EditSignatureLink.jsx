import React from 'react';
import { useSelector } from 'react-redux';
import { selectSignature } from '../../selectors';

const EditSignatureLink = () => {
  const signature = useSelector(state => selectSignature(state));
  const includeSignature = signature?.includeSignature;

  // link below appears when the a user has a signature set up includeSignature: true
  if (includeSignature) {
    return (
      <div className="vads-u-margin-top--2">
        <a
          href="/profile/personal-information#messaging-signature"
          data-dd-action-name="Edit Signature"
          data-testid="edit-signature-link"
        >
          Edit signature for all messages
        </a>
      </div>
    );
  }
  return null;
};

export default EditSignatureLink;
