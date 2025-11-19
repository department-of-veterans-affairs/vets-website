import React from 'react';
import { useSelector } from 'react-redux';
import { selectSignature } from '../../selectors';
import RouterLinkAction from '../shared/RouterLinkAction';

const EditSignatureLink = () => {
  const signature = useSelector(state => selectSignature(state));
  const includeSignature = signature?.includeSignature;

  // link below appears when the a user has a signature set up includeSignature: true
  if (includeSignature) {
    return (
      <div className="vads-u-margin-top--2">
        <RouterLinkAction
          href="/profile/personal-information#messaging-signature"
          data-dd-action-name="Edit Signature"
          data-testid="edit-signature-link"
          text="Edit signature for all messages"
          active={false}
        />
      </div>
    );
  }
  return null;
};

export default EditSignatureLink;
