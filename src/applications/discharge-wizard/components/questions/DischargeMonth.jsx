import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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

  // const yearOptions = range(currentYear - 1992).map(i => {
  //   const year = currentYear - i;
  //   return (
  //     <option key={i} value={year.toString()}>
  //       {year.toString()}
  //     </option>
  //   );
  // });

  // console.log(`LOG MONTHS: ${months}`);

  // TODO make this make sense
  const monthOptions = months.map(month => {
    return (
      <option key={1} value={month}>
        {month}
      </option>
    );
  });

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }
  return (
    <fieldset className="fieldset-input dischargeMonth" key={key}>
      <Element name={key} />
      <VaSelect
        autocomplete="false"
        label="What month were you discharged?"
        name={key}
        vaKeyDown={handleKeyDown}
        value={{ value: formValues[key] }}
        onVaSelect={update => {
          updateField(key, update.value);
          scrollToLast();
        }}
      >
        {monthOptions}
      </VaSelect>
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
