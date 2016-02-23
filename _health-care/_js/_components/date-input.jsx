import React from 'react';
import _ from 'lodash';

class DateInput extends React.Component {
  constructor() {
    super();
    this.state = {hasError: false};
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
      }

    // Update UI based on validation.
    if (!this.validate(date.day, date.month, date.year)) {
      this.setState({hasError: true});
    } else {
      this.setState({hasError: false});
    }

    // Publish change up.
    this.props.onUserInput(date);
  }

  validate(day, month, year) {
    // Use the date class to see if the date parses back sanely as a
    // validation check. Not sure this is a great idea...
    const adjustedMonth = Number(month) - 1;  // JS Date object 0-indexes months. WTF.
    const date = new Date(year, adjustedMonth, day);
    return date.getDate() === Number(day) &&
      date.getMonth() === adjustedMonth &&
      date.getFullYear() === Number(year);
  }

  render() {
    const error_class = this.state.hasError ? "usa-input-error" : ""
    return (
      <div className={error_class}>
        <div className="usa-date-of-birth">
          <div className="usa-datefield usa-form-group usa-form-group-month">
            <label htmlFor={this.id + "-month"}>Month</label>
            <input id={this.id + "-month"} aria-describedby="dobHint"
                className="usa-form-control" pattern="0?[1-9]|1[012]"
                type="number" min="1" max="12" value={this.props.date.month}
                ref="month" onChange={this.handleChange}/>
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-day">
            <label htmlFor={this.id + "-day"}>Day</label>
            <input id={this.id + "-day"} aria-describedby="dobHint"
                className="usa-form-control" pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]"
                type="number" min="1" max="31" value={this.props.date.day}
                ref="day" onChange={this.handleChange}/>
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-year">
            <label htmlFor={this.id + "-year"}>Year</label>
            <input id={this.id + "-year"} aria-describedby="dobHint"
                className="usa-form-control" pattern="[0-9]{4}" type="number"
                min="1900" max={new Date().getFullYear()}
                value={this.props.date.year} ref="year"
                 onChange={this.handleChange}/>
          </div>
        </div>
      </div>
    )
  }
}

export default DateInput
