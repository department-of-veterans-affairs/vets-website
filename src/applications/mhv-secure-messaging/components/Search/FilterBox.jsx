import React, {
  forwardRef,
  useCallback,
  useRef,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  VaDate,
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { DateRangeOptions, SelectCategories } from '../../util/inputContants';
import { ErrorMessages } from '../../util/constants';
import { isValidDateValue } from '../../util/helpers';

const FilterBox = forwardRef((props, ref) => {
  const {
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
  const [isItemExpanded, setIsItemExpanded] = useState(false);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const filterRef = useRef(null);

  const handleCategoryChange = e => {
    setCategory(SelectCategories.find(item => item?.value === e.detail.value));
    if (e.target?.children) {
      const selectedOption = Array.from(e.target.children).find(
        item => item.value === e.detail.value,
      );
      datadogRum.addAction(`Filter category option - ${selectedOption?.label}`);
    }
  };

  const handleDateRangeChange = e => {
    const { value } = e.detail;
    setDateRange(value);
    datadogRum.addAction(`${value} Months Date Range Dropdown`);
  };

  const checkFormValidity = () => {
    const today = new Date();
    let formInvalid;
    const invalidInputs = [];
    if (dateRange === 'custom') {
      // Clear error states first, then set only for invalid fields
      setFromDateError('');
      setToDateError('');

      if (!isValidDateValue(fromDate)) {
        formInvalid = true;
        setFromDateError(ErrorMessages.SearchForm.START_DATE_REQUIRED);
        invalidInputs.push(fromDateRef);
      }
      if (!isValidDateValue(toDate)) {
        formInvalid = true;
        setToDateError(ErrorMessages.SearchForm.END_DATE_REQUIRED);
        invalidInputs.push(toDateRef);
      }
      if (
        isValidDateValue(fromDate) &&
        isValidDateValue(toDate) &&
        moment(toDate).isBefore(fromDate)
      ) {
        formInvalid = true;
        setFromDateError(ErrorMessages.SearchForm.START_DATE_AFTER_END_DATE);
        setToDateError(ErrorMessages.SearchForm.END_DATE_BEFORE_START_DATE);
        invalidInputs.push(fromDateRef);
      }
      if (parseInt(toDate?.substring(0, 4), 10) > today.getFullYear()) {
        formInvalid = true;
        setToDateError(
          ErrorMessages.SearchForm.END_YEAR_GREATER_THAN_CURRENT_YEAR,
        );
        invalidInputs.push(toDateRef);
      }

      if (formInvalid) {
        if (!isItemExpanded) {
          setIsItemExpanded(true);
        }
        setTimeout(() => {
          focusElement(invalidInputs[0]?.current);
        }, 10);
      }
    } else {
      formInvalid = false;
    }
    return formInvalid;
  };

  useImperativeHandle(ref, () => ({
    checkFormValidity() {
      return checkFormValidity();
    },
    clearDateErrors() {
      setFromDateError('');
      setToDateError('');
    },
  }));

  const handleToggle = useCallback(
    target => {
      if (
        target === filterRef.current ||
        target.tagName === 'VA-ACCORDION-ITEM'
      ) {
        return setIsItemExpanded(!isItemExpanded);
      }
      // If text is not defined, null
      return null;
    },
    [filterRef, isItemExpanded],
  );

  return (
    <div className="advanced-search-form filter-box">
      {formError && (
        <VaModal
          modalTitle="Invalid search"
          onPrimaryButtonClick={() => setFormError()}
          onCloseEvent={() => {
            setFormError();
            datadogRum.addAction('Invalid Search Modal Closed');
          }}
          primaryButtonText="Ok"
          status="error"
          visible
          data-dd-action-name="Invalid Search Modal"
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

      <va-accordion data-dd-action-name="Accordion - Filter" open-single>
        <va-accordion-item
          data-testid="accordion-item-filter"
          id="additional-filter-accordion"
          onClick={e => handleToggle(e.target)}
          open={isItemExpanded}
        >
          <h3 slot="headline" className="headline-text" ref={filterRef}>
            {isItemExpanded ? 'Hide filters' : 'Show filters'}
          </h3>
          <div className="filter-content">
            <VaSelect
              id="category-dropdown"
              label="Category"
              name="category"
              class="advanced-search-field"
              value={category?.value}
              onVaSelect={handleCategoryChange}
              data-testid="category-dropdown"
              data-dd-action-name="Filter category dropdown"
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
              onVaSelect={handleDateRangeChange}
              data-testid="date-range-dropdown"
              data-dd-action-name="Filter Date Range Dropdown"
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
                    class="advanced-search-field vads-u-font-weight--bold"
                    onDateChange={e => setFromDate(e.target.value)}
                    value={fromDate}
                    required
                    error={fromDateError}
                    data-testid="date-start"
                    ref={fromDateRef}
                  />
                  <VaDate
                    label="End date"
                    name="discharge-date"
                    class="advanced-search-field vads-u-font-weight--bold"
                    onDateChange={e => setToDate(e.target.value)}
                    value={toDate}
                    required
                    error={toDateError}
                    data-testid="date-end"
                    ref={toDateRef}
                  />
                </div>
              </div>
            )}
          </div>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
});

FilterBox.propTypes = {
  category: PropTypes.any,
  dateRange: PropTypes.any,
  fromDate: PropTypes.any,
  setCategory: PropTypes.func,
  setDateRange: PropTypes.func,
  setFromDate: PropTypes.func,
  setToDate: PropTypes.func,
  toDate: PropTypes.any,
};

export default FilterBox;
