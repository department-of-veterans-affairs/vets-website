import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export default function RemoveCompareSelectedModal({
  name,
  onClose,
  onAccept,
  onCancel,
}) {
  return (
    <Modal
      onClose={() => onClose()}
      primaryButton={{
        action: onAccept,
        text: 'Remove',
      }}
      secondaryButton={{
        action: onCancel,
        text: 'Cancel',
      }}
      title="Remove Institution?"
      visible={name}
    >
      <p>Remove {name} from your comparison?</p>
    </Modal>
  );
}
