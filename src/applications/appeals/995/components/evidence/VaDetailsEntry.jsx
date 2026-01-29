import React, { useState, useEffect } from 'react';
import {
  VaCheckbox,
  VaDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { EVIDENCE_VA_DETAILS_URL } from '../../constants';
import { content } from '../../content/evidence/vaDetails';
import { getIndex, getVAEvidence, hasErrors } from '../../utils/evidence';
import {
  validateVaLocation,
  validateVaIssues,
  validateVaDate,
  validateVaUnique,
  isEmptyVaEntry,
} from '../../validations/evidence';
import { focusEvidence } from '../../../shared/utils/focus';
import { EvidenceHeaderAndModal } from '../EvidenceHeaderAndModal';
import Issues from './Issues';
import { EvidencePageNavigation } from '../EvidencePageNavigation';
import { getIssueName, getSelected } from '../../../shared/utils/issues';
import { checkValidations } from '../../../shared/validations';
import { customPageProps995 } from '../../../shared/props';

const VA_PATH = `/${EVIDENCE_VA_DETAILS_URL}`;

const defaultData = {
  locationAndName: '',
  issues: [],
  treatmentDate: '',
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

const VaDetailsEntry = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  testingIndex,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const locations = getVAEvidence(data || {});

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
    treatmentDate: currentData.noDate
      ? null
      : checkValidations([validateVaDate], currentData, data),
  };

  useEffect(
    () => {
      const entry = locations?.[currentIndex] || defaultData;
      setCurrentData(entry);
      setAddOrEdit(getPageType(entry));
      setCurrentState(defaultState);
      focusEvidence();
      setForceReload(false);
      setTimeout(() => setIsBusy(false));
    },
    // don't include locations or we clear state & move focus every time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, forceReload],
  );

  const updateCurrentLocation = ({
    name = currentData.locationAndName,
    issues = currentData.issues,
    txdate = currentData.treatmentDate,
    nodate = currentData.noDate,
    remove = false,
  } = {}) => {
    const newData = {
      locationAndName: name,
      issues,
      treatmentDate: txdate,
      noDate: nodate,
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
      // target.value from va-text-input, va-memorable-date, & va-date
      const value =
        fieldName === 'nodate'
          ? target.checked // I don't have a date checkbox
          : target.value || '';
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

  return (
    <form onSubmit={handlers.onGoForward}>
      <fieldset>
        <EvidenceHeaderAndModal
          currentData={currentData}
          currentState={currentState}
          currentIndex={currentIndex}
          addOrEdit={addOrEdit}
          content={content}
          handlers={handlers}
        />
        <VaTextInput
          id="add-location-name"
          name="name"
          type="text"
          label={content.locationAndName}
          hint={content?.locationAndNameHint || ''}
          required
          value={currentData.locationAndName}
          onInput={handlers.onChange}
          onBlur={handlers.onBlur}
          // ignore submitted & dirty state when showing unique error
          error={showError('name') || errors.unique || null}
          autocomplete="section-facility name"
        />
        <Issues
          availableIssues={availableIssues}
          content={content}
          currentData={currentData}
          handlers={handlers}
          showError={showError}
        />
        <VaDate
          id="txdate"
          name="txdate"
          monthYearOnly
          error={showError('treatmentDate')}
          hint={content.treatmentDateHint}
          label={content.treatmentDate}
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.treatmentDate}
        />
        <VaCheckbox
          id="nodate"
          name="nodate"
          class="vads-u-margin-top--3 vads-u-margin-bottom--4"
          label={content.noDate}
          onVaChange={handlers.onChange}
          checked={currentData.noDate}
        />
        <EvidencePageNavigation
          path={`${VA_PATH}?index=${currentIndex + 1}`}
          content={{
            ...content,
            contentBeforeButtons,
            contentAfterButtons,
          }}
          handlers={handlers}
        />
      </fieldset>
    </form>
  );
};

VaDetailsEntry.propTypes = customPageProps995;

export default VaDetailsEntry;
