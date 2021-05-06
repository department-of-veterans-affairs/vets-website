import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

// Relative Imports
import { months } from 'platform/static-data/options-for-select.js';
import Select from '@department-of-veterans-affairs/component-library/Select';
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

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

  const monthLabel = (
    <legend className="legend-label">
      <h4>What month were you discharged?</h4>
    </legend>
  );

  return (
    <fieldset className="fieldset-input dischargeMonth" key={key}>
      <Element name={key} />
      <Select
        autocomplete="false"
        label={monthLabel}
        name={key}
        onKeyDown={handleKeyDown}
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
