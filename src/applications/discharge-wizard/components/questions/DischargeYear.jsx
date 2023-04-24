import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import Scroll from 'react-scroll';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const { Element } = Scroll;

const DischargeYearQuestion = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '2_dischargeYear';

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }

  const dischargeYear = formValues[key];
  const currentYear = new Date().getFullYear();
  const yearOptions = range(currentYear - 1992).map(i => {
    const year = currentYear - i;
    return (
      <option key={i} value={year.toString()}>
        {year.toString()}
      </option>
    );
  });

  // yearOptions.push({ text: 'Before 1992', value: '1991' });

  return (
    <fieldset className="fieldset-input dischargeYear" key={key}>
      <Element name={key} />
      <va-select
        autocomplete="false"
        label="What year were you discharged from the military?"
        name={key}
        vaKeyDown={handleKeyDown}
        value={{ value: dischargeYear }}
        onValueChange={update => {
          updateField(key, update.value);
          scrollToLast();
        }}
      >
        {yearOptions}
      </va-select>
    </fieldset>
  );
};

DischargeYearQuestion.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default DischargeYearQuestion;
