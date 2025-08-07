import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaCheckbox,
  VaCheckboxGroup,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
          <VaCheckbox
            checked={requestOptionsSelector[benefitOptionsMap[key]]}
            id={key}
            name={key}
            onVaChange={e => handleChange(e)}
            label={labelText}
          />,
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
        <VaCheckbox
          checked={militaryService}
          id="militaryService"
          name="militaryService"
          onVaChange={e => handleChange(e)}
          label="Military service"
        />
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

          <VaCheckboxGroup
            label="Choose what to include in your benefit letter:"
            labelHeaderLevel={4}
          >
            {renderMilitaryServiceCheckbox()}
            {renderBenefitsCheckboxes()}
          </VaCheckboxGroup>
        </>
      );
    default:
      return <div>Refresh the browser to download your letter.</div>;
  }
};

export default VeteranBenefitSummaryOptions;
