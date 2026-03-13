/**
 * For array builder pattern
 * Cancel adding button which includes a modal on click
 */
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import {
  VaButton,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '~/platform/utilities/ui';
import get from '~/platform/utilities/data/get';
import set from '~/platform/utilities/data/set';
import * as helpers from './helpers';

export function formatPath(path) {
  return path && path.charAt(0) !== '/' ? `/${path}` : path;
}

/**
 * @param {{
 *   arrayPath: string,
 *   className: string,
 *   setFormData: (data) => void,
 *   formData: any,
 *   goToPath: (path, force) => void,
 *   summaryRoute: string,
 *   required: (formData) => boolean,
 *   reviewRoute: string,
 *   introRoute: string,
 *   getText: ArrayBuilderGetText,
 *   nestedArrayCallback: () => void
 * }} props
 */
const ArrayBuilderCancelButton = ({
  arrayPath,
  setFormData,
  formData,
  goToPath,
  summaryRoute,
  introRoute,
  getText,
  className,
  reviewRoute,
  required,
  nestedArrayCallback = null,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cancelButtonRef = useRef(null);
  const urlParams = helpers.getArrayUrlSearchParams();
  const arrayIndex = helpers.getArrayIndexFromPathName();
  const isEdit = urlParams?.has('edit');
  const isAdd = urlParams?.has('add');
  const isReview = urlParams?.has('review');
  const currentItem = get(arrayPath, formData)?.[arrayIndex];

  let modalDescriptionKey = isEdit
    ? 'cancelEditDescription'
    : 'cancelAddDescription';
  if (isReview) {
    modalDescriptionKey = isEdit
      ? 'cancelEditReviewDescription'
      : 'cancelAddReviewDescription';
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
    if (cancelButtonRef.current) {
      focusElement('button', {}, cancelButtonRef.current);
    }
  }

  function removeCurrentItem() {
    const newArrayData = arrayData.filter((_, i) => i !== arrayIndex);
    const newData = set(arrayPath, newArrayData, formData);
    setFormData(newData);
    return newArrayData;
  }

  function cancelAction() {
    // Nested array code doesn't change the URL and handles restoring data to
    // previous state; but needs to return a boolean if cancel action needs to
    // proceed
    const continueAction =
      typeof nestedArrayCallback === 'function' ? nestedArrayCallback() : true;

    if (continueAction) {
      let newArrayData = arrayData;
      let path;

      if (isAdd) {
        newArrayData = removeCurrentItem();
      }

      hideCancelConfirmationModal();

      if (isReview) {
        path = reviewRoute;
      } else if (isEdit) {
        path = summaryRoute;
      } else {
        // Required flow goes:
        // intro -> items -> summary -> items -> summary
        // so if we have no items, go back to intro
        // otherwise go to summary
        //
        // Optional flow goes:
        // summary -> items -> summary, so go back to summary
        path =
          required(formData) && introRoute && !newArrayData?.length
            ? introRoute
            : summaryRoute;
      }
      goToPath(formatPath(path));
    }
  }

  return (
    <div
      className={className || 'vads-u-margin-top--3 vads-u-margin-bottom--4'}
    >
      <VaButton
        text={getText(
          isEdit ? 'cancelEditButtonText' : 'cancelAddButtonText',
          currentItem,
          formData,
          arrayIndex,
        )}
        data-action="cancel"
        onClick={showCancelConfirmationModal}
        ref={cancelButtonRef}
        secondary
        uswds
      />
      <VaModal
        clickToClose
        status="warning"
        data-dd-privacy="mask"
        data-dd-action-name="Cancel Modal"
        modalTitle={getText(
          isEdit ? 'cancelEditTitle' : 'cancelAddTitle',
          currentItem,
          formData,
          arrayIndex,
        )}
        primaryButtonText={getText(
          isEdit ? 'cancelEditYes' : 'cancelAddYes',
          currentItem,
          formData,
          arrayIndex,
        )}
        secondaryButtonText={getText(
          isEdit ? 'cancelEditNo' : 'cancelAddNo',
          currentItem,
          formData,
          arrayIndex,
        )}
        onCloseEvent={hideCancelConfirmationModal}
        onPrimaryButtonClick={cancelAction}
        onSecondaryButtonClick={hideCancelConfirmationModal}
        visible={isModalVisible}
        uswds
      >
        <div
          className="dd-privacy-mask"
          data-dd-action-name="Cancel Confirmation"
        >
          {getText(modalDescriptionKey, currentItem, formData, arrayIndex)}
        </div>
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

ArrayBuilderCancelButton.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  getText: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  required: PropTypes.func.isRequired,
  reviewRoute: PropTypes.string.isRequired,
  setFormData: PropTypes.func.isRequired,
  summaryRoute: PropTypes.string.isRequired,
  className: PropTypes.string,
  introRoute: PropTypes.string,
  nestedArrayCallback: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArrayBuilderCancelButton);
