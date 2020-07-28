import React, { useState } from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';

function OnlineClassesFilter({
  showModal,
  onlineClasses,
  onChange,
  handleInputFocus,
  gibctFilterEnhancement,
}) {
  const [expanded, expandContent] = useState(false);

  if (gibctFilterEnhancement) {
    return (
      <div>
        <button
          aria-expanded={expanded ? 'true' : 'false'}
          className="usa-accordion-button search-results-collapsible"
          onClick={() => expandContent(!expanded)}
        >
          <p>Your housing allowance</p>
        </button>
        {expanded && (
          <RadioButtons
            label={renderLearnMoreLabel({
              text: 'How do you want to take classes?',
              modal: 'onlineOnlyDistanceLearning',
              showModal,
              ariaLabel: ariaLabels.learnMore.onlineOnlyDistanceLearning,
              component: OnlineClassesFilter,
            })}
            name="onlineClasses"
            options={[
              { value: 'yes', label: 'Online only' },
              { value: 'no', label: 'In person only' },
              { value: 'both', label: 'In person and online' },
            ]}
            value={onlineClasses}
            onChange={onChange}
            onFocus={handleInputFocus}
          />
        )}
      </div>
    );
  }
  return (
    <RadioButtons
      label={renderLearnMoreLabel({
        text: 'How do you want to take classes?',
        modal: 'onlineOnlyDistanceLearning',
        showModal,
        ariaLabel: ariaLabels.learnMore.onlineOnlyDistanceLearning,
        component: OnlineClassesFilter,
      })}
      name="onlineClasses"
      options={[
        { value: 'yes', label: 'Online only' },
        { value: 'no', label: 'In person only' },
        { value: 'both', label: 'In person and online' },
      ]}
      value={onlineClasses}
      onChange={onChange}
      onFocus={handleInputFocus}
    />
  );
}

OnlineClassesFilter.propTypes = {
  onlineClasses: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  showModal: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func,
};

export default OnlineClassesFilter;
