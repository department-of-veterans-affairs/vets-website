import React from 'react';
import _ from 'lodash';

import { isValidDate } from '../../utils/validations';

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
    const isValid = isValidDate(this.props.day, this.props.month, this.props.year);
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
            <label htmlFor={`${this.id}-day`}>Day</label>
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
            <label htmlFor={`${this.id}-year`}>Year</label>
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
  day: React.PropTypes.number.isRequired,
  month: React.PropTypes.number.isRequired,
  year: React.PropTypes.number.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default DateInput;
