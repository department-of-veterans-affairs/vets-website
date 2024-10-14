import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { Element } from 'platform/utilities/scroll';
import { months } from 'platform/static-data/options-for-select';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const DischargeMonthQuestion = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '3_dischargeMonth';

  const monthOptions = months.map(month => {
    return (
      <option key={month.value} value={month.value}>
        {month.label}
      </option>
    );
  });

  monthOptions.unshift(
    <option key="-1" value="">
      {' '}
    </option>,
  );

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }
  return (
    <div className="vads-u-margin-top--6">
      <fieldset className="fieldset-input dischargeMonth" key={key}>
        <Element name={key} />
        <VaSelect
          autocomplete="false"
          label="What month were you discharged?"
          name={key}
          vaKeyDown={handleKeyDown}
          value={{ value: formValues[key] }}
          onVaSelect={update => {
            updateField(key, update.detail.value);
            scrollToLast();
          }}
          uswds
        >
          {monthOptions}
        </VaSelect>
      </fieldset>
    </div>
  );
};

DischargeMonthQuestion.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default DischargeMonthQuestion;
