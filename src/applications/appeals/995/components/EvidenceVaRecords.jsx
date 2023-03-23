import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  VaCheckboxGroup,
  VaMemorableDate,
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import environment from 'platform/utilities/environment';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import { focusElement } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';

import { EVIDENCE_VA_PATH, NO_ISSUES_SELECTED } from '../constants';

import { content } from '../content/evidenceVaRecords';
import { getSelected, getIssueName } from '../utils/helpers';

import { checkValidations } from '../validations';
import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  validateVaUnique,
  isEmptyVaEntry,
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
    name: false,
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
  goBack,
  goForward,
  goToPath,
  setFormData,
  testingIndex,
  testingMethod,
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
  const [currentIndex, setCurrentIndex] = useState(getIndex()); // zero-based
  const [currentData, setCurrentData] = useState(
    locations?.[currentIndex] || defaultData,
  );
  // force a useEffect call when currentIndex doesn't change
  const [forceReload, setForceReload] = useState(false);

  const [currentState, setCurrentState] = useState(defaultState);

  const availableIssues = getSelected(data).map(getIssueName);

  const addOrEdit = isEmptyVaEntry(currentData) ? 'add' : 'edit';

  // *** validations ***
  const errors = {
    unique: checkValidations(
      [validateVaUnique],
      currentData,
      data,
      currentIndex,
    )[0],
    name: checkValidations([validateVaLocation], currentData, data)[0],
    issues: checkValidations([validateVaIssues], currentData)[0],
    from: checkValidations([validateVaFromDate], currentData)[0],
    to: checkValidations([validateVaToDate], currentData)[0],
  };

  const hasErrors = () => Object.values(errors).filter(Boolean).length;

  const focusErrors = () => {
    if (hasErrors()) {
      focusElement('[error]');
    }
  };

  useEffect(
    () => {
      setCurrentData(locations?.[currentIndex] || defaultData);
      setCurrentState(defaultState);
      focusElement(hasErrors() ? '[error]' : 'h3');
      scrollTo('topPageElement');
      setForceReload(false);
    },
    // don't include locations or we clear state & move focus every time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, forceReload],
  );

  const updateCurrentLocation = ({
    name = currentData.locationAndName,
    issues = currentData.issues,
    from = currentData.evidenceDates?.from,
    to = currentData.evidenceDates?.to,
    remove = false,
  } = {}) => {
    const newData = {
      locationAndName: name,
      issues,
      evidenceDates: {
        from,
        to,
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
    setForceReload(true);
    goToPath(`${VA_PATH}?index=${index}`);
  };

  const addAndGoToPageIndex = index => {
    const newLocations = [...locations];
    if (!isEmptyVaEntry(locations[index])) {
      // only insert a new entry if the existing entry isn't empty
      newLocations.splice(index, 0, {});
    }
    setFormData({ ...data, locations: newLocations });
    goToPageIndex(index);
  };

  const handlers = {
    onBlur: event => {
      const fieldName = event.target.getAttribute('name');
      updateState({ dirty: { ...currentState.dirty, [fieldName]: true } });
    },
    onChange: event => {
      const { target = {} } = event;
      const fieldName = target.name;
      // detail.value from va-select & target.value from va-text-input
      const value = event.detail?.value || target.value;
      updateCurrentLocation({ [fieldName]: value });
    },

    onIssueChange: event => {
      updateState({ dirty: { ...currentState.dirty, issues: true } });
      const { target } = event;

      // Clean up issues list
      const newIssues = new Set(
        (currentData?.issues || []).filter(issue =>
          availableIssues.includes(issue),
        ),
      );
      // remove issues that aren't selected any more
      if (target.checked) {
        newIssues.add(target.label);
      } else {
        newIssues.delete(target.label);
      }
      updateCurrentLocation({ issues: [...newIssues] });
    },

    onAddAnother: event => {
      event.preventDefault();
      if (hasErrors()) {
        updateState({
          submitted: true,
          modal: { show: currentIndex !== 0, direction: NAV_PATHS.add },
        });
        focusElement('[error]');
        return;
      }
      // clear state and insert a new entry after the current index (previously
      // added new entry to the end). This change prevents the situation where
      // an invalid entry in the middle of the array can get bypassed by adding
      // a new entry
      addAndGoToPageIndex(currentIndex + 1);
    },
    onGoForward: event => {
      event.preventDefault();
      if (hasErrors()) {
        updateState({
          submitted: true,
          modal: { show: currentIndex !== 0, direction: NAV_PATHS.forward },
        });
        focusElement('[error]');
        return;
      }
      updateState({ submitted: true });
      const nextIndex = currentIndex + 1;
      if (currentIndex < locations.length - 1) {
        goToPageIndex(nextIndex);
      } else {
        // passing data is needed, including nextIndex for unit testing
        goForward(data, nextIndex);
      }
    },
    onGoBack: () => {
      if (hasErrors() && currentIndex !== 0) {
        updateState({
          submitted: true,
          modal: { show: true, direction: NAV_PATHS.back },
        });
        return;
      }
      const prevIndex = currentIndex - 1;
      if (currentIndex > 0) {
        goToPageIndex(prevIndex);
      } else {
        // index only passed here for testing purposes
        goBack(prevIndex);
      }
    },

    onModalClose: event => {
      // For unit testing only
      event.stopPropagation();
      updateState({ submitted: true, modal: { show: false, direction: '' } });
      focusErrors();
    },
    onModalYes: () => {
      // Yes, keep location; do nothing for forward & add
      const { direction } = currentState.modal;
      updateState({ submitted: true, modal: { show: false, direction: '' } });
      if (direction === NAV_PATHS.back) {
        const prevIndex = currentIndex - 1;
        // index only passed here for testing purposes
        if (prevIndex < 0) {
          goBack(prevIndex);
        } else {
          goToPageIndex(prevIndex);
        }
      }
      focusErrors();
    },
    onModalNo: () => {
      // No, clear current data and navigate
      const { direction } = currentState.modal;
      setCurrentData(defaultData);
      // Using returned locations value to block going forward if the locations
      // array has a zero length - the `locations` value is not updated in time
      const updatedLocations = updateCurrentLocation({ remove: true });
      updateState({ submitted: true, modal: { show: false, direction: '' } });
      if (direction === NAV_PATHS.back) {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          goToPageIndex(prevIndex);
        } else {
          // index only passed here for testing purposes
          goBack(prevIndex);
        }
      } else if (direction === NAV_PATHS.forward) {
        if (updatedLocations.length > 0) {
          if (currentIndex < updatedLocations.length) {
            goToPageIndex(currentIndex);
          } else {
            setForceReload(true);
            goForward(data, currentIndex);
          }
        } else {
          goToPageIndex(currentIndex);
        }
      } else {
        // restart this current page with empty fields (they chose No)
        setCurrentState(defaultState);
        goToPageIndex(currentIndex);
      }
    },
  };

  const showError = name =>
    ((currentState.submitted || currentState.dirty[name]) && errors[name]) ||
    null;

  // for testing only; testing-library can't close modal by clicking shadow dom
  // so this adds a clickable button for testing, adding a color + attr name
  // will allow simulating a field name, e.g. "onBlur:from" blurs the from date
  const [testMethod, testName = 'test'] = (testingMethod || '').split(':');
  const testMethodButton =
    testingMethod && !environment.isProduction() ? (
      <button
        id="test-method"
        className="sr-only"
        type="button"
        name={testName}
        onClick={handlers[testMethod]}
      >
        test
      </button>
    ) : null;

  return (
    <form onSubmit={handlers.onGoForward}>
      <fieldset>
        <legend id="va-evidence-title" className="vads-u-font-family--serif">
          <h3 name="topPageElement" className="vads-u-margin--0">
            {content.title(addOrEdit, currentIndex + 1)}
          </h3>
        </legend>
        <p>{content.description}</p>
        <VaModal
          clickToClose
          status="info"
          modalTitle={content.modalTitle}
          primaryButtonText={content.modalYes}
          secondaryButtonText={content.modalNo}
          onCloseEvent={handlers.onModalClose}
          onPrimaryButtonClick={handlers.onModalYes}
          onSecondaryButtonClick={handlers.onModalNo}
          visible={currentState.modal.show}
        >
          <p>{content.modalDescription}</p>
        </VaModal>
        <VaTextInput
          id="add-location-name"
          name="name"
          type="text"
          label={content.locationAndName}
          required
          value={currentData.locationAndName}
          onInput={handlers.onChange}
          onBlur={handlers.onBlur}
          // ignore submitted & dirty state when showing unique error
          error={showError('name') || errors.unique || null}
          autocomplete="section-facility name"
        />

        <br role="presentation" />

        <VaCheckboxGroup
          label={content.conditions}
          name="issues"
          onVaChange={handlers.onIssueChange}
          onBlur={handlers.onBlur}
          error={showError('issues')}
          required
        >
          {availableIssues.length ? (
            availableIssues.map((issue, index) => (
              <va-checkbox
                key={index}
                name="issues"
                label={issue}
                value={issue}
                checked={(currentData?.issues || []).includes(issue)}
              />
            ))
          ) : (
            <strong>{NO_ISSUES_SELECTED}</strong>
          )}
        </VaCheckboxGroup>

        <VaMemorableDate
          id="location-from-date"
          name="from"
          label={content.dateStart}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.evidenceDates?.from}
          error={showError('from')}
        />
        <VaMemorableDate
          id="location-to-date"
          name="to"
          label={content.dateEnd}
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.evidenceDates?.to}
          error={showError('to')}
          required
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

        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          {testMethodButton}
          <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
            <div className="small-6 medium-5 columns">
              {goBack && (
                <ProgressButton
                  onButtonClick={handlers.onGoBack}
                  buttonText="Back"
                  buttonClass="usa-button-secondary"
                  beforeText="«"
                  // This button is described by the current form's header ID
                  aria-describedby="nav-form-header"
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
                aria-describedby="nav-form-header"
              />
            </div>
          </div>
          {contentAfterButtons}
        </div>
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
  testingMethod: PropTypes.string,
};

export default EvidenceVaRecords;
