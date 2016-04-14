import React from 'react';
import _ from 'lodash';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableNumberInput from '../form-elements/ErrorableNumberInput';

import { isBlankDateField, isValidDateField } from '../../utils/validations';
import { months, days } from '../../utils/options-for-select.js';

/**
 * A form input with a label that can display error messages.
 *
 * Props:
 * `required` - boolean. Render marker indicating field is required.
 * `label` - string. Label for entire question.
 * `day` - number. Value of day.
 * `month` - number. Value of month.
 * `year` - number. Value of year.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class DateInput extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('date-input-');
  }

  handleChange(path, update) {
    const date = {
      month: this.props.month,
      day: this.props.day,
      year: this.props.year
    };

    date[path] = update;

    this.props.onValueChange(date);
  }

  render() {
    let isValid;
    let daysForSelectedMonth = [];
    const dateField = { day: this.props.day, month: this.props.month, year: this.props.year };

    if (dateField.month) {
      daysForSelectedMonth = days[dateField.month.value];
    }

    if (this.props.required) {
      isValid = isValidDateField(dateField);
    } else {
      isValid = isBlankDateField(dateField) || isValidDateField(dateField);
    }

    return (
      <div>
        <label>{this.props.label ? this.props.label : 'Date of Birth'}</label>
        <span className="usa-form-hint usa-datefield-hint" id="dobHint">For example: Apr 28 1986</span>
        <div className={isValid ? undefined : 'usa-input-error'}>
          <div className="usa-date-of-birth row">
            <div className="hca-datefield-month">
              <ErrorableSelect errorMessage={isValid ? undefined : ''}
                  label="Month"
                  options={months}
                  value={dateField.month}
                  onValueChange={(update) => {this.handleChange('month', update);}}/>
            </div>
            <div className="hca-datefield-day">
              <ErrorableSelect errorMessage={isValid ? undefined : ''}
                  label="Day"
                  options={daysForSelectedMonth}
                  value={dateField.day}
                  onValueChange={(update) => {this.handleChange('day', update);}}/>
            </div>
            <div className="usa-datefield usa-form-group usa-form-group-year">
              <ErrorableNumberInput errorMessage={isValid ? undefined : ''}
                  label="Year"
                  max={new Date().getFullYear()}
                  min="1900"
                  pattern="[0-9]{4}"
                  field={dateField.year}
                  onValueChange={(update) => {this.handleChange('year', update);}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DateInput.propTypes = {
  required: React.PropTypes.bool,
  label: React.PropTypes.string,
  day: React.PropTypes.number.isRequired,
  month: React.PropTypes.number.isRequired,
  year: React.PropTypes.number.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default DateInput;
