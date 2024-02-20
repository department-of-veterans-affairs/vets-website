import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  VaButtonPair,
  VaCheckboxGroup,
  VaMemorableDate,
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import debounce from 'platform/utilities/data/debounce';

import { EVIDENCE_VA_PATH, NO_ISSUES_SELECTED } from '../constants';
import { content } from '../content/evidenceVaRecords';
import { getIndex, hasErrors } from '../utils/evidence';
import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  validateVaUnique,
  isEmptyVaEntry,
} from '../validations/evidence';
import { focusEvidence } from '../utils/focus';

import { getIssueName, getSelected } from '../../shared/utils/issues';
import { checkValidations } from '../../shared/validations';

const VA_PATH = `/${EVIDENCE_VA_PATH}`;
// const REVIEW_AND_SUBMIT = '/review-and-submit';

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
  showModal: false,
  submitted: false,
};

const EvidenceVaRecords = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  testingIndex,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { locations = [] } = data || {};

  // *** state ***
  // currentIndex is zero-based
  const [currentIndex, setCurrentIndex] = useState(
    getIndex(locations, testingIndex),
  );
  const [currentData, setCurrentData] = useState(
    locations?.[currentIndex] || defaultData,
  );
  // force a useEffect call when currentIndex doesn't change
  const [forceReload, setForceReload] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [currentState, setCurrentState] = useState(defaultState);

  const getPageType = entry => (isEmptyVaEntry(entry) ? 'add' : 'edit');
  const [addOrEdit, setAddOrEdit] = useState(getPageType(currentData));

  const availableIssues = getSelected(data).map(getIssueName);

  // *** validations ***
  const errors = {
    unique: checkValidations(
      [validateVaUnique],
      currentData,
      data,
      currentIndex,
    )[0],
    name: checkValidations([validateVaLocation], currentData, data)[0],
    issues: checkValidations(
      [validateVaIssues],
      currentData,
      data,
      currentIndex,
    )[0],
    from: checkValidations([validateVaFromDate], currentData),
    to: checkValidations([validateVaToDate], currentData),
  };

  useEffect(
    () => {
      const entry = locations?.[currentIndex] || defaultData;
      setCurrentData(entry);
      setAddOrEdit(getPageType(entry));
      setCurrentState(defaultState);
      focusEvidence();
      setForceReload(false);
      debounce(() => setIsBusy(false));
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
    showModal = currentState.showModal,
    submitted = currentState.submitted,
  } = {}) => {
    setCurrentState({ dirty, showModal, submitted });
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
      newLocations.splice(index, 0, defaultData);
    }
    setFormData({ ...data, locations: newLocations });
    goToPageIndex(index);
  };

  const handlers = {
    onBlur: event => {
      // we're switching pages, don't set a field to dirty otherwise the next
      // page may set this and focus on an error without blurring a field
      if (!isBusy) {
        // event.detail from testing
        const fieldName = event.target?.getAttribute('name') || event.detail;
        updateState({ dirty: { ...currentState.dirty, [fieldName]: true } });
      }
    },
    onChange: event => {
      const { target = {} } = event;
      const fieldName = target.name;
      // target.value from va-text-input & va-memorable-date
      const value = target.value || '';
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
      if (hasErrors(errors)) {
        // don't show modal
        updateState({ submitted: true });
        focusEvidence();
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
      updateState({ submitted: true });
      // non-empty entry, focus on error
      if (hasErrors(errors)) {
        focusEvidence();
        return;
      }

      setIsBusy(true);
      const nextIndex = currentIndex + 1;
      if (currentIndex < locations.length - 1) {
        goToPageIndex(nextIndex);
      } else {
        // passing data is needed, including nextIndex for unit testing
        goForward(data, nextIndex);
      }
    },
    onGoBack: () => {
      // show modal if there are errors; don't show _immediately after_ adding
      // a new empty entry
      if (isEmptyVaEntry(currentData)) {
        updateCurrentLocation({ remove: true });
      } else if (hasErrors(errors)) {
        updateState({ submitted: true, showModal: true });
        return;
      }

      setIsBusy(true);
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
      updateState({ submitted: true, showModal: false });
      focusEvidence();
    },
    onModalYes: () => {
      // Yes, keep location
      updateState({ submitted: true, showModal: false });
      const prevIndex = currentIndex - 1;
      // index only passed here for testing purposes
      if (prevIndex < 0) {
        goBack(prevIndex);
      } else {
        goToPageIndex(prevIndex);
      }
      focusEvidence();
    },
    onModalNo: () => {
      // No, clear current data and navigate
      setCurrentData(defaultData);
      updateCurrentLocation({ remove: true });

      updateState({ submitted: true, showModal: false });
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        goToPageIndex(prevIndex);
      } else {
        // index only passed here for testing purposes
        goBack(prevIndex);
      }
    },
  };

  const showError = name =>
    ((currentState.submitted || currentState.dirty[name]) &&
      (Array.isArray(errors[name]) ? errors[name][0] : errors[name])) ||
    null;

  const isInvalid = (name, part) => {
    const message = errors[name]?.[1] || '';
    return message.includes(part) || message.includes('other');
  };

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
          modalTitle={content.modalTitle(currentData)}
          primaryButtonText={content.modalYes}
          secondaryButtonText={content.modalNo}
          onCloseEvent={handlers.onModalClose}
          onPrimaryButtonClick={handlers.onModalYes}
          onSecondaryButtonClick={handlers.onModalNo}
          visible={currentState.showModal}
          uswds
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
          uswds
        />

        <br role="presentation" />

        <VaCheckboxGroup
          label={content.conditions}
          name="issues"
          onVaChange={handlers.onIssueChange}
          onBlur={handlers.onBlur}
          error={showError('issues')}
          required
          uswds
        >
          {availableIssues.length ? (
            availableIssues.map((issue, index) => (
              <va-checkbox
                key={index}
                name="issues"
                class="dd-privacy-hidden"
                data-dd-action-name="issue name"
                label={issue}
                value={issue}
                checked={(currentData?.issues || []).includes(issue)}
                uswds
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
          invalidMonth={isInvalid('from', 'month')}
          invalidDay={isInvalid('from', 'day')}
          invalidYear={isInvalid('from', 'year')}
          month-select={false}
          uswds
        />
        <VaMemorableDate
          id="location-to-date"
          name="to"
          label={content.dateEnd}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.evidenceDates?.to}
          error={showError('to')}
          invalidMonth={isInvalid('to', 'month')}
          invalidDay={isInvalid('to', 'day')}
          invalidYear={isInvalid('to', 'year')}
          month-select={false}
          uswds
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
          <div className="form-progress-buttons schemaform-buttons vads-u-margin-y--2">
            <VaButtonPair
              continue
              onPrimaryClick={handlers.onGoForward}
              onSecondaryClick={handlers.onGoBack}
              aria-describedby="nav-form-header"
              uswds
            />
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
};

export default EvidenceVaRecords;
