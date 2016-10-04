import React from 'react';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';

import { makeField } from '../../common/model/fields';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';

class MessageSearchAdvanced extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdvancedSearchToggle = this.handleAdvancedSearchToggle.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleAdvancedSearchToggle() {
    this.props.onAdvancedSearch();
  }

  // `date` is a Moment.js object, not a timestamp.
  handleStartDateChange(date) {
    this.props.onDateChange(date, true);
  }

  handleEndDateChange(date) {
    this.props.onDateChange(date, false);
  }

  render() {
    let advancedSearchForm;

    const toggleClass = classNames({
      fa: true,
      'fa-chevron-up': this.props.isVisible,
      'fa-chevron-down': !this.props.isVisible
    });

    if (this.props.isVisible) {
      advancedSearchForm = (
        <fieldset className="msg-search-advanced-controls">
          <legend className="usa-sr-only">Search using additional criteria</legend>
          <div className="va-flex va-flex--ctr msg-search-advanced-group">
            <ErrorableTextInput
                field={makeField('')}
                label="From"
                onValueChange={() => {}}/>

            <ErrorableCheckbox
                field={makeField('')}
                label="Exact match"
                onValueChange={() => {}}/>
          </div>

          <div className="va-flex va-flex--ctr msg-search-advanced-group">
            <ErrorableTextInput
                field={makeField('')}
                label="Subject line"
                onValueChange={() => {}}/>
            <ErrorableCheckbox
                field={makeField('')}
                label="Exact match"
                onValueChange={() => {}}/>
          </div>

          <fieldset className="va-flex va-flex--ctr msg-search-advanced-group">
            <legend className="msg-search-date-range-legend">Date range</legend>
            <div className="msg-search-date-range">
              <label
                  className="usa-sr-only"
                  htmlFor="msg-search-date-start">Start date range</label>
              <DatePicker
                  id="msg-search-date-start"
                  onChange={this.handleStartDateChange}
                  placeholderText="MM/DD/YYYY"
                  selected={this.props.startDateRange}/>
              <span>to</span>
              <label
                  className="usa-sr-only"
                  htmlFor="msg-search-date-end">End date range</label>
              <DatePicker
                  id="msg-search-date-end"
                  onChange={this.handleEndDateChange}
                  placeholderText="MM/DD/YYYY"
                  selected={this.props.endDateRange}/>
            </div>
          </fieldset>
          <button
              className="msg-search-advanced-submit"
              type="submit">Search</button>
        </fieldset>);
    }

    return (
      <div className="msg-search-advanced">
        {advancedSearchForm}
        <button
            className="msg-search-advanced-toggle usa-button-unstyled"
            onClick={this.props.onAdvancedSearch}
            type="button">
          <i className={toggleClass}></i> Advanced Search</button>
      </div>);
  }
}

MessageSearchAdvanced.propTypes = {
  endDateRange: React.PropTypes.object,
  isVisible: React.PropTypes.bool.isRequired,
  onAdvancedSearch: React.PropTypes.func.isRequired,
  onDateChange: React.PropTypes.func,
  startDateRange: React.PropTypes.object
};

export default MessageSearchAdvanced;
