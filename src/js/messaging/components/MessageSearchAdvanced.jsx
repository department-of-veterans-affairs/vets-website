import React from 'react';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';

import { makeField } from '../../common/model/fields';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';

class MessageSearchAdvanced extends React.Component {
  render() {
    const toggleClass = classNames({
      fa: true,
      'fa-chevron-up': this.props.isOpen,
      'fa-chevron-down': !this.props.isOpen
    });

    return (
      <div className="msg-search-advanced">
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
                  onChange={() => {}}
                  placeholderText="MM/DD/YYYY"/>
              <span>to</span>
              <label
                  className="usa-sr-only"
                  htmlFor="msg-search-date-end">End date range</label>
              <DatePicker
                  id="msg-search-date-end"
                  onChange={() => {}}
                  placeholderText="MM/DD/YYYY"/>
            </div>
          </fieldset>
          <button
              className="msg-search-advanced-submit"
              type="submit">Search</button>
        </fieldset>
        <button
            className="msg-search-advanced-toggle usa-button-unstyled"
            onClick={() => {}}
            type="button">
          <i className={toggleClass}></i> Advanced Search</button>
      </div>);
  }
}

MessageSearchAdvanced.propTypes = {
  isOpen: React.PropTypes.bool.isRequired
};

export default MessageSearchAdvanced;
