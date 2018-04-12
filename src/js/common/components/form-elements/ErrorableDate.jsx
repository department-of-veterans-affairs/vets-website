/* eslint-disable jsx-a11y/label-has-for */
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { set } from 'lodash/fp';
import moment from 'moment';

import ErrorableSelect from '@department-of-veterans-affairs/jean-pants/ErrorableSelect';
import ErrorableNumberInput from './ErrorableNumberInput';

import ToolTip from './ToolTip';

import { isDirtyDate, isValidPartialDate, isNotBlankDateField, validateCustomFormComponent } from '../../utils/validations';
import { months, days } from '../../utils/options-for-select.js';

/**
 * A date input field that accepts values for month and year
 *
 * Props:
 * `required` - boolean. Render marker indicating field is required.
 * `validation` - object or array. Result of custom validation. Should include a valid prop and a message prop
 * `label` - string. Label for entire question.
 * `name` - string. Used to create unique name attributes for each input.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `date` - object. Date value. Should have month, day, and year props
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableDate extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('date-input-');
  }

  handleChange(path, update) {
    let date = set(path, update, this.props.date);
    if (!date.month.value) {
      date = set('day.value', '', date);
    }

    this.props.onValueChange(date);
  }

  render() {
    const { day, month, year } = this.props.date;

    let daysForSelectedMonth = [];
    if (month.value) {
      daysForSelectedMonth = days[month.value];
    }

    // we want to do validations in a specific order, so we show the message
    // that makes the most sense to the user
    let isValid = true;
    let errorMessage;
    if (isDirtyDate(this.props.date)) {
      // make sure the user enters a full date first, if required
      if (this.props.required && !isNotBlankDateField(this.props.date)) {
        isValid = false;
        errorMessage = this.props.requiredMessage;
      // make sure the user has entered a minimally valid date
      } else if (!isValidPartialDate(day.value, month.value, year.value)) {
        isValid = false;
        errorMessage = this.props.invalidMessage;
      } else {
        const validationResult = validateCustomFormComponent(this.props.validation);
        isValid = validationResult.valid;
        errorMessage = validationResult.message;
      }
    }

    let errorSpanId;
    let errorSpan = '';
    if (!isValid) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = (
        <span className="usa-input-error-message" role="alert" id={errorSpanId}>
          <span className="sr-only">Error</span> {errorMessage}
        </span>
      );
    }

    // Adds ToolTip if text is provided.
    let toolTip;
    if (this.props.toolTipText) {
      toolTip = (
        <ToolTip
          tabIndex={this.props.tabIndex}
          toolTipText={this.props.toolTipText}/>
      );
    }

    return (
      <div className={!isValid && 'input-error-date'}>
        <label>
          {this.props.label ? this.props.label : 'Date of birth'}
          {this.props.required && <span className="form-required-span">*</span>}
        </label>
        {errorSpan}
        <div className={isValid ? undefined : 'usa-input-error form-error-date'}>
          <div className="usa-date-of-birth row">
            <div className="form-datefield-month">
              <ErrorableSelect errorMessage={isValid ? undefined : ''}
                autocomplete="false"
                label="Month"
                name={`${this.props.name}Month`}
                options={months}
                value={month}
                onValueChange={(update) => {this.handleChange('month', update);}}/>
            </div>
            <div className="form-datefield-day">
              <ErrorableSelect errorMessage={isValid ? undefined : ''}
                autocomplete="false"
                label="Day"
                name={`${this.props.name}Day`}
                options={daysForSelectedMonth}
                value={day}
                onValueChange={(update) => {this.handleChange('day', update);}}/>
            </div>
            <div className="usa-datefield usa-form-group usa-form-group-year">
              <ErrorableNumberInput errorMessage={isValid ? undefined : ''}
                autocomplete="false"
                label="Year"
                name={`${this.props.name}Year`}
                max={moment().add(100, 'year').year()}
                min="1900"
                pattern="[0-9]{4}"
                field={year}
                onValueChange={(update) => {this.handleChange('year', update);}}/>
            </div>
          </div>
          {toolTip}
        </div>
      </div>
    );
  }
}

ErrorableDate.propTypes = {
  required: PropTypes.bool,
  validation: PropTypes.shape({
    valid: PropTypes.bool,
    message: PropTypes.string
  }),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  date: PropTypes.shape({
    day: PropTypes.shape({
      value: PropTypes.string,
      dirty: PropTypes.bool,
    }),
    month: PropTypes.shape({
      value: PropTypes.string,
      dirty: PropTypes.bool,
    }),
    year: PropTypes.shape({
      value: PropTypes.string,
      dirty: PropTypes.bool,
    })
  }).isRequired,
  onValueChange: PropTypes.func.isRequired,
  toolTipText: PropTypes.string,
  requiredMessage: PropTypes.string,
  invalidMessage: PropTypes.string
};

ErrorableDate.defaultProps = {
  requiredMessage: 'Please provide a response',
  invalidMessage: 'Please provide a valid date'
};

export default ErrorableDate;
