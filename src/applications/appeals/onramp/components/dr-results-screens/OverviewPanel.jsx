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
export const HEADING_DR_ONLY = `Decision review options based on your answers`;
export const HEADING_DR_WITH_CFI = `Available options`;
export const ELIGIBLE_TEXT_DR_ONLY = `You may be eligible for these decision review options:`;
export const ELIGIBLE_TEXT_DR_WITH_CFI = `You may be eligible for these decision review options because you disagree with a decision:`;

const OverviewPanel = ({ formResponses }) => {
  const availableOptions = c.OVERVIEW.filter(option => {
    const displayConditionsForOption = DISPLAY_CONDITIONS?.[option] || {};

    return displayConditionsMet(formResponses, displayConditionsForOption);
  });

  const isCFI = isCFIVariant(formResponses);
  const heading = isCFI ? HEADING_DR_WITH_CFI : HEADING_DR_ONLY;
  const eligibleText = isCFI
    ? ELIGIBLE_TEXT_DR_WITH_CFI
    : ELIGIBLE_TEXT_DR_ONLY;

  return (
    <div className="onramp-options-overview vads-u-padding--3">
      <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">{heading}</h2>
      <p>{eligibleText}</p>
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
