import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export default function RemoveCompareSelectedModal({
  name,
  onClose,
  onRemove,
  onCancel,
}) {
  return (
    <Modal
      onClose={() => onClose()}
      primaryButton={{
        action: onRemove,
        text: 'Yes',
      }}
      secondaryButton={{
        action: onCancel,
        text: 'No',
      }}
      title="Remove institution from comparison"
      visible={name}
    >
      <p>Do you want to remove {name} from your comparison?</p>
    </Modal>
  );
}
