import {
  VaAlert,
  VaCheckboxGroup,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { scrollAndFocus } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { TOXIC_EXPOSURE_ALL_KEYS } from '../../constants';
import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
  makeTEConditionsUISchema,
} from '../../content/toxicExposure';
import {
  deletedToxicExposureAlertConfirmationContent,
  DeleteToxicExposureModalContent,
  getRemovingConditions,
  hasValidData,
  showToxicExposureDestructionModal,
} from '../../content/toxicExposureChoiceContent';
import { formTitle } from '../../utils';

/** @constant {string} Page title for toxic exposure choice page */
export const toxicExposureChoicePageTitle =
  'Option to claim conditions related to toxic exposure';

/**
 * Page component for selecting toxic exposure conditions
 * Displays checkboxes for conditions and handles modal for data deletion
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.goBack - Function to navigate to previous page
 * @param {Function} props.goForward - Function to navigate to next page
 * @param {Object} props.data - Form data object
 * @param {Function} props.setFormData - Function to update form data
 * @param {React.ReactElement} props.contentBeforeButtons - Content to render before navigation buttons
 * @param {React.ReactElement} props.contentAfterButtons - Content to render after navigation buttons
 * @param {boolean} props.onReviewPage - Whether component is displayed on review page
 * @param {Function} props.updatePage - Function to update the current page
 * @returns {React.ReactElement} Toxic exposure choice page component
 */
const ToxicExposureChoicePage = ({
  goBack,
  goForward,
  data,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  onReviewPage,
  updatePage,
}) => {
  const showDestructiveModal = useSelector(showToxicExposureDestructionModal);

  const [
    showDeleteToxicExposureModal,
    setShowDeleteToxicExposureModal,
  ] = useState(false);
  const [
    showDeletedToxicExposureConfirmation,
    setShowDeletedToxicExposureConfirmation,
  ] = useState(false);

  const deletedToxicExposureConfirmationRef = useRef(null);

  useEffect(
    () => {
      if (
        showDeletedToxicExposureConfirmation &&
        deletedToxicExposureConfirmationRef.current
      ) {
        deletedToxicExposureConfirmationRef.current.focus();
      }
    },
    [showDeletedToxicExposureConfirmation],
  );

  const modalRef = useRef(null);
  useEffect(
    () => {
      if (showDeleteToxicExposureModal && modalRef.current) {
        scrollAndFocus(modalRef.current);
      }
    },
    [showDeleteToxicExposureModal],
  );

  /**
   * Checks if any toxic exposure data has been entered
   * @returns {boolean} True if toxic exposure data exists
   */
  const hasToxicExposureData = useMemo(
    () => {
      const toxicExposure = data?.toxicExposure || {};
      return TOXIC_EXPOSURE_ALL_KEYS.some(key => {
        if (key === 'conditions') return false;
        return hasValidData(toxicExposure[key]);
      });
    },
    [data?.toxicExposure],
  );

  /**
   * Deletes all toxic exposure data except conditions field
   * @returns {void}
   */
  const deleteToxicExposureData = useCallback(
    () => {
      const deepClone = cloneDeep(data);

      if (deepClone.toxicExposure) {
        TOXIC_EXPOSURE_ALL_KEYS.forEach(key => {
          if (key !== 'conditions') {
            delete deepClone.toxicExposure[key];
          }
        });
        deepClone.toxicExposure.conditions =
          data.toxicExposure?.conditions?.none === true ? { none: true } : {};
      }

      setFormData(deepClone);
    },
    [data, setFormData],
  );

  /**
   * Get conditions that would be removed from toxic exposure
   * @returns {Array<string>} Array of condition names to be removed
   */
  const removingConditions = useMemo(
    () => {
      const conditions = data?.toxicExposure?.conditions || {};
      const newDisabilities = data?.newDisabilities || [];
      return getRemovingConditions(conditions, newDisabilities);
    },
    [data?.toxicExposure?.conditions, data?.newDisabilities],
  );

  /**
   * Determines whether to show the delete toxic exposure modal
   * @returns {boolean} True if modal should be shown
   */
  const shouldShowDeleteToxicExposureModal = useMemo(
    () => {
      return removingConditions.length > 0 && hasToxicExposureData;
    },
    [removingConditions, hasToxicExposureData],
  );

  /**
   * Handles checkbox selection changes for conditions
   * @param {Event} event - Change event from checkbox
   * @returns {void}
   */
  const handleSelectionChange = useCallback(
    event => {
      const { target } = event;
      const selection = target?.getAttribute('value');

      setFormData({
        ...data,
        toxicExposure: {
          ...data.toxicExposure,
          conditions: {
            ...data.toxicExposure?.conditions,
            [selection]: target.checked,
          },
        },
      });
    },
    [data, setFormData],
  );

  /**
   * Handles modal close event
   * @returns {void}
   */
  const handleCloseModal = useCallback(() => {
    setShowDeleteToxicExposureModal(false);
  }, []);

  /**
   * Handles form submission
   * @param {Event} event - Form submit event
   * @returns {void}
   */
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (showDestructiveModal && shouldShowDeleteToxicExposureModal) {
        setShowDeleteToxicExposureModal(true);
      } else {
        goForward(data);
      }
    },
    [showDestructiveModal, shouldShowDeleteToxicExposureModal, data, goForward],
  );

  /**
   * Handles confirmation of toxic exposure data deletion
   * @returns {void}
   */
  const handleConfirmDelete = useCallback(
    () => {
      if (showDestructiveModal) {
        deleteToxicExposureData();
      }
      setShowDeleteToxicExposureModal(false);
      setShowDeletedToxicExposureConfirmation(showDestructiveModal);

      if (!showDestructiveModal) {
        goForward(data);
      }
    },
    [showDestructiveModal, deleteToxicExposureData, data, goForward],
  );

  /**
   * Handles closing the deletion confirmation alert
   * @returns {void}
   */
  const handleCloseAlert = useCallback(() => {
    setShowDeletedToxicExposureConfirmation(false);
  }, []);

  /**
   * Handles navigation after confirmation alert
   * @returns {void}
   */
  const handleConfirmationLink = useCallback(
    () => {
      goForward(data);
    },
    [data, goForward],
  );

  /**
   * Handles page update from review page
   * @param {Event} event - Button click event
   * @returns {void}
   */
  const handleUpdatePage = useCallback(
    event => {
      event.preventDefault();

      if (showDestructiveModal && shouldShowDeleteToxicExposureModal) {
        setShowDeleteToxicExposureModal(true);
      } else {
        updatePage(event);
      }
    },
    [showDestructiveModal, shouldShowDeleteToxicExposureModal, updatePage],
  );

  /**
   * UI schema for conditions checkboxes
   * @returns {Object} UI schema configuration for checkbox group
   */
  const conditionsUI = useMemo(() => makeTEConditionsUISchema(data), [data]);

  /**
   * Dynamic button text based on number of conditions being removed
   * @returns {string} Button text with proper singular/plural form
   */
  const confirmButtonText = useMemo(
    () => {
      return removingConditions.length > 1
        ? 'Yes, remove conditions'
        : 'Yes, remove condition';
    },
    [removingConditions],
  );

  return (
    <div className="vads-u-margin-y--2">
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={deletedToxicExposureConfirmationRef}
          closeBtnAriaLabel="Deleted toxic exposure confirmation"
          closeable
          onCloseEvent={handleCloseAlert}
          fullWidth="false"
          slim
          status="warning"
          visible={showDeletedToxicExposureConfirmation}
          uswds
          tabIndex="-1"
        >
          {deletedToxicExposureAlertConfirmationContent}

          {!onReviewPage && (
            <p>
              <va-link
                text="Continue with your claim"
                onClick={handleConfirmationLink}
              />
            </p>
          )}
        </VaAlert>
      </div>

      <fieldset className="vads-u-margin-bottom--2">
        <legend id="root__title" className="schemaform-block-title">
          {formTitle(conditionsPageTitle)}
        </legend>

        <VaModal
          visible={showDeleteToxicExposureModal}
          onCloseEvent={handleCloseModal}
          status="warning"
        >
          <>
            <DeleteToxicExposureModalContent
              formData={data}
              modalRef={modalRef}
            />
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-top--3">
              {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="usa-button usa-button-primary vads-u-width--full vads-u-margin-bottom--2"
              >
                {confirmButtonText}
              </button>

              {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="usa-button-secondary vads-u-width--full vads-u-background-color--white"
              >
                No, return to claim
              </button>
            </div>
          </>
        </VaModal>

        <form onSubmit={handleSubmit}>
          <VaCheckboxGroup
            label={conditionsQuestion}
            onVaChange={handleSelectionChange}
            uswds
          >
            {conditionsDescription}

            {Object.keys(conditionsUI)
              .filter(k => conditionsUI[k] && conditionsUI[k]['ui:title'])
              .map(key => (
                <va-checkbox
                  key={key}
                  label={conditionsUI[key]['ui:title']}
                  value={key}
                  checked={data?.toxicExposure?.conditions?.[key] === true}
                  uswds
                />
              ))}
          </VaCheckboxGroup>

          {onReviewPage && (
            <va-button
              onClick={handleUpdatePage}
              label="Update toxic exposure choice"
              text="Update page"
            />
          )}

          {!onReviewPage && (
            <>
              {contentBeforeButtons}
              <FormNavButtons
                goBack={goBack}
                goForward={handleSubmit}
                submitToContinue
              />
              {contentAfterButtons}
            </>
          )}
        </form>
      </fieldset>
    </div>
  );
};

ToxicExposureChoicePage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default ToxicExposureChoicePage;
