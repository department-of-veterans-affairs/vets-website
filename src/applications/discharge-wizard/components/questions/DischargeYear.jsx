import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import Scroll from 'react-scroll';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  const before1992Key = yearOptions.length + 1;

  yearOptions.push(
    <option key={before1992Key} value="1991">
      Before 1992
    </option>,
  );

  yearOptions.unshift(
    <option key="-1" value="">
      {' '}
    </option>,
  );

  return (
    <div className="vads-u-margin-top--6">
      <fieldset className="fieldset-input dischargeYear" key={key}>
        <Element name={key} />
        <VaSelect
          autocomplete="false"
          label="What year were you discharged from the military?"
          name={key}
          vaKeyDown={handleKeyDown}
          value={{ value: dischargeYear }}
          onVaSelect={update => {
            updateField(key, update.detail.value);
            scrollToLast();
          }}
          uswds={false}
        >
          {yearOptions}
        </VaSelect>
      </fieldset>
    </div>
  );
};

DischargeYearQuestion.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default DischargeYearQuestion;
