import React from 'react';
import _ from 'lodash';

import { isBlank, isValidDate } from '../../utils/validations';

/**
 * A form input with a label that can display error messages.
 *
 * Props:
 * `required` - boolean. Render marker indicating field is required.
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

  handleChange() {
    const date = {
      month: Number(this._month.value),
      day: Number(this._day.value),
      year: Number(this._year.value)
    };

    this.props.onValueChange(date);
  }

  render() {
    let isValid;
    if (this.props.required) {
      isValid = isValidDate(this.props.day, this.props.month, this.props.year);
    } else {
      isValid = (isBlank(this.props.day) && isBlank(this.props.month) && isBlank(this.props.year)) ||
          isValidDate(this.props.day, this.props.month, this.props.year);
    }

    return (
      <div className={isValid ? undefined : 'usa-input-error'}>
        <div className="usa-date-of-birth">
          <div className="usa-datefield usa-form-group usa-form-group-month">
            <label
                className={isValid ? undefined : 'usa-input-error-label'}
                htmlFor={`${this.id}-month`}>
              Month
            </label>
            <input
                className="usa-form-control"
                id={`${this.id}-month`}
                max="12"
                min="1"
                pattern="0?[1-9]|1[012]"
                ref={(c) => { this._month = c; }}
                type="number"
                value={this.props.month}
                onChange={this.handleChange}/>
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-day">
            <label
                className={isValid ? undefined : 'usa-input-error-label'}
                htmlFor={`${this.id}-day`}>Day</label>
            <input
                className="usa-form-control"
                id={`${this.id}-day`}
                max="31"
                min="1"
                pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]"
                ref={(c) => { this._day = c; }}
                type="number"
                value={this.props.day}
                onChange={this.handleChange}/>
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-year">
            <label
                className={isValid ? undefined : 'usa-input-error-label'}
                htmlFor={`${this.id}-year`}>Year</label>
            <input
                className="usa-form-control"
                id={`${this.id}-year`}
                max={new Date().getFullYear()}
                min="1900"
                pattern="[0-9]{4}"
                ref={(c) => { this._year = c; }}
                type="number"
                value={this.props.year}
                onChange={this.handleChange}/>
          </div>
        </div>
      </div>
    );
  }
}

DateInput.propTypes = {
  required: React.PropTypes.bool,
  day: React.PropTypes.number.isRequired,
  month: React.PropTypes.number.isRequired,
  year: React.PropTypes.number.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default DateInput;
