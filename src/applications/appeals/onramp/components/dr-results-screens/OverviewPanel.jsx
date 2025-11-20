import React from 'react';
import PropTypes from 'prop-types';
import { DISPLAY_CONDITIONS } from '../../constants/display-conditions';
import {
  displayConditionsMet,
  isCFIVariant,
} from '../../utilities/display-conditions';
import { renderSingleOrList } from '../../utilities';
import * as c from '../../constants/results-content/dr-screens/card-content';

// Separated out for unit testing
export const HEADING_DR_WITH_CFI = 'Available options';

const OverviewPanel = ({ formResponses }) => {
  const availableOptions = c.OVERVIEW.filter(option => {
    const displayConditionsForOption = DISPLAY_CONDITIONS?.[option] || {};
    return displayConditionsMet(formResponses, displayConditionsForOption);
  });

  const isCFI = isCFIVariant(formResponses);
  const isSingular = availableOptions.length === 1;

  // Dynamic heading - only affects DR_ONLY variant
  const getHeading = () => {
    if (isCFI) {
      return HEADING_DR_WITH_CFI;
    }

    const optionWord = isSingular ? 'option' : 'options';
    return `Decision review ${optionWord} based on your answers`;
  };

  // Dynamic eligible text based on number of available options
  const getEligibleText = () => {
    const optionWord = isSingular ? 'option' : 'options';
    const thisThese = isSingular ? 'this' : 'these';
    const baseText = `You may be eligible for ${thisThese} decision review ${optionWord}`;
    const suffix = isCFI ? ' because you disagree with a decision:' : ':';

    return `${baseText}${suffix}`;
  };

  return (
    <div className="onramp-options-overview vads-u-padding--3">
      <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
        {getHeading()}
      </h2>
      <p>{getEligibleText()}</p>
      {renderSingleOrList(
        availableOptions,
        false,
        'vads-u-margin-bottom--0 vads-u-font-weight--bold',
        'vads-u-font-weight--bold',
        'overview-option',
      )}
      {isCFI && (
        <>
          <p>
            And you may be eligible for this option because your condition has
            worsened:
          </p>
          <p
            className="vads-u-margin-bottom--0 vads-u-font-weight--bold"
            data-testid="claim-for-increase-option"
          >
            Claim for Increase
          </p>
        </>
      )}
    </div>
  );
};

OverviewPanel.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default OverviewPanel;
