import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import {
  VaTextInput,
  VaSelect,
  VaCheckboxGroup,
  VaMemorableDate,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { countries, states } from 'platform/forms/address';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
// import { FormNavButtons } from '@department-of-veterans-affairs/platform-forms-system';
// import {
//   countries,
//   states,
// } from '@department-of-veterans-affairs/platform-forms';

import { NO_ISSUES_SELECTED } from '../constants';

export const HeaderAndModal = ({
  currentData,
  currentState,
  currentIndex,
  addOrEdit,
  content,
  handlers,
}) => (
  <>
    <legend id="evidence-title" className="vads-u-font-family--serif">
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
  </>
);

HeaderAndModal.propTypes = {
  addOrEdit: PropTypes.string,
  content: PropTypes.shape({
    title: PropTypes.func,
    description: PropTypes.string,
    modal: PropTypes.shape({
      description: PropTypes.string,
      no: PropTypes.string,
      title: PropTypes.func,
      yes: PropTypes.string,
    }),
  }),
  currentData: PropTypes.shape({}),
  currentIndex: PropTypes.number,
  currentState: PropTypes.shape({
    showModal: PropTypes.bool,
  }),
  handlers: PropTypes.shape({
    onModalClose: PropTypes.func,
    onModalNo: PropTypes.func,
    onModalYes: PropTypes.func,
  }),
};

export const IssueAndDates = ({
  currentData,
  availableIssues,
  content,
  handlers,
  showError,
  isInvalid,
  dateRangeKey,
}) => (
  <>
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
      id="from-date"
      name="from"
      label={content.dateStart}
      required
      onDateChange={handlers.onChange}
      onDateBlur={handlers.onBlur}
      value={currentData[dateRangeKey]?.from}
      error={showError('from')}
      invalidMonth={isInvalid('from', 'month')}
      invalidDay={isInvalid('from', 'day')}
      invalidYear={isInvalid('from', 'year')}
      month-select={false}
      uswds
    />
    <VaMemorableDate
      id="to-date"
      name="to"
      label={content.dateEnd}
      required
      onDateChange={handlers.onChange}
      onDateBlur={handlers.onBlur}
      value={currentData[dateRangeKey]?.to}
      error={showError('to')}
      invalidMonth={isInvalid('to', 'month')}
      invalidDay={isInvalid('to', 'day')}
      invalidYear={isInvalid('to', 'year')}
      month-select={false}
      uswds
    />
  </>
);

IssueAndDates.propTypes = {
  availableIssues: PropTypes.array,
  content: PropTypes.shape({
    dateStart: PropTypes.string,
    dateEnd: PropTypes.string,
    issuesLabel: PropTypes.string,
  }),
  currentData: PropTypes.shape({
    issues: PropTypes.array,
  }),
  dateRangeKey: PropTypes.string,
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  isInvalid: PropTypes.func,
  showError: PropTypes.func,
};

export const FacilityAddress = ({
  currentData,
  content,
  handlers,
  showError,
}) => {
  const hasStates =
    states[(currentData.providerFacilityAddress?.country)] || [];
  return (
    <>
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
    </>
  );
};

FacilityAddress.propTypes = {
  content: PropTypes.shape({
    addressLabels: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
      state: PropTypes.string,
      street: PropTypes.string,
      street2: PropTypes.string,
      postal: PropTypes.string,
    }),
    issuesLabel: PropTypes.string,
    toLabel: PropTypes.string,
  }),
  currentData: PropTypes.shape({
    providerFacilityAddress: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
      state: PropTypes.string,
      street: PropTypes.string,
      street2: PropTypes.string,
      postalCode: PropTypes.string,
    }),
  }),
  dateRangeKey: PropTypes.string,
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  isInvalid: PropTypes.func,
  showError: PropTypes.func,
};

export const PageNavigation = ({ path, content, handlers }) => (
  <>
    <div className="vads-u-margin-top--2">
      <Link
        to={path}
        onClick={handlers.onAddAnother}
        className="vads-c-action-link--green"
      >
        {content.addAnotherLink}
      </Link>
    </div>

    <div className="vads-u-margin-top--4">
      {content.contentBeforeButtons}
      <FormNavButtons
        goBack={handlers.onGoBack}
        goForward={handlers.onGoForward}
      />
      {content.contentAfterButtons}
    </div>
  </>
);

PageNavigation.propTypes = {
  content: PropTypes.shape({
    addAnotherLink: PropTypes.string,
    contentAfterButtons: PropTypes.element,
    contentBeforeButtons: PropTypes.element,
  }),
  handlers: PropTypes.shape({
    onAddAnother: PropTypes.func,
    onGoBack: PropTypes.func,
    onGoForward: PropTypes.func,
  }),
  path: PropTypes.string,
};
