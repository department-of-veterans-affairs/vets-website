import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function RemoveCompareSelectedModal({
  name,
  onClose,
  onRemove,
  onCancel,
}) {
  return (
    <VaModal
      onCloseEvent={onClose}
      onPrimaryButtonClick={onRemove}
      primaryButtonText='Yes'
      onSecondaryButtonClick={onCancel}
      secondaryButtonText='No'
      modalTitle="Remove institution from comparison"
      visible={name}
    >
      <p>Do you want to remove {name} from your comparison?</p>
    </VaModal>
  );
}
