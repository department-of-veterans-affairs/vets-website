import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';
import { questionLabels } from '../../constants';

const Element = Scroll.Element;

const Reason = ({ formValues, handleKeyDown, scrollToLast, updateField }) => {
  const key = '4_reason';

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }

  const options = [
    { label: questionLabels[key]['1'], value: '1' },
    { label: questionLabels[key]['2'], value: '2' },
    { label: questionLabels[key]['3'], value: '3' },
    { label: questionLabels[key]['4'], value: '4' },
    { label: questionLabels[key]['5'], value: '5' },
    // question 8 is intentionally presented out of order here
    { label: questionLabels[key]['8'], value: '8' },
    { label: questionLabels[key]['6'], value: '6' },
    { label: questionLabels[key]['7'], value: '7' },
  ];

  const label = (
    <div>
      <h4>
        Which of the following best describes why you want to change your
        discharge paperwork? Choose the one that’s closest to your situation.
      </h4>
      <p>
        <strong>Note:</strong> If more than one of these fits your situation,
        choose the one that started the events leading to your discharge. For
        example, if you experienced sexual assault and have posttraumatic stress
        disorder (PTSD) resulting from that experience, choose sexual assault.
      </p>
    </div>
  );
  const radioButtonProps = {
    name: key,
    label,
    options,
    key,
    onValueChange: v => {
      if (v.dirty) {
        updateField(key, v.value);
      }
    },
    onMouseDown: scrollToLast,
    onKeyDown: handleKeyDown,
    value: {
      value: formValues[key],
    },
  };

  return (
    <div>
      <Element name={key} />
      <RadioButtons {...radioButtonProps} />
    </div>
  );
};

Reason.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default Reason;
