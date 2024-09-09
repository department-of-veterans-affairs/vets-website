import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AllergiesErrorModal = props => {
  const {
    onCloseButtonClick,
    onDownloadButtonClick,
    onCancelButtonClick,
    isPrint,
    visible,
  } = props;
  return (
    <VaModal
      onCloseEvent={onCloseButtonClick}
      modalTitle="We can’t access your allergy records right now"
      onPrimaryButtonClick={onDownloadButtonClick}
      onSecondaryButtonClick={onCancelButtonClick}
      primaryButtonText={
        isPrint ? 'Print without allergy list' : 'Download without allergy list'
      }
      secondaryButtonText={isPrint ? 'Cancel Print' : 'Cancel download'}
      status="warning"
      visible={visible}
      uswds
      large
    >
      {isPrint ? (
        <p>
          When you print medication records, we include a list of your allergies
          and reactions. <br />
          But we can’t access your allergy records right now.
        </p>
      ) : (
        <p>
          When you download medication records, we include a list of your
          allergies and reactions. But we can’t access your allergy records
          right now.
        </p>
      )}
    </VaModal>
  );
};

AllergiesErrorModal.propTypes = {
  visible: PropTypes.bool,
  onCancelButtonClick: PropTypes.func,
  onCloseButtonClick: PropTypes.func,
  onDownloadButtonClick: PropTypes.func,
};

export default AllergiesErrorModal;
