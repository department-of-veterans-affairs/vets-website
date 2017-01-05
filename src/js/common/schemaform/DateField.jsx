import React from 'react';
import _ from 'lodash/fp';
import moment from 'moment';

import { months, days } from '../utils/options-for-select.js';

function formatDayMonth(val) {
  if (!val || !val.length || !Number(val)) {
    return 'XX';
  } else if (val.length === 1) {
    return `0${val}`;
  }

  return val.toString();
}

function formatYear(val) {
  if (!val || !val.length) {
    return 'XXXX';
  }

  const yearDate = moment(val, 'YYYY');
  if (!yearDate.isValid()) {
    return 'XXXX';
  }

  return yearDate.format('YYYY');
}

function formatPartialDate({ month, day, year }) {
  return `${formatYear(year)}-${formatDayMonth(month)}-${formatDayMonth(day)}`;
}

export default class DateField extends React.Component {
  constructor(props) {
    super(props);
    this.formatDate = this.formatDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = { month: '', day: '', year: '', touched: { month: false, day: false, year: false } };
  }

  handleBlur(field) {
    const newState = _.set(['touched', field], true, this.state);
    this.setState(newState);
    if (newState.touched.year && newState.touched.month && newState.touched.day) {
      this.props.onBlur(this.props.idSchema.$id, formatPartialDate(newState));
    }
  }

  handleChange(field, value) {
    let newState = _.set(field, value, this.state);
    if (field !== 'year') {
      newState = _.set(['touched', field], true, newState);
    }
    this.setState(newState);
    if (!this.props.required || newState.month && newState.day && newState.year) {
      this.props.onChange(formatPartialDate(newState));
    }
  }

  formatDate({ month, day, year }) {
    return `${year || 'XXXX'}-${month || 'XX'}-${day || 'XX'}`;
  }

  render() {
    const { idSchema } = this.props;
    const { month, day, year } = this.state;
    let daysForSelectedMonth;

    if (month) {
      daysForSelectedMonth = days[month];
    }
    return (
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
              onBlur={() => this.handleBlur('year')}
              onChange={(event) => this.handleChange('year', event.target.value)}/>
        </div>
      </div>
    );
  }
}
