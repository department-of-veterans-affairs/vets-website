import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaDate,
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
import { DateRangeOptions, SelectCategories } from '../../util/inputContants';
import { ErrorMessages } from '../../util/constants';

const FilterBox = props => {
  const {
    handleSearch,
    category,
    setCategory,
    dateRange,
    setDateRange,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = props;

  const [fromDateError, setFromDateError] = useState('');
  const [toDateError, setToDateError] = useState('');
  const [formError, setFormError] = useState('');

  const checkFormValidity = () => {
    const today = new Date();
    // TODO: add validation for ALL blank fields
    let formInvalid;
    if (dateRange === 'custom') {
      if (!fromDate) {
        formInvalid = true;
        setFromDateError(ErrorMessages.SearchForm.START_DATE_REQUIRED);
      }
      if (!toDate) {
        formInvalid = true;
        setToDateError(ErrorMessages.SearchForm.END_DATE_REQUIRED);
      }
      if (fromDate && toDate && moment(toDate).isBefore(fromDate)) {
        formInvalid = true;
        setFromDateError(ErrorMessages.SearchForm.START_DATE_AFTER_END_DATE);
        setToDateError(ErrorMessages.SearchForm.END_DATE_BEFORE_START_DATE);
      }
      if (parseInt(toDate.substring(0, 4), 10) > today.getFullYear()) {
        formInvalid = true;
        setToDateError(
          ErrorMessages.SearchForm.END_YEAR_GREATER_THAN_CURRENT_YEAR,
        );
      }
    }
    return formInvalid;
  };

  const handleFilterMessages = e => {
    e.preventDefault();
    const formInvalid = checkFormValidity();
    if (formInvalid) return;

    handleSearch(true);
  };

  return (
    <form className="advanced-search-form filter-box" onSubmit={handleSearch}>
      {formError && (
        <VaModal
          modalTitle="Invalid search"
          onPrimaryButtonClick={() => setFormError()}
          onCloseEvent={() => setFormError()}
          primaryButtonText="Ok"
          status="error"
          visible
        >
          <p>
            Please use at least one of the following search fields or choose a
            date range other than 'any'.
          </p>
          <ul>
            <li>Category</li>
          </ul>
        </VaModal>
      )}

      <va-accordion open-single>
        <va-accordion-item id="first">
          <h3 slot="headline" className="headline-text">
            Additional filters
          </h3>
          <div className="filter-content">
            <VaSelect
              id="category-dropdown"
              label="Category"
              name="category"
              class="advanced-search-field"
              value={category}
              onVaSelect={e => setCategory(e.detail.value)}
              data-testid="category-dropdown"
            >
              {SelectCategories.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </VaSelect>

            <VaSelect
              id="date-range-dropdown"
              label="Date range"
              name="dateRange"
              class="advanced-search-field"
              value={dateRange}
              onVaSelect={e => setDateRange(e.detail.value)}
              data-testid="date-range-dropdown"
            >
              {DateRangeOptions.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </VaSelect>

            {dateRange === 'custom' && (
              <div className="fromToDatesContainer">
                <div className="fromToDates">
                  <VaDate
                    label="Start date"
                    name="discharge-date"
                    class="advanced-search-field"
                    onDateChange={e => setFromDate(e.target.value)}
                    value={fromDate}
                    required
                    error={fromDateError}
                    data-testid="date-start"
                  />
                  <VaDate
                    label="End date"
                    name="discharge-date"
                    class="advanced-search-field"
                    onDateChange={e => setToDate(e.target.value)}
                    value={toDate}
                    required
                    error={toDateError}
                    data-testid="date-end"
                  />
                </div>
              </div>
            )}

            <va-button
              class="custom-filter-button"
              data-testid="filter-messages-button"
              text="Filter"
              onClick={handleFilterMessages}
            />
          </div>
        </va-accordion-item>
      </va-accordion>
    </form>
  );
};

FilterBox.propTypes = {
  folders: PropTypes.any,
  handleSearch: PropTypes.func,
  category: PropTypes.any,
  setCategory: PropTypes.func,
  dateRange: PropTypes.any,
  setDateRange: PropTypes.func,
  fromDate: PropTypes.any,
  setFromDate: PropTypes.func,
  toDate: PropTypes.any,
  setToDate: PropTypes.func,
};

export default FilterBox;
