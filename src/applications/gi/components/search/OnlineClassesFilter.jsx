import React from 'react';
import PropTypes from 'prop-types';
import { ariaLabels } from '../../constants';
import LearnMoreLabel from '../LearnMoreLabel';
import VARadioButton from '../VARadioButton';

function OnlineClassesFilter({ showModal, onlineClasses, onChange }) {
  const radioButtonsLabelText = 'Will you be taking any classes in person?';
  const options = [
    { value: 'no', label: 'Yes' },
    { value: 'yes', label: 'No' },
  ];
  const name = 'onlineClasses';

  return (
    <div>
      <LearnMoreLabel
        text={radioButtonsLabelText}
        onClick={() => showModal('onlineOnlyDistanceLearning')}
        ariaLabel={ariaLabels.learnMore.onlineOnlyDistanceLearning}
      />
      <VARadioButton
        radioLabel=""
        name={name}
        initialValue={onlineClasses}
        options={options}
        onVaValueChange={e => onChange(e, name, 2)}
      />
    </div>
  );
}

OnlineClassesFilter.propTypes = {
  onlineClasses: PropTypes.string.isRequired,
  showModal: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

export default OnlineClassesFilter;
