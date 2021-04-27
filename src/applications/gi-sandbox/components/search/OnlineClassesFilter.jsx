import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';

function OnlineClassesFilter({
  showModal,
  onlineClasses,
  onChange,
  handleInputFocus,
}) {
  const radioButtonsLabelText = 'Will you be taking any classes in person?';
  const options = [
    { value: 'no', label: 'Yes' },
    { value: 'yes', label: 'No' },
  ];

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
