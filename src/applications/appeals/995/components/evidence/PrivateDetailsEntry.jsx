import React, { useState, useEffect } from 'react';
import {
  VaMemorableDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { EVIDENCE_PRIVATE_DETAILS_URL } from '../../constants';
import { content } from '../../content/evidence/privateDetails';
import { getIndex, hasErrors } from '../../utils/evidence';
import {
  validatePrivateName,
  validateCountry,
  validateStreet,
  validateCity,
  validateState,
  validatePostal,
  validatePrivateIssues,
  validatePrivateFromDate,
  validatePrivateToDate,
  validatePrivateUnique,
  isEmptyPrivateEntry,
} from '../../validations/evidence';
import { focusEvidence } from '../../../shared/utils/focus';
import { EvidenceFacilityAddress } from '../EvidenceFacilityAddress';
import { EvidenceHeaderAndModal } from '../EvidenceHeaderAndModal';
import Issues from './Issues';
import { EvidencePageNavigation } from '../EvidencePageNavigation';
import { getIssueName, getSelected } from '../../../shared/utils/issues';
import { checkValidations } from '../../../shared/validations';
import { customPageProps995 } from '../../../shared/props';

const PRIVATE_PATH = `/${EVIDENCE_PRIVATE_DETAILS_URL}`;

const defaultData = {
  providerFacilityName: '',
  issues: [],
  providerFacilityAddress: {
    country: 'USA',
    street: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',
  },
  treatmentDateRange: { from: '', to: '' },
};
const defaultState = {
  dirty: {
    name: false,
    country: false,
    street: false,
    city: false,
    state: false,
    postal: false,
    issues: false,
    from: false,
    to: false,
  },
  showModal: false,
  submitted: false,
};

const PrivateDetailsEntry = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  testingIndex,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { providerFacility = [] } = data || {};

  // *** state ***
  // currentIndex is zero-based
  const [currentIndex, setCurrentIndex] = useState(
    getIndex(providerFacility, testingIndex),
  );
  const [currentData, setCurrentData] = useState(
    providerFacility?.[currentIndex] || defaultData,
  );
  // force a useEffect call when currentIndex doesn't change
  const [forceReload, setForceReload] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [currentState, setCurrentState] = useState(defaultState);

  const availableIssues = getSelected(data).map(getIssueName);

  const getPageType = entry => (isEmptyPrivateEntry(entry) ? 'add' : 'edit');
  const [addOrEdit, setAddorEdit] = useState(getPageType(currentData));

  // *** validations ***
  const errors = {
    unique: checkValidations(
      [validatePrivateUnique],
      currentData,
      data,
      currentIndex,
    )[0],
    name: checkValidations([validatePrivateName], currentData, data)[0],
    country: checkValidations([validateCountry], currentData)[0],
    street: checkValidations([validateStreet], currentData)[0],
    city: checkValidations([validateCity], currentData)[0],
    state: checkValidations([validateState], currentData)[0],
    postal: checkValidations([validatePostal], currentData)[0],
    issues: checkValidations(
      [validatePrivateIssues],
      currentData,
      data,
      currentIndex,
    )[0],
    from: checkValidations([validatePrivateFromDate], currentData),
    to: checkValidations([validatePrivateToDate], currentData),
  };

  useEffect(
    () => {
      const entry = providerFacility?.[currentIndex] || defaultData;
      setCurrentData(entry);
      setAddorEdit(getPageType(entry));
      setCurrentState(defaultState);
      focusEvidence();
      setForceReload(false);
      setTimeout(() => setIsBusy(false));
    },
    // don't include providerFacility or we clear state & move focus every time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, forceReload],
  );

  const updateCurrentFacility = ({
    name = currentData.providerFacilityName,
    country = currentData.providerFacilityAddress?.country,
    street = currentData.providerFacilityAddress?.street,
    street2 = currentData.providerFacilityAddress?.street2,
    city = currentData.providerFacilityAddress?.city,
    state = currentData.providerFacilityAddress?.state,
    postal = currentData.providerFacilityAddress?.postalCode,
    issues = currentData.issues,
    from = currentData.treatmentDateRange?.from,
    to = currentData.treatmentDateRange?.to,
    remove = false,
  } = {}) => {
    const newData = {
      providerFacilityName: name,
      providerFacilityAddress: {
        country,
        street,
        street2,
        city,
        state,
        postalCode: postal,
      },
      issues,
      treatmentDateRange: {
        from,
        to,
      },
    };

    const newProviderFacility = [...providerFacility];
    if (remove) {
      newProviderFacility.splice(currentIndex, 1);
    } else {
      newProviderFacility[currentIndex] = newData;
    }
    setCurrentData(newData);
    setFormData({ ...data, providerFacility: newProviderFacility });
    return newProviderFacility;
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
    goToPath(`${PRIVATE_PATH}?index=${index}`);
  };

  const addAndGoToPageIndex = index => {
    const newProviderFacility = [...providerFacility];
    if (!isEmptyPrivateEntry(providerFacility[index])) {
      // only insert a new entry if the existing entry isn't empty
      newProviderFacility.splice(index, 0, defaultData);
    }
    setFormData({ ...data, providerFacility: newProviderFacility });
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
      // detail.value from va-select &
      // target.value from va-text-input & va-memorable-date
      const value = event.detail?.value || target.value || '';
      // empty va-memorable-date may return '--'
      updateCurrentFacility({ [fieldName]: value });
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
      updateCurrentFacility({ issues: [...newIssues] });
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
      if (currentIndex < providerFacility.length - 1) {
        goToPageIndex(nextIndex);
      } else {
        // passing data is needed, including nextIndex for unit testing
        goForward(data, nextIndex);
      }
    },
    onGoBack: () => {
      // show modal if there are errors; don't show _immediately after_ adding
      // a new empty entry
      if (isEmptyPrivateEntry(currentData)) {
        updateCurrentFacility({ remove: true });
      } else if (hasErrors(errors)) {
        // focus on first error
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
      // Yes, keep providerFacility
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
      updateCurrentFacility({ remove: true });

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
        <EvidenceHeaderAndModal
          currentData={currentData}
          currentState={currentState}
          currentIndex={currentIndex}
          addOrEdit={addOrEdit}
          content={content}
          handlers={handlers}
        />
        <VaTextInput
          id="add-facility-name"
          name="name"
          type="text"
          label={content.nameLabel}
          required
          value={currentData.providerFacilityName}
          onInput={handlers.onChange}
          onBlur={handlers.onBlur}
          // ignore submitted & dirty state when showing unique error
          error={showError('name') || errors.unique || null}
          autocomplete="section-provider name"
        />
        <EvidenceFacilityAddress
          className={hasErrors(errors) ? 'vads-u-margin-top--2' : ''}
          currentData={currentData}
          content={content}
          handlers={handlers}
          showError={showError}
        />
        <Issues
          availableIssues={availableIssues}
          content={content}
          currentData={currentData}
          handlers={handlers}
          showError={showError}
        />
        <VaMemorableDate
          error={showError('from')}
          hint="Enter 2 digits for the month and day and 4 digits for the year. You can estimate the date."
          id="from-date"
          invalidDay={isInvalid('from', 'day')}
          invalidMonth={isInvalid('from', 'month')}
          invalidYear={isInvalid('from', 'year')}
          label={content.dateStart}
          month-select={false}
          name="from"
          onDateBlur={handlers.onBlur}
          onDateChange={handlers.onChange}
          removeDateHint
          required
          value={currentData.treatmentDateRange?.from}
        />
        <VaMemorableDate
          error={showError('to')}
          hint="Enter 2 digits for the month and day and 4 digits for the year. You can estimate the date."
          id="to-date"
          invalidDay={isInvalid('to', 'day')}
          invalidMonth={isInvalid('to', 'month')}
          invalidYear={isInvalid('to', 'year')}
          label={content.dateEnd}
          month-select={false}
          name="to"
          onDateBlur={handlers.onBlur}
          onDateChange={handlers.onChange}
          removeDateHint
          required
          value={currentData.treatmentDateRange?.to}
        />
        <EvidencePageNavigation
          path={`${PRIVATE_PATH}?index=${currentIndex + 1}`}
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

PrivateDetailsEntry.propTypes = customPageProps995;

export default PrivateDetailsEntry;
