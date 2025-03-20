import React, { useState } from 'react';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

import {
  VaCheckboxGroup,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  behaviorListDescription,
  behaviorListNoneLabel,
  behaviorListAdditionalInformation,
  behaviorListPageTitle,
  validateBehaviorSelections,
  behaviorListValidationError,
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

const BehaviorListPage = ({ goBack, goForward, data, setFormData }) => {
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
  console.log('selectedWorkBehaviors state', selectedWorkBehaviors);
  console.log('selected healthBehaviors state', selectedHealthBehaviors);
  console.log('selected otherBehaviors state', selectedOtherBehaviors);

  const getSelectionsBySection = behaviorSection => {
    switch (behaviorSection) {
      case 'workBehaviors':
        return selectedWorkBehaviors;
      case 'healthBehaviors':
        return selectedHealthBehaviors;
      case 'otherBehaviors':
        return selectedOtherBehaviors;
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
      default:
        break;
    }
    setFormData({
      ...data,
      [behaviorSection]: updatedData,
    });
  };

  const handlers = {
    onSelectionChange: event => {
      console.log('onSelectionChange event', event);

      const { target } = event;
      // TODO - get the name of the checkbox group section
      const behaviorSection = target.name;

      const selection = event.target?.getAttribute('value');

      const selectionsBySection = getSelectionsBySection(behaviorSection);
      console.log('selectionsBySection', selectionsBySection);

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

      // checkErrors(formData);
    },
    onSubmit: event => {
      event.preventDefault();
      goForward(data);
      // if (checkErrors()) {
      //   scrollToFirstError({ focusOnAlertRole: true });
      //   // hasSelectedBehaviors indicates they checked behavior changes boxes
      //   // on the next page, behaviorListPage
      // } else if (optIn === 'false' && hasSelectedBehaviors(data)) {
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
            // onBlur={handlers.onBlur}
            // error={showError('issues')}
            // required
            uswds
          >
            {Object.entries(BEHAVIOR_CHANGES_WORK).map(
              ([behaviorType, description]) => (
                <va-checkbox
                  key={behaviorType}
                  name="workBehaviors" //TODO - is this needed?
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
            // onBlur={handlers.onBlur}
            // error={showError('issues')}
            // required
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
            // onBlur={handlers.onBlur}
            // error={showError('issues')}
            // required
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
            name="noBehaviors"
            hint={BEHAVIOR_LIST_HINTS.none}
            onVaChange={handlers.onSelectionChange}
            // onBlur={handlers.onBlur}
            // error={showError('issues')}
            // required
            uswds
          >
            <va-checkbox
              key="TODOkey"
              name="noBehaviorChanges"
              // class="dd-privacy-hidden"
              // data-dd-action-name="issue name"
              label={behaviorListNoneLabel}
              value="none"
              checked={false}
              // TODO checked={(formData?.workBehaviors || []).includes(behavior)}
              uswds
            />
          </VaCheckboxGroup>

          {behaviorListAdditionalInformation}
          <>{mentalHealthSupportAlert()}</>
        </div>
      </form>
      <FormNavButtons goBack={goBack} goForward={handlers.onSubmit} />
    </>
  );
};
export default BehaviorListPage;
