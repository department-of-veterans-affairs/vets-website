import React, { useState, useRef } from 'react';
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
  validateBehaviorSelections,
  conflictingBehaviorErrorMessage,
  showConflictingAlert,
} from '../content/form0781/behaviorListPages';

import {
  BEHAVIOR_LIST_SECTION_SUBTITLES,
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
  BEHAVIOR_LIST_HINTS,
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

  // const [hasError, setHasError] = useState(showConflictingAlert(data), null);

  console.log('STATE', selectedNoBehaviors)

  console.log('Data check', data['view:noneCheckbox']);
  console.log('Data check', data['view:noneCheckbox']["view:noBehaviorChanges"]);
  // const checkErrors = () => {
  //   console.log('checkErrors-FORMDATA-', data);
  //   const result = showConflictingAlert(data);
  //   console.log('checkErrors-show conflict---', result);

  //   setHasError(result);
  //   const errors = { errorMessages: [] };
  //   errors.addError = message => errors.errorMessages.push(message);
  //   return result;
  // };

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
    console.log("HANDLE, updatedData", updatedData)
    console.log("HANDLE, behaviorSection", behaviorSection)
    if (behaviorSection === 'view:noneCheckbox') {
      console.log("handle none section", behaviorSection, updatedData)
      setSelectedNoBehaviors(updatedData);
      setFormData({
        ...data,
        'view:noneCheckbox': updatedData,
      });
    } else {
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
        // case 'view:noneCheckbox':
        //   console.log("handle none section", behaviorSection, updatedData)
        //   setSelectedNoBehaviors({ [behaviorSection]: updatedData });
        //   console.log("handle none section state", selectedNoBehaviors)
        //   break;
        default:
          break;
      }
      setFormData({
        ...data,
        [behaviorSection]: updatedData,
      });
    }
    // checkErrors(); //NOT SYNCHRONOUS
  };

  const handlers = {
    onSelectionChange: event => {
      const { target } = event;
      const selection = event.target?.getAttribute('value');
      const behaviorSection = target.name;
      console.log("onSelectionChange, section", behaviorSection)
      const selectionsBySection = getSelectionsBySection(behaviorSection);

      if (target.checked) {
        const updatedData = {
          ...selectionsBySection,
          [selection]: true,
        };
        handleUpdatedSelection(behaviorSection, updatedData);
      } else if (!target.checked) {
        const updatedData = {
          ...selectionsBySection,
          [selection]: false,
        };
        handleUpdatedSelection(behaviorSection, updatedData);
      }
    },
    onSubmit: event => {
      event.preventDefault();
      goForward(data);
      // if (checkErrors()) {
      //   scrollToFirstError({ focusOnAlertRole: true });
      // }
      // else if (optIn === 'false' && hasSelectedBehaviors(data)) {
      //   setShowModal(true);
      // } else if (optIn) {
      //   goForward(data);
      // }
    },
  };

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
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
                  // class="dd-privacy-hidden"
                  // data-dd-action-name="issue name"
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
                  // class="dd-privacy-hidden"
                  // data-dd-action-name="issue name"
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
            // error={hasError}
            // error={hasError ? conflictingBehaviorErrorMessage : ''}
            uswds
          >
            <va-checkbox
              key="none"
              name="view:noneCheckbox"
              // class="dd-privacy-hidden"
              // data-dd-action-name="issue name"
              label={behaviorListNoneLabel}
              value="view:noBehaviorChanges"
              checked={
                !!(
                  data?.['view:noneCheckbox'] &&
                  data['view:noneCheckbox']["view:noBehaviorChanges"]
                )
              }
              uswds
            />
          </VaCheckboxGroup>

          {behaviorListAdditionalInformation}
          <>{mentalHealthSupportAlert()}</>
        </div>
      </form>
      <>{contentBeforeButtons}</>
      <FormNavButtons
        goBack={goBack}
        goForward={handlers.onSubmit}
        submitToContinue //NB suggestion
      />
      <>{contentAfterButtons}</>
    </>
  );
};
export default BehaviorListPage;