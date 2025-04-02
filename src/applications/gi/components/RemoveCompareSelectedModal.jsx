import React from 'react';
import PropTypes from 'prop-types';
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
      primaryButtonText="Yes"
      onSecondaryButtonClick={onCancel}
      secondaryButtonText="No"
      modalTitle="Remove institution from comparison"
      visible={name}
    >
      <p>Do you want to remove {name} from your comparison?</p>
    </VaModal>
  );
}

RemoveCompareSelectedModal.propTypes = {
  name: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
