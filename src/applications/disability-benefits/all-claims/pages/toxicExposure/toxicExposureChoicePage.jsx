import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  VaCheckboxGroup,
  VaModal,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollAndFocus, scrollToFirstError } from 'platform/utilities/ui';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
  makeTEConditionsUISchema,
} from '../../content/toxicExposure';
import { formTitle, showToxicExposureDestructionModal } from '../../utils';
import {
  deletedToxicExposureAlertConfirmationContent,
  deleteToxicExposureModalContent,
  deleteToxicExposureModalDescription,
  deleteToxicExposureModalTitle,
} from '../../content/toxicExposureChoiceContent';

export const toxicExposureChoicePageTitle =
  'Option to claim conditions related to toxic exposure';

/**
 * List of all toxic exposure related keys that need to be deleted
 * when user opts out of toxic exposure claims.
 * @constant {string[]}
 */
export const toxicExposureKeys = [
  'conditions',
  'gulfWar1990',
  'gulfWar1990Details',
  'gulfWar2001',
  'gulfWar2001Details',
  'herbicide',
  'herbicideDetails',
  'herbicideOtherLocations',
  'additionalExposures',
  'additionalExposuresDetails',
  'specifyOtherExposures',
];

export const sectionsOfToxicExposure = [
  'Toxic exposure conditions',
  'Gulf War service locations and dates (1990 and 2001)',
  'Agent Orange exposure locations and dates',
  'Other toxic exposure details and dates',
];

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
        const modalHeading = document.querySelector('h4');
        scrollAndFocus(modalHeading);
      }
    },
    [showDeleteToxicExposureModal],
  );

  const hasToxicExposureData = () => {
    return toxicExposureKeys.some(key => {
      if (key === 'conditions') return false; // Skip conditions as it's the trigger
      if (!(key in (data?.toxicExposure || {}))) return false;

      const value = data.toxicExposure[key];
      switch (typeof value) {
        case 'boolean':
          return value === true;
        case 'string':
          return value.trim() !== '';
        case 'number':
          return true;
        case 'object':
          if (value === null) return false;
          if (Array.isArray(value)) return value.length > 0;
          return Object.values(value).some(nestedValue => {
            if (typeof nestedValue === 'boolean') return nestedValue === true;
            if (typeof nestedValue === 'string')
              return nestedValue.trim() !== '';
            return !!nestedValue;
          });
        default:
          return false;
      }
    });
  };

  const deleteToxicExposureData = () => {
    const deepClone = cloneDeep(data);

    if (deepClone.toxicExposure) {
      toxicExposureKeys.forEach(key => {
        if (key !== 'conditions') {
          delete deepClone.toxicExposure[key];
        }
      });
      // Keep only the 'none' condition selected
      deepClone.toxicExposure.conditions = { none: true };
    }

    setFormData(deepClone);
  };

  // If the user opts to deselect "none" and they are asked in the modal to delete their toxic exposure data,
  // they can close the modal or click the Cancel button. Doing so should revert the "none" checkbox back to unchecked
  const revertNoneConditionSelection = () => {
    const deepClone = cloneDeep(data);

    const toxicExposureSelections = deepClone.toxicExposure?.conditions || {};
    // Deselect "none" checkbox
    toxicExposureSelections.none = false;

    if (!deepClone.toxicExposure) {
      deepClone.toxicExposure = {};
    }
    deepClone.toxicExposure.conditions = toxicExposureSelections;

    setFormData(deepClone);
  };

  const shouldShowDeleteToxicExposureModal = () => {
    return (
      data.toxicExposure?.conditions?.none === true && hasToxicExposureData()
    );
  };

  const handlers = {
    onSelectionChange: event => {
      const { target } = event;
      const selection = event.target?.getAttribute('value');

      const formData = {
        ...data,
        toxicExposure: {
          ...data.toxicExposure,
          conditions: {
            ...data.toxicExposure?.conditions,
            [selection]: target.checked,
          },
        },
      };
      setFormData(formData);
    },
    onSubmit: event => {
      event.preventDefault();

      // Check if at least one condition is selected
      const conditions = data.toxicExposure?.conditions || {};
      const hasSelection = Object.values(conditions).some(
        value => value === true,
      );

      if (!hasSelection) {
        scrollToFirstError({ focusOnAlertRole: true });
        return;
      }

      if (showDestructiveModal && shouldShowDeleteToxicExposureModal()) {
        setShowDeleteToxicExposureModal(true);
      } else {
        goForward(data);
      }
    },
    onCloseModal: () => {
      revertNoneConditionSelection();
      setShowDeleteToxicExposureModal(false);
    },
    onConfirmDeleteToxicExposureData: () => {
      if (showDestructiveModal) {
        deleteToxicExposureData();
      }
      setShowDeleteToxicExposureModal(false);
      setShowDeletedToxicExposureConfirmation(showDestructiveModal);

      if (!showDestructiveModal) {
        goForward(data);
      }
    },
    onCancelDeleteToxicExposureData: () => {
      handlers.onCloseModal();
    },
    onCloseDeletedToxicExposureAlert: () => {
      setShowDeletedToxicExposureConfirmation(false);
    },
    onClickConfirmationLink: () => {
      goForward(data);
    },
    onUpdatePage: event => {
      event.preventDefault();

      // Check if at least one condition is selected
      const conditions = data.toxicExposure?.conditions || {};
      const hasSelection = Object.values(conditions).some(
        value => value === true,
      );

      if (!hasSelection) {
        scrollToFirstError({ focusOnAlertRole: true });
        return;
      }

      if (showDestructiveModal && shouldShowDeleteToxicExposureModal()) {
        setShowDeleteToxicExposureModal(true);
      } else {
        updatePage(event);
      }
    },
  };

  // Get the UI schema for conditions based on formData
  const conditionsUI = makeTEConditionsUISchema(data);

  return (
    <div className="vads-u-margin-y--2">
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={deletedToxicExposureConfirmationRef}
          closeBtnAriaLabel="Deleted toxic exposure confirmation"
          closeable
          onCloseEvent={handlers.onCloseDeletedToxicExposureAlert}
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
                onClick={handlers.onClickConfirmationLink}
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
          onPrimaryButtonClick={handlers.onConfirmDeleteToxicExposureData}
          onSecondaryButtonClick={handlers.onCancelDeleteToxicExposureData}
          onCloseEvent={handlers.onCancelDeleteToxicExposureData}
          primaryButtonText="Yes, remove toxic exposure information"
          secondaryButtonText="No, return to claim"
          status="warning"
        >
          <>
            <h4
              ref={modalRef}
              className="vads-u-font-size--h4 vads-u-color--base vads-u-margin--0"
            >
              {deleteToxicExposureModalTitle}
            </h4>
            <p>{deleteToxicExposureModalDescription}</p>
            {deleteToxicExposureModalContent}
          </>
        </VaModal>

        <form onSubmit={handlers.onSubmit}>
          <VaCheckboxGroup
            label={conditionsQuestion}
            label-header-level={4}
            onVaChange={handlers.onSelectionChange}
            required
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
              onClick={handlers.onUpdatePage}
              label="Update toxic exposure choice"
              text="Update page"
            />
          )}

          {!onReviewPage && (
            <>
              {contentBeforeButtons}
              <FormNavButtons
                goBack={goBack}
                goForward={handlers.onSubmit}
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
