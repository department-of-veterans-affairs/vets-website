import React from 'react';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';

import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';

class MessageSearchAdvanced extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdvancedSearchToggle = this.handleAdvancedSearchToggle.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleFromExactChange = this.handleFromExactChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleToExactChange = this.handleToExactChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleSubjectExactChange = this.handleSubjectExactChange.bind(this);
  }

  handleAdvancedSearchToggle() {
    this.props.onAdvancedSearch();
  }

  handleFromChange(field) {
    this.props.onFieldChange('from.field', field);
  }

  handleFromExactChange(field) {
    this.props.onFieldChange('from.exact', field);
  }

  handleToChange(field) {
    this.props.onFieldChange('to.field', field);
  }

  handleToExactChange(field) {
    this.props.onFieldChange('to.exact', field);
  }

  handleSubjectChange(field) {
    this.props.onFieldChange('subject.field', field);
  }

  handleSubjectExactChange(field) {
    this.props.onFieldChange('subject.exact', field);
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

    let senderOrRecipientField;

    if (this.props.hasRecipientField) {
      senderOrRecipientField = (
        <div className="msg-search-advanced-group">
          <ErrorableTextInput
              field={this.props.params.to.field}
              label="To"
              onValueChange={this.handleToChange}/>
          <ErrorableCheckbox
              checked={this.props.params.to.exact}
              label="Exact match"
              onValueChange={this.handleToExactChange}/>
        </div>
      );
    } else {
      senderOrRecipientField = (
        <div className="msg-search-advanced-group">
          <ErrorableTextInput
              field={this.props.params.from.field}
              label="From"
              onValueChange={this.handleFromChange}/>
          <ErrorableCheckbox
              checked={this.props.params.from.exact}
              label="Exact match"
              onValueChange={this.handleFromExactChange}/>
        </div>
      );
    }

    if (this.props.isVisible) {
      advancedSearchForm = (
        <fieldset className="msg-search-advanced-controls">
          <legend className="usa-sr-only">Search using additional criteria</legend>
          {senderOrRecipientField}

          <div className="msg-search-advanced-group">
            <ErrorableTextInput
                field={this.props.params.subject.field}
                label="Subject line"
                onValueChange={this.handleSubjectChange}/>
            <ErrorableCheckbox
                checked={this.props.params.subject.exact}
                label="Exact match"
                onValueChange={this.handleSubjectExactChange}/>
          </div>

          <fieldset className="msg-search-advanced-group">
            <div>
              <legend className="msg-search-date-range-legend">Date range</legend>
              <div className="msg-search-date-range">
                <label
                    className="usa-sr-only"
                    htmlFor="msg-search-date-start">Start date range</label>
                <DatePicker
                    id="msg-search-date-start"
                    onChange={this.handleStartDateChange}
                    placeholderText="MM/DD/YYYY"
                    selected={this.props.params.dateRange.start}/>
                <span>to</span>
                <label
                    className="usa-sr-only"
                    htmlFor="msg-search-date-end">End date range</label>
                <DatePicker
                    id="msg-search-date-end"
                    onChange={this.handleEndDateChange}
                    placeholderText="MM/DD/YYYY"
                    selected={this.props.params.dateRange.end}/>
              </div>
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
            className="msg-search-advanced-toggle"
            onClick={this.props.onAdvancedSearch}
            type="button">
          <i className={toggleClass}></i> Advanced Search</button>
      </div>);
  }
}

MessageSearchAdvanced.propTypes = {
  hasRecipientField: React.PropTypes.bool,
  isVisible: React.PropTypes.bool.isRequired,
  onAdvancedSearch: React.PropTypes.func.isRequired,
  onDateChange: React.PropTypes.func.isRequired,
  onFieldChange: React.PropTypes.func.isRequired,
  params: React.PropTypes.shape({
    dateRange: React.PropTypes.shape({
      start: React.PropTypes.object,
      end: React.PropTypes.object
    }),
    from: React.PropTypes.shape({
      field: React.PropTypes.shape({
        value: React.PropTypes.string,
        dirty: React.PropTypes.bool
      }),
      exact: React.PropTypes.bool
    }),
    to: React.PropTypes.shape({
      field: React.PropTypes.shape({
        value: React.PropTypes.string,
        dirty: React.PropTypes.bool
      }),
      exact: React.PropTypes.bool
    }),
    subject: React.PropTypes.shape({
      field: React.PropTypes.shape({
        value: React.PropTypes.string,
        dirty: React.PropTypes.bool
      }),
      exact: React.PropTypes.bool
    })
  }).isRequired
};

export default MessageSearchAdvanced;
