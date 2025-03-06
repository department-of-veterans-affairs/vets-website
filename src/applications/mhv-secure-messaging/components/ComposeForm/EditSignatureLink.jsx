import React from 'react';
import { useSelector } from 'react-redux';
import { selectSignature } from '../../selectors';
import useFeatureToggles from '../../hooks/useFeatureToggles';

const EditSignatureLink = () => {
  const signature = useSelector(state => selectSignature(state));
  const includeSignature = signature?.includeSignature;
  const {
    isSignatureSettingsEnabled,
    featureTogglesLoading,
  } = useFeatureToggles();

  // link below appears when the isSignatureSettingsEnabled feature flag is enabled
  // and a user has a signature set up  includeSignature: true
  if (
    !featureTogglesLoading &&
    isSignatureSettingsEnabled &&
    includeSignature
  ) {
    return (
      <div className="vads-u-margin-top--2">
        <a
          href="/profile/personal-information#messaging-signature"
          data-dd-action-name="Edit Signature"
        >
          Edit signature for all messages
        </a>
      </div>
    );
  }
  return null;
};

export default EditSignatureLink;
