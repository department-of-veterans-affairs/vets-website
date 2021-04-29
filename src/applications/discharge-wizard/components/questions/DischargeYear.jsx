import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import Scroll from 'react-scroll';

// Relative Imports
import Select from '@department-of-veterans-affairs/component-library/Select';
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

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
    return { label: year.toString(), value: year.toString() };
  });

  yearOptions.push({ label: 'Before 1992', value: '1991' });

  const label = (
    <legend className="legend-label">
      <h4>What year were you discharged from the military?</h4>
    </legend>
  );

  return (
    <fieldset className="fieldset-input dischargeYear" key={key}>
      <Element name={key} />
      <Select
        autocomplete="false"
        label={label}
        name={key}
        options={yearOptions}
        onKeyDown={handleKeyDown}
        value={{ value: dischargeYear }}
        onValueChange={update => {
          updateField(key, update.value);
          scrollToLast();
        }}
      />
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
