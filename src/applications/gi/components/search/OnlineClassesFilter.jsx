import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import environment from 'platform/utilities/environment';

function OnlineClassesFilter({
  showModal,
  onlineClasses,
  onChange,
  handleInputFocus,
  gibctBenefitFilterEnhancement,
}) {
  // prod flag for story BAH-13929
  const radioButtonsLabelText = environment.isProduction()
    ? 'How do you want to take classes?'
    : 'Will you be taking any classes in person?';
  // prod flag for story BAH-13929
  const options = environment.isProduction()
    ? [
        { value: 'yes', label: 'Online only' },
        { value: 'no', label: 'In person only' },
        { value: 'both', label: 'In person and online' },
      ]
    : [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
  if (gibctBenefitFilterEnhancement) {
    return (
      <div className="filter-additional-info vads-u-margin-bottom--4">
        <AdditionalInfo triggerText="Your housing allowance">
          <RadioButtons
            label={renderLearnMoreLabel({
              text: radioButtonsLabelText,
              modal: 'onlineOnlyDistanceLearning',
              showModal,
              ariaLabel: ariaLabels.learnMore.onlineOnlyDistanceLearning,
              component: OnlineClassesFilter,
            })}
            name="onlineClasses"
            options={options}
            value={onlineClasses}
            onChange={onChange}
            onFocus={handleInputFocus}
          />
        </AdditionalInfo>
      </div>
    );
  }
  return (
    <RadioButtons
      label={renderLearnMoreLabel({
        text: radioButtonsLabelText,
        modal: 'onlineOnlyDistanceLearning',
        showModal,
        ariaLabel: ariaLabels.learnMore.onlineOnlyDistanceLearning,
        component: OnlineClassesFilter,
      })}
      name="onlineClasses"
      options={options}
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
