import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  VaCheckboxGroup,
  VaDate,
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import { focusElement } from 'platform/utilities/ui';

import { EVIDENCE_VA_PATH } from '../constants';

import { content } from '../content/evidenceVaRecords';
import { getSelected, getIssueName } from '../utils/helpers';

import { checkValidations } from '../validations/issues';
import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
} from '../validations/evidence';

const VA_PATH = `/${EVIDENCE_VA_PATH}`;
// const REVIEW_AND_SUBMIT = '/review-and-submit';
// Directions to go after modal shows
const NAV_PATHS = { add: 'add', back: 'back', forward: 'forward' };
const defaultData = {
  locationAndName: '',
  issues: [],
  evidenceDates: { from: '', to: '' },
};
const defaultState = {
  dirty: {
    input: false,
    issues: false,
    from: false,
    to: false,
  },
  modal: {
    show: false,
    direction: '',
  },
  submitted: false,
};

const EvidenceVaRecords = ({
  data,
  onReviewPage,
  goBack,
  goForward,
  goToPath,
  setFormData,
  testingIndex,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { locations = [] } = data || {};

  const getIndex = () => {
    // get index from url '/va-medical-records?index={index}' or testingIndex
    const searchIndex = new URLSearchParams(window.location.search);
    let index = parseInt(searchIndex.get('index') || testingIndex || '0', 10);
    if (Number.isNaN(index) || index > locations.length) {
      index = locations.length;
    }
    return index;
  };

  // *** state ***
  const [currentIndex, setCurrentIndex] = useState(getIndex());
  const [currentData, setCurrentData] = useState(
    locations?.[currentIndex] || defaultData,
  );

  const [currentState, setCurrentState] = useState(defaultState);

  useEffect(
    () => {
      setCurrentData(locations?.[currentIndex] || defaultData);
      setCurrentState(defaultState);
      focusElement('va-text-input');
    },
    // don't include locations or we clear state & move focus every time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex],
  );

  // *** validations ***
  const showInputError = checkValidations([validateVaLocation], currentData);
  const showIssuesError = checkValidations([validateVaIssues], currentData);
  const showDateStartError = checkValidations(
    [validateVaFromDate],
    currentData,
  );
  const showDateEndError = checkValidations([validateVaToDate], currentData);

  const updateCurrentLocation = ({
    newLocationAndName = currentData.locationAndName,
    newIssues = currentData.issues,
    newDateStart = currentData.evidenceDates.from,
    newDateEnd = currentData.evidenceDates.to,
    remove = false,
  } = {}) => {
    const newData = {
      locationAndName: newLocationAndName,
      issues: newIssues,
      evidenceDates: {
        from: newDateStart,
        to: newDateEnd,
      },
    };

    const newLocations = [...locations];
    if (remove) {
      newLocations.splice(currentIndex, 1);
    } else {
      newLocations[currentIndex] = newData;
    }
    setCurrentData(newData);
    setFormData({ ...data, locations: newLocations });
    return newLocations;
  };

  const updateState = ({
    dirty = currentState.dirty,
    modal = currentState.modal,
    submitted = currentState.submitted,
  } = {}) => {
    setCurrentState({ dirty, modal, submitted });
  };

  const goToPageIndex = index => {
    setCurrentIndex(index);
    goToPath(`${VA_PATH}?index=${index}`);
  };

  const hasErrors = () =>
    showInputError.length ||
    showIssuesError.length ||
    showDateStartError.length ||
    showDateEndError.length;

  const handlers = {
    onInputChange: event => {
      updateCurrentLocation({ newLocationAndName: event.target.value });
    },
    onInputBlur: () => {
      // setInputDirty(true);
      updateState({ dirty: { ...currentState.dirty, input: true } });
    },
    onIssueChange: event => {
      // setIssuesDirty(true);
      updateState({ dirty: { ...currentState.dirty, issues: true } });
      const { target } = event;
      const newIssues = new Set(currentData?.issues || []);
      if (target.checked) {
        newIssues.add(target.label);
      } else {
        newIssues.delete(target.label);
      }
      updateCurrentLocation({ newIssues: [...newIssues] });
    },
    onDateStartChange: event => {
      updateCurrentLocation({ newDateStart: event.target.value });
    },
    onDateStartBlur: () => {
      // this is currently called for each of the 3 elements
      updateState({ dirty: { ...currentState.dirty, from: true } });
    },
    onDateEndChange: event => {
      updateCurrentLocation({ newDateEnd: event.target.value });
    },
    onDateEndBlur: () => {
      // this is currently called for each of the 3 elements
      updateState({ dirty: { ...currentState.dirty, to: true } });
    },
    onAddAnother: event => {
      event.preventDefault();
      updateState({ submitted: true });
      if (hasErrors()) {
        updateState({ modal: { show: true, direction: NAV_PATHS.add } });
        return;
      }
      // clear state and start over for new entry
      goToPageIndex(locations.length); // add to end
    },
    onGoForward: event => {
      event.preventDefault();
      if (hasErrors()) {
        // focus on first error
        updateState({ modal: { show: true, direction: NAV_PATHS.forward } });
        return;
      }
      if (currentIndex < locations.length - 1) {
        goToPageIndex(currentIndex + 1);
      } else {
        goForward(data);
      }
    },
    onGoBack: () => {
      if (hasErrors()) {
        // focus on first error
        updateState({ modal: { show: true, direction: NAV_PATHS.back } });
        return;
      }
      if (currentIndex > 0) {
        goToPageIndex(currentIndex - 1);
      } else {
        goBack();
      }
    },
    onModalYes: () => {
      // do nothing for forward & add
      const { direction } = currentState.modal;
      updateState({ modal: { show: false, direction: '' } });
      if (direction === NAV_PATHS.back) {
        goBack();
      }
    },
    onModalNo: () => {
      // clear current data
      const { direction } = currentState.modal;
      setCurrentData(defaultData);
      // Using returned locations value to block going forward if the locations
      // array has a zero length - the `locations` value is not updated in time
      const updatedLocations = updateCurrentLocation({ remove: true });
      updateState({ modal: { show: false, direction: '' } });
      if (direction === NAV_PATHS.back) {
        if (currentIndex - 1 > 0) {
          goToPageIndex(currentIndex - 1);
        } else {
          goBack();
        }
      } else if (
        direction === NAV_PATHS.forward &&
        updatedLocations.length > 0
      ) {
        goForward(data);
      } else {
        // restart this current page with empty fields
        setCurrentData(defaultData);
        setCurrentState(defaultState);
        goToPageIndex(currentIndex);
      }
    },
  };

  const navButtons = onReviewPage ? (
    <button type="submit">Review update button</button>
  ) : (
    <>
      {contentBeforeButtons}
      {/* <FormNavButtons goBack={goBack} submitToContinue /> */}
      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
        <div className="small-6 medium-5 columns">
          {goBack && (
            <ProgressButton
              onButtonClick={handlers.onGoBack}
              buttonText="Back"
              buttonClass="usa-button-secondary"
              beforeText="«"
              // This button is described by the current form's header ID
              ariaDescribedBy="nav-form-header"
            />
          )}
        </div>
        <div className="small-6 medium-5 end columns">
          <ProgressButton
            onButtonClick={handlers.onGoForward}
            buttonText="Continue"
            buttonClass="usa-button-primary"
            afterText="»"
            // This button is described by the current form's header ID
            ariaDescribedBy="nav-form-header"
          />
        </div>
      </div>
      {contentAfterButtons}
    </>
  );

  return (
    <form onSubmit={handlers.onGoForward}>
      <fieldset>
        <legend
          id="decision-date-description"
          className="vads-u-font-family--serif"
          name="addIssue"
        >
          <h3 className="vads-u-margin--0">{content.title}</h3>
        </legend>
        <p>{content.description}</p>
        <VaModal
          status="info"
          modalTitle={content.modalTitle}
          primaryButtonText={content.modalYes}
          secondaryButtonText={content.modalNo}
          onCloseEvent={handlers.onModalYes}
          onPrimaryButtonClick={handlers.onModalYes}
          onSecondaryButtonClick={handlers.onModalNo}
          visible={currentState.modal.show}
        >
          <p>{content.modalDescription}</p>
        </VaModal>
        <VaTextInput
          id="add-sc-issue"
          name="add-sc-issue"
          type="text"
          label={content.locationAndName}
          required
          value={currentData.locationAndName}
          onInput={handlers.onInputChange}
          onBlur={handlers.onInputBlur}
          error={
            ((currentState.submitted || currentState.dirty.input) &&
              showInputError[0]) ||
            null
          }
        />
        <br />
        <VaCheckboxGroup
          label={content.conditions}
          error={
            ((currentState.submitted || currentState.dirty.issues) &&
              showIssuesError[0]) ||
            null
          }
          onVaChange={handlers.onIssueChange}
          required
        >
          {getSelected(data).map((issue, index) => {
            const name = getIssueName(issue);
            return (
              <va-checkbox
                key={index}
                name="conditions"
                label={name}
                value={name}
                checked={(currentData?.issues || []).includes(name)}
              />
            );
          })}
        </VaCheckboxGroup>

        <VaDate
          name="location-date"
          label={content.dateStart}
          required
          onDateChange={handlers.onDateStartChange}
          onDateBlur={handlers.onDateStartBlur}
          value={currentData.evidenceDates?.from}
          error={
            ((currentState.submitted || currentState.dirty.from) &&
              showDateStartError[0]) ||
            null
          }
        />
        <VaDate
          name="location-date"
          label={content.dateEnd}
          required
          onDateChange={handlers.onDateEndChange}
          onDateBlur={handlers.onDateEndBlur}
          value={currentData.evidenceDates?.to}
          error={
            ((currentState.submitted || currentState.dirty.to) &&
              showDateEndError[0]) ||
            null
          }
        />
        <div className="vads-u-margin-top--2">
          <Link
            to={`${VA_PATH}?index=${currentIndex + 1}`}
            onClick={handlers.onAddAnother}
            className="vads-c-action-link--green"
          >
            Add another location
          </Link>
        </div>

        <div className="vads-u-margin-top--4">{navButtons}</div>
      </fieldset>
    </form>
  );
};

EvidenceVaRecords.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({}),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  onReviewPage: PropTypes.bool,
};

export default EvidenceVaRecords;
