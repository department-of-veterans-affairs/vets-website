import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';

import { months, days } from '../../utils/options-for-select.js';
import { formatISOPartialDate, parseISODate } from '../helpers';

function getEmptyState(value) {
  return {
    value: parseISODate(value),
    touched: {
      month: false,
      day: false,
      year: false
    }
  };
}

export default class DateWidget extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = getEmptyState(this.props.value);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.formContext.pagePerItemIndex !== this.props.formContext.pagePerItemIndex) {
      this.setState(getEmptyState(newProps.value));
    }
  }

  handleBlur(field) {
    const newState = _.set(['touched', field], true, this.state);
    this.setState(newState, () => {
      if (newState.touched.year && newState.touched.month && newState.touched.day) {
        this.props.onBlur(this.props.id);
      }
    });
  }

  handleChange(field, value) {
    let newState = _.set(['value', field], value, this.state);
    newState = _.set(['touched', field], true, newState);

    this.setState(newState, () => {
      if (this.props.required && (!newState.value.month || !newState.value.day || !newState.value.year)) {
        this.props.onChange();
      } else {
        this.props.onChange(formatISOPartialDate(newState.value));
      }
    });
  }

  render() {
    const { id } = this.props;
    const { month, day, year } = this.state.value;
    let daysForSelectedMonth;

    if (month) {
      daysForSelectedMonth = days[month];
    }
    return (
      <div className="usa-date-of-birth row">
        <div className="form-datefield-month">
          <label className="input-date-label" htmlFor={`${id}Month`}>Month</label>
          <select
            autoComplete="false"
            name={`${id}Month`}
            id={`${id}Month`}
            value={month}
            onChange={(event) => this.handleChange('month', event.target.value)}>
            <option value=""/>
            {months.map(mnth => <option key={mnth.value} value={mnth.value}>{mnth.label}</option>)}
          </select>
        </div>
        <div className="form-datefield-day">
          <label className="input-date-label" htmlFor={`${id}Day`}>Day</label>
          <select
            autoComplete="false"
            name={`${id}Day`}
            id={`${id}Day`}
            value={day}
            onChange={(event) => this.handleChange('day', event.target.value)}>
            <option value=""/>
            {daysForSelectedMonth && daysForSelectedMonth.map(dayOpt => <option key={dayOpt} value={dayOpt}>{dayOpt}</option>)}
          </select>
        </div>
        <div className="usa-datefield usa-form-group usa-form-group-year">
          <label className="input-date-label" htmlFor={`${id}Year`}>Year</label>
          <input type="number"
            autoComplete="false"
            name={`${id}Year`}
            id={`${id}Year`}
            max="3000"
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

DateWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string
};
