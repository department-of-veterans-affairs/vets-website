import React, { useState } from 'react';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

import {
  VaCheckboxGroup,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollToFirstError } from 'platform/utilities/ui';

import {
  behaviorListDescription,
  behaviorListNoneLabel,
  behaviorListAdditionalInformation,
  behaviorListPageTitle,
  modalContent,
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

  const [showModal, setShowModal] = useState(false);
  const [hasError, setHasError] = useState(null);

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
    // TODO - double check how everyone else is doing this, might be a lodash option
    const deepClone = cloneDeep(data);
    const orphanedBehaviorsObject = orphanedBehaviorDetails(data);

    DELETABLE_FORM_DATA_KEYS.forEach(key => {
      if (orphanedBehaviorsObject[key]) {
        delete deepClone.behaviorsDetails[key];
      }
    });

    setFormData(deepClone);
  };

  // const resetSelections = () => {
  // };

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
          scrollToFirstError({ focusOnAlertRole: true });
        }
      } else if (!target.checked) {
        const updatedData = {
          ...selectionsBySection,
          [selection]: false,
        };
        handleUpdatedSelection(behaviorSection, updatedData);
        if (checkErrors(updatedData)) {
          scrollToFirstError({ focusOnAlertRole: true });
        }
      }
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors(data)) {
        scrollToFirstError({ focusOnAlertRole: true });
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
      console.log('onCloseModal---');
      // resetSelections();
      setShowModal(false);
    },
    onConfirmDeleteBehaviorDetails: () => {
      deleteBehaviorDetails();
      handlers.onCloseModal();
      goForward(data);
    },
    onCancelDeleteBehaviorDetails: () => {
      handlers.onCloseModal();
    },
  };

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

      {data &&
        data.behaviorsDetails && (
          <VaModal
            // modalTitle="Remove behavioral changes?" //TODO - check styling. Here its an H2, vs content page html H4
            visible={showModal}
            onPrimaryButtonClick={handlers.onConfirmDeleteBehaviorDetails}
            onSecondaryButtonClick={handlers.onCancelDeleteBehaviorDetails}
            onCloseEvent={handlers.onCancelDeleteBehaviorDetails}
            primaryButtonText="Yes, remove these items"
            secondaryButtonText="No, keep these items"
            status="warning"
          >
            {modalContent(data)}
          </VaModal>
        )}

      <form onSubmit={handlers.onSubmit}>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.work}
          label-header-level={4}
          name="workBehaviors"
          hint={BEHAVIOR_LIST_HINTS.work}
          onVaChange={handlers.onSelectionChange}
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_WORK).map(
            ([behaviorType, description]) => (
              <va-checkbox
                key={behaviorType}
                name="workBehaviors"
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
          name="healthBehaviors"
          hint={BEHAVIOR_LIST_HINTS.health}
          onVaChange={handlers.onSelectionChange}
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_HEALTH).map(
            ([behaviorType, description]) => (
              <va-checkbox
                key={behaviorType}
                name="healthBehaviors"
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
          name="otherBehaviors"
          form-heading-level={4}
          hint={BEHAVIOR_LIST_HINTS.other}
          onVaChange={handlers.onSelectionChange}
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_OTHER).map(
            ([behaviorType, description]) => (
              <va-checkbox
                key={behaviorType}
                name="otherBehaviors"
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
          name="view:noneCheckbox"
          hint={BEHAVIOR_LIST_HINTS.none}
          onVaChange={handlers.onSelectionChange}
          error={hasError}
          uswds
        >
          <va-checkbox
            key="none"
            name="view:noneCheckbox"
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

        {behaviorListAdditionalInformation}
        <>{mentalHealthSupportAlert()}</>
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={handlers.onSubmit}
          submitToContinue
        />
        {contentAfterButtons}
      </form>
    </div>
  );
};
export default BehaviorListPage;
