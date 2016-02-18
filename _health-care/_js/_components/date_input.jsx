import React from 'react';
import _ from 'lodash';

class DateInput extends React.Component {
  constructor() {
    super();
    this.state = {month: '', date: '', year: ''};
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('date-input-');
  }

  handleMonthChange(event) {
    this.setState({month: event.target.value});
  }

  handleDateChange(event) {
    this.setState({date: event.target.value});
  }

  handleYearChange(event) {
    this.setState({year: event.target.value});
  }

  render() {
    return (
        <div className="usa-date-of-birth">
          <div className="usa-datefield usa-form-group usa-form-group-month">
            <label htmlFor={this.id + "-month"}>Month</label>
            <input id={this.id + "-month"} aria-describedby="dobHint"
                className="usa-form-control" pattern="0?[1-9]|1[012]"
                type="number" min="1" max="12" value={this.state.month}
                onChange={this.handleMonthChange} />
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-day">
            <label htmlFor={this.id + "-date"}>Day</label>
            <input id={this.id + "-date"} aria-describedby="dobHint"
                className="usa-form-control" pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]"
                type="number" min="1" max="31" value={this.state.date}
                onChange={this.handleDateChange}  />
          </div>
          <div className="usa-datefield usa-form-group usa-form-group-year">
            <label htmlFor={this.id + "-year"}>Year</label>
            <input id={this.id + "-year"} aria-describedby="dobHint"
                className="usa-form-control" pattern="[0-9]{4}" type="number"
                min="1900" max={new Date().getFullYear()}
                value={this.state.year} onChange={this.handleYearChange} />
          </div>
        </div>
      )
  }
}

export default DateInput 
