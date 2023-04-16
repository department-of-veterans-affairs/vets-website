import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaDate,
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  DateRangeValues,
  DateRangeOptions,
  SelectCategories,
} from '../../util/inputContants';
import { runAdvancedSearch } from '../../actions/search';
import { dateFormat } from '../../util/helpers';

const FilterBox = props => {
  const {
    folders,
    testingSubmit,
    testingDateRange,
    testingFromDate,
    testingToDate,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const folderId = useSelector(state => state.sm.folders.folder.folderId);
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('any');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [fromDateError, setFromDateError] = useState('');
  const [toDateError, setToDateError] = useState('');
  const [formError, setFormError] = useState('');

  const getRelativeDate = range => {
    const today = new Date();

    if (range === DateRangeValues.LAST3) {
      today.setMonth(today.getMonth() - 3);
    } else if (range === DateRangeValues.LAST6) {
      today.setMonth(today.getMonth() - 6);
    } else if (range === DateRangeValues.LAST12) {
      today.setMonth(today.getMonth() - 12);
    }

    return dateFormat(today, 'yyyy-MM-DD');
  };

  const checkFormValidity = () => {
    // TODO: add validation for ALL blank fields
    let formInvalid;
    if (dateRange === 'custom' || testingDateRange) {
      if (!fromDate && !testingFromDate) {
        formInvalid = true;
        setFromDateError('Please enter a start date');
      }
      if (!toDate && !testingToDate) {
        formInvalid = true;
        setToDateError('Please enter an end date');
      }
      if (
        (fromDate || testingFromDate) &&
        (toDate || testingToDate) &&
        moment(toDate || testingToDate).isBefore(fromDate || testingFromDate)
      ) {
        formInvalid = true;
        setFromDateError('Start date must be on or before end date');
        setToDateError('End date must be on or after start date');
      }
    } else if (dateRange === 'any' && !category) {
      formInvalid = true;
      setFormError(true);
    }
    return formInvalid;
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    const formInvalid = testingSubmit || checkFormValidity();
    if (formInvalid) return;

    const todayDateTime = moment(new Date()).format();
    const offset = todayDateTime.substring(todayDateTime.length - 6);
    let relativeToDate;
    let relativeFromDate;
    let fromDateTime;
    let toDateTime;

    if (
      dateRange === DateRangeValues.LAST3 ||
      dateRange === DateRangeValues.LAST6 ||
      dateRange === DateRangeValues.LAST12
    ) {
      relativeToDate = moment(new Date());
      relativeFromDate = `${getRelativeDate(dateRange)}T00:00:00${offset}`;
    } else if (dateRange === DateRangeValues.CUSTOM) {
      fromDateTime = `${fromDate}T00:00:00${offset}`;
      toDateTime = `${toDate}T23:59:59${offset}`;
    }

    const folderData = folders.find(item => +item.id === +folderId);
    dispatch(
      runAdvancedSearch(folderData, {
        category,
        fromDate: relativeFromDate || fromDateTime,
        toDate: relativeToDate || toDateTime,
      }),
    );
    history.push('/search/results');
  };

  return (
    <form
      className="advanced-search-form filter-box"
      onSubmit={handleFormSubmit}
    >
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
            <li>Message ID</li>
            <li>From</li>
            <li>Subject</li>
            <li>Category</li>
          </ul>
        </VaModal>
      )}

      <va-accordion open-single>
        <va-accordion-item id="first">
          <h6 slot="headline" className="headline-text">
            Additional filters
          </h6>
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

            {(dateRange === 'custom' || testingDateRange) && (
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
              data-testid="advanced-search-submit"
              text="Filter"
              onClick={handleFormSubmit}
            />
          </div>
        </va-accordion-item>
      </va-accordion>
    </form>
  );
};

FilterBox.propTypes = {
  folders: PropTypes.any,
  testingDateRange: PropTypes.any,
  testingFromDate: PropTypes.any,
  testingSubmit: PropTypes.any,
  testingToDate: PropTypes.any,
};

export default FilterBox;
