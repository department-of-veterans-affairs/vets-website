import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import {
  benefitOptionsMap,
  getFriendlyBenefitSummaryLabels,
} from '../utils/helpers';
import { UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION } from '../utils/constants';

const VeteranBenefitSummaryOptions = () => {
  const dispatch = useDispatch();
  const benefitsInfoSelector = useSelector(state => state.letters.benefitInfo);
  const optionsAvailableSelector = useSelector(
    state => state.letters.optionsAvailable,
  );
  const requestOptionsSelector = useSelector(
    state => state.letters.requestOptions,
  );
  const serviceInfoSelector = useSelector(state => state.letters.serviceInfo);

  const handleChange = e => {
    recordEvent({
      // For Google Analytics
      event: 'letter-benefit-option-clicked',
      'letter-benefit-option': e.target.id,
      'letter-benefit-option-status': e.target.checked
        ? 'checked'
        : 'unchecked',
    });

    dispatch({
      type: UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
      propertyPath: benefitOptionsMap[e.target.id],
      value: e.target.checked,
    });
  };

  const renderBenefitsCheckboxes = () => {
    const benefitKeys = Object.keys(benefitsInfoSelector);
    const benefitCheckboxes = [];
    const isVeteran = true;

    benefitKeys.forEach(key => {
      if (benefitsInfoSelector[key] === null) return;

      const value = benefitsInfoSelector[key];
      // Assume Lighthouse data from beneFitInformation is the source of truth
      const displayOption = value !== false;
      const labelText = getFriendlyBenefitSummaryLabels(key, isVeteran);

      if (displayOption && labelText) {
        benefitCheckboxes.push(
          <li key={`option-${key}`} className="form-checkbox">
            <input
              checked={requestOptionsSelector[benefitOptionsMap[key]]}
              id={key}
              name={key}
              type="checkbox"
              onChange={e => handleChange(e)}
            />
            <label className="vads-u-margin-top--0" htmlFor={key}>
              {labelText}
            </label>
          </li>,
        );
      }
    });

    return benefitCheckboxes;
  };

  const renderMilitaryServiceCheckbox = () => {
    const militaryServiceRows = serviceInfoSelector || [];
    const { militaryService } = requestOptionsSelector;

    if (militaryServiceRows.length) {
      return (
        <li key="option-militaryService" className="form-checkbox">
          <input
            checked={militaryService}
            id="militaryService"
            name="militaryService"
            type="checkbox"
            onChange={e => handleChange(e)}
          />
          <label
            name="militaryService-label"
            className="vads-u-margin-top--0"
            htmlFor="militaryService"
          >
            Military service
          </label>
        </li>
      );
    }

    return undefined;
  };

  switch (true) {
    // Loading options from vets-api
    case !optionsAvailableSelector:
      return (
        <VaLoadingIndicator message="Loading your benefit summary options..." />
      );
    // Options are available and loading is complete
    case optionsAvailableSelector:
      return (
        <>
          <p className="vads-u-margin-top--0">
            The Benefit Summary and Service Verification Letter includes your VA
            benefits and service history. You can customize this letter
            depending on your needs.
          </p>

          <p>Some of the ways you might be able to use this letter:</p>

          <ul className="usa-list vads-u-margin-bottom--3">
            <li>Apply for housing assistance</li>
            <li>Apply for a civil service job</li>
            <li>Reduce property taxes</li>
            <li>Reduce car taxes</li>
          </ul>

          <fieldset>
            <legend>
              <h4 className="vads-u-font-family--sans vads-u-font-size--h4 vads-u-margin-y--0">
                Choose what to include in your benefit letter:
              </h4>
            </legend>

            <ul id="va-bsl-options" className="usa-unstyled-list">
              {renderMilitaryServiceCheckbox()}
              {renderBenefitsCheckboxes()}
            </ul>
          </fieldset>
        </>
      );
    default:
      return <div>Refresh the browser to download your letter.</div>;
  }
};

export default VeteranBenefitSummaryOptions;
