import React from 'react';
import _ from 'lodash/fp';

import { months, days } from '../utils/options-for-select.js';

export default class DateField extends React.Component {
  constructor(props) {
    super(props);
    this.formatDate = this.formatDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { month: '', day: '', year: '', monthTouched: false, dayTouched: false, yearTouched: false };
  }

  handleChange(field, value) {
    const newState = _.set(field, value, this.state);
    this.setState(newState);
    if (!this.props.required || newState.month && newState.day && newState.year) {
      this.props.onChange(this.formatDate(newState));
    }
  }

  formatDate({ month, day, year }) {
    return `${year || 'XXXX'}-${month || 'XX'}-${day || 'XX'}`;
  }

  render() {
    const { schema, errorSchema, idSchema } = this.props;
    debugger;
    const { month, day, year } = this.state;
    const isValid = !errorSchema.length;
    let daysForSelectedMonth;

    if (month) {
      daysForSelectedMonth = days[month];
    }
    return (
      <div className={errorSchema.length ? 'usa-input-error form-error-date' : undefined}>
        <div className="usa-date-of-birth row">
          <div className="form-datefield-month">
            <label htmlFor={`${idSchema.$id}Month`}>Month</label>
            <select
                autoComplete="false"
                name={`${idSchema.$id}Month`}
                id={`${idSchema.$id}Month`}
                value={month}
                onChange={(event) => this.handleChange('month', event.target.value)}>
              <option value=""/>
                {months.map(mnth => <option key={mnth.value} value={mnth.value}>{mnth.label}</option>)}
            </select>
          </div>
          <div className="form-datefield-day">
            <label htmlFor={`${idSchema.$id}Day`}>Day</label>
            <select
                autoComplete="false"
                name={`${idSchema.$id}Day`}
                id={`${idSchema.$id}Day`}
                value={day}
                onChange={(event) => this.handleChange('day', event.target.value)}>
              <option value=""/>
                {daysForSelectedMonth && daysForSelectedMonth.map(dayOpt => <option key={dayOpt} value={dayOpt}>{dayOpt}</option>)}
            </select>
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-year">
            <label htmlFor={`${idSchema.$id}Year`}>Year</label>
            <input type="number"
                autoComplete="false"
                name={`${idSchema.$id}Year`}
                id={`${idSchema.$id}Year`}
                max={new Date().getFullYear()}
                min="1900"
                pattern="[0-9]{4}"
                value={year}
                onChange={(event) => this.handleChange('year', event.target.value)}/>
          </div>
        </div>
      </div>
    );
  }
}
