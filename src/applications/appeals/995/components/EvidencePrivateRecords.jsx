import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  VaCheckboxGroup,
  VaDate,
  VaModal,
  VaTextInput,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import environment from 'platform/utilities/environment';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { countries, states } from 'platform/forms/address';

import { EVIDENCE_PRIVATE_PATH } from '../constants';

import { content } from '../content/evidencePrivateRecords';
import { getSelected, getIssueName } from '../utils/helpers';

import { checkValidations } from '../validations';
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
} from '../validations/evidence';

const PRIVATE_PATH = `/${EVIDENCE_PRIVATE_PATH}`;
// const REVIEW_AND_SUBMIT = '/review-and-submit';
// Directions to go after modal shows
const NAV_PATHS = { add: 'add', back: 'back', forward: 'forward' };
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
  modal: {
    show: false,
    direction: '',
  },
  submitted: false,
};

const EvidencePrivateRecords = ({
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
  const { providerFacility = [] } = data || {};
  const getIndex = () => {
    // get index from url '/va-medical-records?index={index}' or testingIndex
    const searchIndex = new URLSearchParams(window.location.search);
    let index = parseInt(searchIndex.get('index') || testingIndex || '0', 10);
    if (Number.isNaN(index) || index > providerFacility.length) {
      index = providerFacility.length;
    }
    return index;
  };

  // *** state ***
  const [currentIndex, setCurrentIndex] = useState(getIndex());
  const [currentData, setCurrentData] = useState(
    providerFacility?.[currentIndex] || defaultData,
  );
  // force a useEffect call when currentIndex doesn't change
  const [forceReload, setForceReload] = useState(false);

  const [currentState, setCurrentState] = useState(defaultState);

  const availableIssues = getSelected(data).map(getIssueName);

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
    issues: checkValidations([validatePrivateIssues], currentData)[0],
    from: checkValidations([validatePrivateFromDate], currentData)[0],
    to: checkValidations([validatePrivateToDate], currentData)[0],
  };

  const hasErrors = () => Object.values(errors).filter(Boolean).length;
  const focusErrors = () => {
    if (hasErrors()) {
      focusElement('[error]');
    }
  };

  useEffect(
    () => {
      setCurrentData(providerFacility?.[currentIndex] || defaultData);
      setCurrentState(defaultState);
      focusElement('#add-facility-name');
      scrollTo('topPageElement');
      setForceReload(false);
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
    modal = currentState.modal,
    submitted = currentState.submitted,
  } = {}) => {
    setCurrentState({ dirty, modal, submitted });
  };

  const goToPageIndex = index => {
    setCurrentIndex(index);
    setForceReload(true);
    goToPath(`${PRIVATE_PATH}?index=${index}`);
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
      if (hasErrors()) {
        updateState({
          submitted: true,
          modal: { show: currentIndex !== 0, direction: NAV_PATHS.add },
        });
        focusElement('[error]');
        return;
      }
      // clear state and start over for new entry
      goToPageIndex(providerFacility.length); // add to end
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
      if (currentIndex < providerFacility.length - 1) {
        goToPageIndex(nextIndex);
      } else {
        // passing data is needed, including nextIndex for unit testing
        goForward(data, nextIndex);
      }
    },
    onGoBack: () => {
      if (hasErrors() && currentIndex !== 0) {
        // focus on first error
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
      // Yes, keep providerFacility; do nothing for forward & add
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
      // Using returned providerFacility value to block going forward if the
      // providerFacilities array has a zero length - the `providerFacility`
      // value is not updated in time
      const updatedFacility = updateCurrentFacility({ remove: true });
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
        if (updatedFacility.length > 0) {
          if (currentIndex < updatedFacility.length) {
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
            {content.title}
          </h3>
        </legend>
        <p>{content.description}</p>
        <VaModal
          clickToClose
          status="info"
          modalTitle={content.modal.title}
          primaryButtonText={content.modal.yes}
          secondaryButtonText={content.modal.no}
          onCloseEvent={handlers.onModalClose}
          onPrimaryButtonClick={handlers.onModalYes}
          onSecondaryButtonClick={handlers.onModalNo}
          visible={currentState.modal.show}
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
        />
        <VaTextInput
          id="street2"
          name="street2"
          type="text"
          label={content.addressLabels.street2}
          value={currentData.providerFacilityAddress?.street2}
          onInput={handlers.onChange}
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
        />

        <br />
        <VaCheckboxGroup
          label={content.issuesLabel}
          name="issues"
          onVaChange={handlers.onIssueChange}
          onBlur={handlers.onBlur}
          error={showError('issues')}
          required
        >
          {availableIssues.map(issue => (
            <va-checkbox
              key={issue}
              name="issues"
              label={issue}
              value={issue}
              checked={(currentData?.issues || []).includes(issue)}
            />
          ))}
        </VaCheckboxGroup>

        <VaDate
          id="facility-from-date"
          name="from"
          label={content.fromLabel}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.treatmentDateRange?.from}
          error={showError('from')}
        />
        <VaDate
          id="facility-to-date"
          name="to"
          label={content.toLabel}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.treatmentDateRange?.to}
          error={showError('to')}
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
          {testMethodButton}
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
  testingMethod: PropTypes.string,
};

export default EvidencePrivateRecords;
