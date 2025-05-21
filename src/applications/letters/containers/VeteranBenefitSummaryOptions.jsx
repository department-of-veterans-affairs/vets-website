import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  benefitOptionsMap,
  getBenefitSummaryLetterLabels,
  optionsToAlwaysDisplay,
} from '../utils/helpers';
import {
  BENEFIT_OPTIONS,
  UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
} from '../utils/constants';

const isVeteran = true;

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

  // Updating options to always show to split disability rating
  // and monthly amount into two separate labels
  const newOptionsToAlwaysDisplay = optionsToAlwaysDisplay.concat(
    BENEFIT_OPTIONS.monthlyAwardAmount,
  );

  // console.log(benefitsInfoSelector);
  // console.log(serviceInfoSelector);
  // console.log(requestOptionsSelector);

  const handleChange = e => {
    dispatch({
      type: UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
      propertyPath: benefitOptionsMap[e.target.id],
      value: e.target.checked,
    });
  };

  const renderBenefitsCheckboxes = () => {
    const benefitKeys = Object.keys(benefitsInfoSelector);
    const benefitCheckboxes = [];

    benefitKeys.forEach(key => {
      if (benefitsInfoSelector[key] === null) return;

      const value = benefitsInfoSelector[key];
      // const displayOption =
      //   optionsToAlwaysDisplay.includes(key) || value !== false;
      const displayOption = newOptionsToAlwaysDisplay.includes(key);
      const labelText = getBenefitSummaryLetterLabels(key, value, isVeteran);

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
          <label name="militaryService-label" htmlFor="militaryService">
            Military service information
          </label>
        </li>
      );
    }

    return undefined;
  };

  return (
    <>
      {!optionsAvailableSelector ? (
        <div>Not now Biff</div>
      ) : (
        <>
          <p className="vads-u-margin-top--0">
            The Benefit Summary and Service Verification Letter includes your VA
            benefits and service history. You can customize this letter
            depending on your needs.
          </p>

          <p>Some of the ways you might be able to use this letter:</p>

          <ul className="usa-list">
            <li>Apply for housing assistance</li>
            <li>Apply for a civil service job</li>
            <li>Reduce property taxes</li>
            <li>Reduce car taxes</li>
          </ul>

          <fieldset>
            <legend>
              <h4 className="vads-u-font-family--sans vads-u-font-size--h4">
                Choose the information you want to include in your letter:
              </h4>
            </legend>

            <ul className="usa-unstyled-list">
              {renderMilitaryServiceCheckbox()}
              {renderBenefitsCheckboxes()}
            </ul>
          </fieldset>
        </>
      )}
    </>
  );
};

export default VeteranBenefitSummaryOptions;
