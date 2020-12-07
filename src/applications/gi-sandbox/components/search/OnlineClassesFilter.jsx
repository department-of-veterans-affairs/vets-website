import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

function OnlineClassesFilter({
  showModal,
  onlineClasses,
  onChange,
  handleInputFocus,
  gibctBenefitFilterEnhancement,
}) {
  const radioButtonsLabelText = 'Will you be taking any classes in person?';
  const options = [
    { value: 'no', label: 'Yes' },
    { value: 'yes', label: 'No' },
  ];
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
