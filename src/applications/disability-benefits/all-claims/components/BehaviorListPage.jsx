import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import {
  VaCheckboxGroup,
  VaModal,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollToFirstError, scrollAndFocus } from 'platform/utilities/ui';

import {
  behaviorListDescription,
  behaviorListNoneLabel,
  behaviorListAdditionalInformation,
  behaviorListPageTitle,
  orphanedBehaviorDetails,
  conflictingBehaviorErrorMessage,
  showConflictingAlert,
} from '../content/form0781/behaviorListPages';

import {
  ALL_BEHAVIOR_CHANGE_DESCRIPTIONS,
  BEHAVIOR_LIST_SECTION_SUBTITLES,
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
  BEHAVIOR_LIST_HINTS,
  ALL_BEHAVIOR_TYPES_WITH_SECTION,
} from '../constants';
import {
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../content/form0781';

const BehaviorListPage = ({
  goBack,
  goForward,
  data,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  onReviewPage,
  updatePage,
}) => {
  const [selectedWorkBehaviors, setSelectedWorkBehaviors] = useState(
    data?.workBehaviors,
    null,
  );
  const [selectedHealthBehaviors, setSelectedHealthBehaviors] = useState(
    data?.healthBehaviors,
    null,
  );
  const [selectedOtherBehaviors, setSelectedOtherBehaviors] = useState(
    data?.otherBehaviors,
    null,
  );
  const [selectedNoBehaviors, setSelectedNoBehaviors] = useState(
    data?.['view:noneCheckbox'],
    null,
  );

  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const alertRef = useRef(null);
  useEffect(() => {
    if (showAlert && alertRef.current) {
      alertRef.current.focus();
    }
  }, [showAlert]);
  const modalRef = useRef(null);
  useEffect(() => {
    if (showModal && modalRef.current) {
      const modalHeading = document.querySelector('h4');
      scrollAndFocus(modalHeading);
    }
  }, [showModal]);

  const checkErrors = updatedData => {
    const result = showConflictingAlert(updatedData);

    if (result === true) {
      setHasError(conflictingBehaviorErrorMessage);
    } else {
      setHasError(null);
    }
    return result;
  };

  const getSelectionsBySection = behaviorSection => {
    switch (behaviorSection) {
      case 'workBehaviors':
        return selectedWorkBehaviors;
      case 'healthBehaviors':
        return selectedHealthBehaviors;
      case 'otherBehaviors':
        return selectedOtherBehaviors;
      case 'view:noneCheckbox':
        return selectedNoBehaviors;
      default:
        return null;
    }
  };

  const handleUpdatedSelection = (behaviorSection, updatedData) => {
    switch (behaviorSection) {
      case 'workBehaviors':
        setSelectedWorkBehaviors(updatedData);
        break;
      case 'healthBehaviors':
        setSelectedHealthBehaviors(updatedData);
        break;
      case 'otherBehaviors':
        setSelectedOtherBehaviors(updatedData);
        break;
      case 'view:noneCheckbox':
        setSelectedNoBehaviors(updatedData);
        break;
      default:
        break;
    }
    const updatedFormData = {
      ...data,
      [behaviorSection]: updatedData,
    };
    setFormData(updatedFormData);
  };

  const DELETABLE_FORM_DATA_KEYS = Object.keys(
    ALL_BEHAVIOR_CHANGE_DESCRIPTIONS,
  );

  const deleteBehaviorDetails = () => {
    const deepClone = cloneDeep(data);
    const orphanedBehaviorsObject = orphanedBehaviorDetails(data);

    DELETABLE_FORM_DATA_KEYS.forEach(key => {
      if (orphanedBehaviorsObject[key]) {
        delete deepClone.behaviorsDetails[key];
      }
    });

    setFormData(deepClone);
  };

  const resetSelections = () => {
    const orphanedBehaviorTypes = Object.keys(orphanedBehaviorDetails(data));
    const behaviorSections = [
      'workBehaviors',
      'healthBehaviors',
      'otherBehaviors',
    ];

    behaviorSections.forEach(section => {
      const selectionsBySection = getSelectionsBySection(section);
      orphanedBehaviorTypes.forEach(behaviorType => {
        if (ALL_BEHAVIOR_TYPES_WITH_SECTION[behaviorType] === section) {
          selectionsBySection[behaviorType] = true;
        }
      });
      const updatedData = selectionsBySection;
      handleUpdatedSelection(section, updatedData);
    });
  };

  const handlers = {
    onSelectionChange: event => {
      const { target } = event;
      const selection = event.target?.getAttribute('value');
      const behaviorSection = ALL_BEHAVIOR_TYPES_WITH_SECTION[selection];
      const selectionsBySection = getSelectionsBySection(behaviorSection);

      if (target.checked) {
        const updatedData = {
          ...selectionsBySection,
          [selection]: true,
        };
        handleUpdatedSelection(behaviorSection, updatedData);
        if (checkErrors(updatedData)) {
          scrollToFirstError({ focusOnAlertRole: false });
        }
      } else if (!target.checked) {
        const updatedData = {
          ...selectionsBySection,
          [selection]: false,
        };
        handleUpdatedSelection(behaviorSection, updatedData);
        if (checkErrors(updatedData)) {
          scrollToFirstError({ focusOnAlertRole: false });
        }
      }
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors(data)) {
        scrollToFirstError({ focusOnAlertRole: false });
      } else if (
        data?.behaviorsDetails &&
        Object.keys(orphanedBehaviorDetails(data)).length > 0
      ) {
        setShowModal(true);
      } else {
        goForward(data);
      }
    },
    onCloseModal: () => {
      resetSelections();
      const continueButton = document.querySelector("button[type='submit']");
      scrollAndFocus(continueButton);
      setShowModal(false);
      setShowAlert(false);
    },
    onConfirmDeleteBehaviorDetails: () => {
      deleteBehaviorDetails();
      setShowModal(false);
      setShowAlert(true);
    },
    onCancelDeleteBehaviorDetails: () => {
      handlers.onCloseModal();
    },
    onCancelAlert: () => {
      setShowAlert(false);
      if (hasError) {
        scrollToFirstError({ focusOnAlertRole: false });
      }
    },
    onUpdatePage: event => {
      event.preventDefault();
      if (checkErrors(data)) {
        scrollToFirstError({ focusOnAlertRole: false });
      } else if (
        data?.behaviorsDetails &&
        Object.keys(orphanedBehaviorDetails(data)).length > 0
      ) {
        setShowModal(true);
      } else {
        updatePage(event);
      }
    },
  };

  const modalContent = formData => {
    const orphanedDetails = orphanedBehaviorDetails(formData);
    const describedBehaviorsCount = Object.keys(orphanedDetails).length;
    const behaviorDescriptions = Object.values(orphanedDetails);
    const firstThreeBehaviors = Object.values(orphanedDetails).slice(0, 3);

    const displayRemainingBehaviors = () => {
      if (describedBehaviorsCount === 4) {
        return (
          <li key={4}>
            <b>{behaviorDescriptions[3]}</b>
          </li>
        );
      }

      return (
        <li key={4}>
          And, <b>{describedBehaviorsCount - 3} other behavioral changes</b>
        </li>
      );
    };

    return (
      <>
        <h4
          ref={modalRef}
          className="vads-u-font-size--h4 vads-u-color--base vads-u-margin--0"
        >
          Remove behavioral changes?
        </h4>
        <p>
          <strong>What to know:</strong> If you remove these items, we’ll delete
          information you provided about:
        </p>
        <ul>
          {firstThreeBehaviors.map((behaviorDescription, i) => (
            <li key={i}>
              <b>{behaviorDescription}</b>
            </li>
          ))}

          {behaviorDescriptions.length > 3 && displayRemainingBehaviors()}
        </ul>
      </>
    );
  };

  const accordionsAndNavButtons = !onReviewPage ? (
    <>
      {behaviorListAdditionalInformation}
      <>{mentalHealthSupportAlert()}</>
      {contentBeforeButtons}
      <FormNavButtons
        goBack={goBack}
        goForward={handlers.onSubmit}
        submitToContinue
      />
      {contentAfterButtons}
    </>
  ) : (
    <va-button
      text="Update page"
      onClick={handlers.onUpdatePage}
      label="Update page"
      class="usa-button-primary"
    />
  );

  return (
    <div className="vads-u-margin-y--2">
      <>
        <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-margin--0">
          {form0781HeadingTag}
        </h3>
        <h3 className="vads-u-font-size--h3 vads-u-color--base vads-u-margin--0">
          {behaviorListPageTitle}
        </h3>
      </>
      {behaviorListDescription}

      {data && data.behaviorsDetails && (
        <VaModal
          visible={showModal}
          onPrimaryButtonClick={handlers.onConfirmDeleteBehaviorDetails}
          onSecondaryButtonClick={handlers.onCancelDeleteBehaviorDetails}
          onCloseEvent={handlers.onCancelDeleteBehaviorDetails}
          primaryButtonText="Yes, remove behavioral changes"
          secondaryButtonText="No, return to claim"
          status="warning"
        >
          {modalContent(data)}
        </VaModal>
      )}

      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={alertRef}
          closeBtnAriaLabel="Close notification"
          closeable
          onCloseEvent={handlers.onCancelAlert}
          fullWidth="false"
          slim
          status="success"
          visible={showAlert}
          uswds
          tabIndex="-1"
        >
          {!onReviewPage ? (
            <>
              <p className="vads-u-margin-y--0">
                We’ve removed optional descriptions about your behavioral
                changes.
              </p>
              <p>
                <va-link
                  text="Continue with your claim"
                  onClick={handlers.onSubmit}
                />
              </p>
            </>
          ) : (
            <>
              <p className="vads-u-margin-y--0">
                We’ve removed optional descriptions about your behavioral
                changes.
              </p>
            </>
          )}
        </VaAlert>
      </div>

      <form onSubmit={handlers.onSubmit}>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.work}
          label-header-level={4}
          hint={BEHAVIOR_LIST_HINTS.work}
          onVaChange={handlers.onSelectionChange}
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_WORK).map(
            ([behaviorType, description]) => (
              <va-checkbox
                key={behaviorType}
                label={description}
                value={behaviorType}
                checked={
                  !!(
                    data?.workBehaviors &&
                    data?.workBehaviors[behaviorType] === true
                  )
                }
                uswds
              />
            ),
          )}
        </VaCheckboxGroup>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.health}
          label-header-level={4}
          hint={BEHAVIOR_LIST_HINTS.health}
          onVaChange={handlers.onSelectionChange}
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_HEALTH).map(
            ([behaviorType, description]) => (
              <va-checkbox
                key={behaviorType}
                label={description}
                value={behaviorType}
                checked={
                  !!(
                    data?.healthBehaviors &&
                    data?.healthBehaviors[behaviorType] === true
                  )
                }
                uswds
              />
            ),
          )}
        </VaCheckboxGroup>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.other}
          label-header-level={4}
          form-heading-level={4}
          hint={BEHAVIOR_LIST_HINTS.other}
          onVaChange={handlers.onSelectionChange}
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_OTHER).map(
            ([behaviorType, description]) => (
              <va-checkbox
                key={behaviorType}
                label={description}
                value={behaviorType}
                checked={
                  !!(
                    data?.otherBehaviors &&
                    data?.otherBehaviors[behaviorType] === true
                  )
                }
                uswds
              />
            ),
          )}
        </VaCheckboxGroup>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.none}
          label-header-level={4}
          hint={BEHAVIOR_LIST_HINTS.none}
          onVaChange={handlers.onSelectionChange}
          error={hasError}
          uswds
        >
          <va-checkbox
            key="none"
            label={behaviorListNoneLabel}
            value="view:noBehaviorChanges"
            checked={
              !!(
                data?.['view:noneCheckbox'] &&
                data['view:noneCheckbox']['view:noBehaviorChanges']
              )
            }
            uswds
          />
        </VaCheckboxGroup>
        {accordionsAndNavButtons}
      </form>
    </div>
  );
};

BehaviorListPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    workBehaviors: PropTypes.object,
    healthBehaviors: PropTypes.object,
    otherBehaviors: PropTypes.object,
    'view:noneCheckbox': PropTypes.object,
    behaviorsDetails: PropTypes.object,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
export default BehaviorListPage;
