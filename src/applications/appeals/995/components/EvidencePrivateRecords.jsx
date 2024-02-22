import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import {
  VaCheckboxGroup,
  VaMemorableDate,
  VaModal,
  VaTextInput,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { countries, states } from 'platform/forms/address';
import debounce from 'platform/utilities/data/debounce';

import { EVIDENCE_PRIVATE_PATH, NO_ISSUES_SELECTED } from '../constants';
import { content } from '../content/evidencePrivateRecords';
import { getIndex, hasErrors } from '../utils/evidence';

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
} from '../validations/evidence';
import { focusEvidence } from '../utils/focus';

import { getIssueName, getSelected } from '../../shared/utils/issues';
import { checkValidations } from '../../shared/validations';

const PRIVATE_PATH = `/${EVIDENCE_PRIVATE_PATH}`;
// const REVIEW_AND_SUBMIT = '/review-and-submit';

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

const EvidencePrivateRecords = ({
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
      debounce(() => setIsBusy(false));
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
      // Yes, keep providerFacilit
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

  const hasStates =
    states[(currentData.providerFacilityAddress?.country)] || [];

  return (
    <form onSubmit={handlers.onGoForward}>
      <fieldset>
        <legend
          id="private-evidence-title"
          className="vads-u-font-family--serif"
        >
          <h3 name="topPageElement" className="vads-u-margin--0">
            {content.title(addOrEdit, currentIndex + 1)}
          </h3>
        </legend>
        <p>{content.description}</p>
        <VaModal
          clickToClose
          status="info"
          modalTitle={content.modal.title(currentData)}
          primaryButtonText={content.modal.yes}
          secondaryButtonText={content.modal.no}
          onCloseEvent={handlers.onModalClose}
          onPrimaryButtonClick={handlers.onModalYes}
          onSecondaryButtonClick={handlers.onModalNo}
          visible={currentState.showModal}
          uswds
        >
          <p>{content.modal.description}</p>
        </VaModal>
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
          uswds
        />

        <VaSelect
          id="country"
          name="country"
          label={content.addressLabels.country}
          required
          value={currentData.providerFacilityAddress?.country}
          onVaSelect={handlers.onChange}
          onBlur={handlers.onBlur}
          error={showError('country')}
          uswds
        >
          <option value=""> </option>
          {countries.map(country => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </VaSelect>
        <VaTextInput
          id="street"
          name="street"
          type="text"
          label={content.addressLabels.street}
          required
          value={currentData.providerFacilityAddress?.street}
          onInput={handlers.onChange}
          onBlur={handlers.onBlur}
          error={showError('street')}
          autocomplete="section-provider address-line1"
          uswds
        />
        <VaTextInput
          id="street2"
          name="street2"
          type="text"
          label={content.addressLabels.street2}
          value={currentData.providerFacilityAddress?.street2}
          onInput={handlers.onChange}
          autocomplete="section-provider address-line2"
          uswds
        />
        <VaTextInput
          id="city"
          name="city"
          type="text"
          label={content.addressLabels.city}
          required
          value={currentData.providerFacilityAddress?.city}
          onInput={handlers.onChange}
          onBlur={handlers.onBlur}
          error={showError('city')}
          autocomplete="section-provider address-level2"
          uswds
        />
        {hasStates.length ? (
          <VaSelect
            id="state"
            name="state"
            label={content.addressLabels.state}
            required
            value={currentData.providerFacilityAddress?.state}
            onVaSelect={handlers.onChange}
            onBlur={handlers.onBlur}
            error={showError('state')}
            uswds
          >
            <option value=""> </option>
            {hasStates.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </VaSelect>
        ) : (
          <VaTextInput
            id="state"
            name="state"
            type="text"
            label={content.addressLabels.state}
            required
            value={currentData.providerFacilityAddress?.state}
            onInput={handlers.onChange}
            onBlur={handlers.onBlur}
            error={showError('state')}
            autocomplete="section-provider address-level1"
            uswds
          />
        )}

        <VaTextInput
          id="postal"
          name="postal"
          type="text"
          label={content.addressLabels.postal}
          required
          value={currentData.providerFacilityAddress?.postalCode}
          onInput={handlers.onChange}
          onBlur={handlers.onBlur}
          error={showError('postal')}
          inputmode="numeric"
          autocomplete="section-provider postal-code"
          uswds
        />

        <br role="presentation" />

        <VaCheckboxGroup
          label={content.issuesLabel}
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
          id="facility-from-date"
          name="from"
          label={content.fromLabel}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.treatmentDateRange?.from}
          error={showError('from')}
          invalidMonth={isInvalid('from', 'month')}
          invalidDay={isInvalid('from', 'day')}
          invalidYear={isInvalid('from', 'year')}
          month-select={false}
          uswds
        />
        <VaMemorableDate
          id="facility-to-date"
          name="to"
          label={content.toLabel}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.treatmentDateRange?.to}
          error={showError('to')}
          invalidMonth={isInvalid('to', 'month')}
          invalidDay={isInvalid('to', 'day')}
          invalidYear={isInvalid('to', 'year')}
          month-select={false}
          uswds
        />
        <div className="vads-u-margin-top--2">
          <Link
            to={`${PRIVATE_PATH}?index=${currentIndex + 1}`}
            onClick={handlers.onAddAnother}
            className="vads-c-action-link--green"
          >
            {content.addAnotherLink}
          </Link>
        </div>

        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          <FormNavButtons
            goBack={handlers.onGoBack}
            goForward={handlers.onGoForward}
          />
          {contentAfterButtons}
        </div>
      </fieldset>
    </form>
  );
};

EvidencePrivateRecords.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    providerFacility: PropTypes.arrayOf(
      PropTypes.shape({
        providerFacilityName: PropTypes.string,
        providerFacilityAddress: PropTypes.shape({
          country: PropTypes.string,
          street: PropTypes.string,
          street2: PropTypes.string,
          city: PropTypes.string,
          state: PropTypes.string,
          postalCode: PropTypes.string,
        }),
        issues: PropTypes.arrayOf(PropTypes.string),
        treatmentDateRange: PropTypes.shape({
          from: PropTypes.string,
          to: PropTypes.string,
        }),
      }),
    ),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
};

export default EvidencePrivateRecords;
