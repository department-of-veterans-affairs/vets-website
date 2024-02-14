/**
 * For array builder pattern
 * Cancel adding button which includes a modal on click
 */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';

const ArrayBuilderCancelAddingButton = ({
  arrayPath,
  setFormData,
  formData,
  buttonText,
  modalTitle,
  modalDescription,
  goToPath,
  summaryRoute,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const urlParams = new URLSearchParams(window?.location?.search);

  if (!urlParams?.has('add')) {
    return null; // cancel button only applicable for adding
  }

  const arrayData = get(arrayPath, formData);
  if (!arrayData?.length) {
    return null; // nothing to cancel if there's no array data
  }

  function showCancelConfirmationModal() {
    setIsModalVisible(true);
  }

  function hideCancelConfirmationModal() {
    setIsModalVisible(false);
  }

  function cancelAction() {
    const arrayIndex = getUrlPathIndex(window.location.pathname);
    const newArrayData = arrayData.filter((_, i) => i !== arrayIndex);
    const newData = set(arrayPath, newArrayData, formData);
    setFormData(newData);
    hideCancelConfirmationModal();
    goToPath(summaryRoute);
  }

  return (
    <div className="vads-u-margin-top--3 vads-u-margin-bottom--4">
      <va-button
        text={buttonText}
        data-action="cancel"
        onClick={showCancelConfirmationModal}
        secondary
        uswds
      />
      <VaModal
        clickToClose
        status="warning"
        modalTitle={modalTitle}
        primaryButtonText="Yes, cancel adding"
        secondaryButtonText="No, cancel"
        onCloseEvent={hideCancelConfirmationModal}
        onPrimaryButtonClick={cancelAction}
        onSecondaryButtonClick={hideCancelConfirmationModal}
        visible={isModalVisible}
        uswds
      >
        {modalDescription}
      </VaModal>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

ArrayBuilderCancelAddingButton.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  buttonText: PropTypes.object.isRequired,
  formData: PropTypes.string.isRequired,
  goToPath: PropTypes.func.isRequired,
  modalDescription: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  setFormData: PropTypes.string.isRequired,
  summaryRoute: PropTypes.string.isRequired,
};

/**
 * Usage:
 * ```
 * <ArrayBuilderCancelAddingButton
 *   buttonText="Cancel adding this employer"
 *   arrayPath="employers"
 *   modalTitle="Are you sure you want to cancel adding this employer?"
 *   modalDescription="If you cancel adding this employer, we won't save the information. You'll return to a screen where you can add or remove employers."
 *   goToPath={goToPath}
 *   summaryRoute="/array-multiple-page-builder-summary"
 * />
 * ```
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArrayBuilderCancelAddingButton);
