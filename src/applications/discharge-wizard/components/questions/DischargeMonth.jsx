import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

// Relative Imports
import { months } from 'platform/static-data/options-for-select.js';
import { shouldShowQuestion } from '../../helpers';

const { Element } = Scroll;

const DischargeMonthQuestion = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '3_dischargeMonth';

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }
  return (
    <fieldset className="fieldset-input dischargeMonth" key={key}>
      <Element name={key} />
      <va-select
        autocomplete="false"
        label="What month were you discharged?"
        name={key}
        vaKeyDown={handleKeyDown}
        options={months}
        value={{ value: formValues[key] }}
        onValueChange={update => {
          updateField(key, update.value);
          scrollToLast();
        }}
      />
    </fieldset>
  );
};

DischargeMonthQuestion.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default DischargeMonthQuestion;
