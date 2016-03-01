import React from 'react';
import _ from 'lodash';

import { isValidDate } from '../../utils/validations';

class DateInput extends React.Component {
  constructor() {
    super();
    this.state = { hasError: false };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('date-input-');
  }

  handleChange() {
    const date = {
      month: this.refs.month.value,
      day: this.refs.day.value,
      year: this.refs.year.value
    };

    // Update UI based on validation.
    if (!isValidDate(date.day, date.month, date.year)) {
      this.setState({ hasError: true });
    } else {
      this.setState({ hasError: false });
    }

    // Publish change up.
    this.props.onUserInput(date);
  }

  render() {
    const errorClass = this.state.hasError ? 'usa-input-error' : '';
    return (
      <div className={errorClass}>
        <div className="usa-date-of-birth">
          <div className="usa-datefield usa-form-group usa-form-group-month">
            <label htmlFor={`${this.id}-month`}>Month</label>
            <input id={`${this.id}-month`} aria-describedby="dobHint"
                className="usa-form-control" pattern="0?[1-9]|1[012]"
                type="number" min="1" max="12" value={this.props.date.month}
                ref="month" onChange={this.handleChange}/>
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-day">
            <label htmlFor={`${this.id}-day`}>Day</label>
            <input id={`${this.id}-day`} aria-describedby="dobHint"
                className="usa-form-control" pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]"
                type="number" min="1" max="31" value={this.props.date.day}
                ref="day" onChange={this.handleChange}/>
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-year">
            <label htmlFor={`${this.id}-year`}>Year</label>
            <input id={`${this.id}-year`} aria-describedby="dobHint"
                className="usa-form-control" pattern="[0-9]{4}" type="number"
                min="1900" max={new Date().getFullYear()}
                value={this.props.date.year} ref="year"
                onChange={this.handleChange}/>
          </div>
        </div>
      </div>
    );
  }
}

export default DateInput;
