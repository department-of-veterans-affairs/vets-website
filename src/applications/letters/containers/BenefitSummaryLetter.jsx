import React from 'react';
import { useSelector } from 'react-redux';
import { optionsToAlwaysDisplay } from '../utils/helpers';

const benefitsInfo = state => state.letters.benefitInfo;
const requestOptions = state => state.letters.requestOptions;
// const serviceInfo = state => state.letters.serviceInfo;

const BenefitSummaryLetter = () => {
  const benefitsInfoSelector = useSelector(benefitsInfo);
  const requestOptionsSelector = useSelector(requestOptions);
  // const serviceInfoSelector = useSelector(serviceInfo);

  // console.log(benefitsInfoSelector);
  // console.log(serviceInfoSelector);
  // console.log(requestOptionsSelector);

  const handleBenefitsCheckboxes = () => {
    const benefitKeys = Object.keys(benefitsInfoSelector);
    const benefitCheckboxes = [];

    benefitKeys.forEach(key => {
      if (benefitsInfoSelector[key] === null) return;

      // const value = benefitsInfoSelector[key];
      // const displayOption =
      //   optionsToAlwaysDisplay.includes(key) || value !== false;
      const displayOption = optionsToAlwaysDisplay.includes(key);

      if (displayOption) {
        benefitCheckboxes.push(
          <li key={`option-${key}`} className="form-checkbox">
            <input
              checked={benefitsInfoSelector[key]}
              id={key}
              name={key}
              type="checkbox"
              onChange={() => {}} // TODO: Restore the dispatch
            />
            <label className="vads-u-margin-top--0" htmlFor={key}>
              {key}
            </label>
          </li>,
        );
      }
    });

    return benefitCheckboxes;
  };

  const handleMilitaryServiceCheckbox = () => {
    const { militaryService } = requestOptionsSelector;

    if (!militaryService) return null; // Assume dependent

    return (
      <li key="option-militaryService" className="form-checkbox">
        <input
          checked={militaryService}
          id="militaryService"
          name="militaryService"
          type="checkbox"
          onChange={() => {}} // TODO: Restore the dispatch
        />
        <label name="militaryService-label" htmlFor="militaryService">
          Military service information
        </label>
      </li>
    );
  };

  return (
    <>
      <p className="vads-u-margin-top--0">
        The Benefit Summary and Service Verification Letter includes your VA
        benefits and service history. You can customize this letter depending on
        your needs.
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
          {handleMilitaryServiceCheckbox()}
          {handleBenefitsCheckboxes()}
        </ul>
      </fieldset>
    </>
  );
};

export default BenefitSummaryLetter;
