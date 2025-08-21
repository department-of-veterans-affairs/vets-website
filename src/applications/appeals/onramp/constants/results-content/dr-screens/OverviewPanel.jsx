import React from 'react';
import PropTypes from 'prop-types';
import { DISPLAY_CONDITIONS } from '../../display-conditions';
import { displayConditionsMet } from '../../../utilities/display-conditions';
import { renderSingleOrList } from '../common';
import * as c from './all-fit-card-content';

const OverviewPanel = ({ formResponses }) => {
  const availableOptions = c.OVERVIEW.filter(option => {
    const displayConditionsForOption = DISPLAY_CONDITIONS?.[option] || {};

    return displayConditionsMet(formResponses, displayConditionsForOption);
  });

  return (
    <div className="onramp-options-overview vads-u-padding--3">
      <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
        Decision review options based on your answers
      </h2>
      <p>You may be eligible for these decision review options:</p>
      {renderSingleOrList(
        availableOptions,
        false,
        'vads-u-margin-bottom--0 vads-u-font-weight--bold',
        'vads-u-font-weight--bold',
      )}
    </div>
  );
};

OverviewPanel.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default OverviewPanel;
