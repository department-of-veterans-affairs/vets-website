import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import {
  VaAlert,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  benefitOptionsMap,
  getBenefitSummaryLetterLabels,
} from '../utils/helpers';
import {
  BENEFIT_OPTIONS,
  UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
} from '../utils/constants';

const VeteranBenefitSummaryOptions = () => {
  const dispatch = useDispatch();
  const benefitsInfoSelector = useSelector(state => state.letters.benefitInfo);
  const optionsAvailableSelector = useSelector(
    state => state.letters.optionsAvailable,
  );
  const optionsLoadingSelector = useSelector(
    state => state.letters.optionsLoading,
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

  console.log(requestOptionsSelector);

  const renderBenefitsCheckboxes = () => {
    const benefitKeys = Object.keys(benefitsInfoSelector);
    const benefitCheckboxes = [];
    const isVeteran = true;

    benefitKeys.forEach(key => {
      if (benefitsInfoSelector[key] === null) return;

      const value = benefitsInfoSelector[key];
      // Assume Lighthouse data from beneFitInformation is the source of truth
      const displayOption = value !== false;
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

  switch (true) {
    // Loading options from vets-api
    case optionsLoadingSelector && !optionsAvailableSelector:
      return (
        <VaLoadingIndicator message="Getting your benefit summary options..." />
      );
      break;
    // Options are available and loading is complete
    case !optionsLoadingSelector && optionsAvailableSelector:
      return (
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
      );
      break;
    // Options are not available and loading is cancelled
    case !optionsLoadingSelector && !optionsAvailableSelector:
      return (
        <VaAlert class="vads-u-margin-top--2" status="error" role="alert">
          <h4 slot="headline">
            Your VA Benefit Summary letter is currently unavailable
          </h4>
          <p>
            Your letter isn't available at this time. If you need help with
            accessing your letter, please <CallVBACenter />
          </p>
        </VaAlert>
      );
      break;
    default:
      return <div>Yeah, I have no goodly idea.</div>;
  }

  //   return (
  //     <>
  //       {!optionsAvailableSelector ? (
  //         <div>Not now Biff</div>
  //       ) : (
  //         <>
  //           <p className="vads-u-margin-top--0">
  //             The Benefit Summary and Service Verification Letter includes your VA
  //             benefits and service history. You can customize this letter
  //             depending on your needs.
  //           </p>

  //           <p>Some of the ways you might be able to use this letter:</p>

  //           <ul className="usa-list">
  //             <li>Apply for housing assistance</li>
  //             <li>Apply for a civil service job</li>
  //             <li>Reduce property taxes</li>
  //             <li>Reduce car taxes</li>
  //           </ul>

  //           <fieldset>
  //             <legend>
  //               <h4 className="vads-u-font-family--sans vads-u-font-size--h4">
  //                 Choose the information you want to include in your letter:
  //               </h4>
  //             </legend>

  //             <ul className="usa-unstyled-list">
  //               {renderMilitaryServiceCheckbox()}
  //               {renderBenefitsCheckboxes()}
  //             </ul>
  //           </fieldset>
  //         </>
  //       )}
  //     </>
  //   );
};

export default VeteranBenefitSummaryOptions;
