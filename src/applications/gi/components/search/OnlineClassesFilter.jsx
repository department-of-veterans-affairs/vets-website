import React from 'react';
import PropTypes from 'prop-types';
import RadioButtons from '../RadioButtons';
import { ariaLabels } from '../../constants';
import LearnMoreLabel from '../LearnMoreLabel';

function OnlineClassesFilter({
  showModal,
  onlineClasses,
  onChange,
  handleInputFocus,
}) {
  const radioButtonsLabelText = 'Will you be taking any classes in person?';
  // const options = environment.isProduction()
  //   ? [{ value: 'no', label: 'Yes' }, { value: 'yes', label: 'No' }]
  //   : [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
  const options = [
    { value: 'no', label: 'Yes' },
    { value: 'yes', label: 'No' },
  ];

  return (
    <RadioButtons
      label={
        <LearnMoreLabel
          text={radioButtonsLabelText}
          onClick={() => showModal('onlineOnlyDistanceLearning')}
          ariaLabel={ariaLabels.learnMore.onlineOnlyDistanceLearning}
        />
      }
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
  showModal: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func,
  onChange: PropTypes.func,
};

export default OnlineClassesFilter;
