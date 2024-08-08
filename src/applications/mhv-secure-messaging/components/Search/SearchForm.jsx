import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { clearSearchResults, runAdvancedSearch } from '../../actions/search';
import FilterBox from './FilterBox';
import { ErrorMessages, Paths, filterDescription } from '../../util/constants';
import { DateRangeOptions, DateRangeValues } from '../../util/inputContants';
import { dateFormat } from '../../util/helpers';

const SearchForm = props => {
  const { folder, keyword, resultsCount, query, threadCount } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermError, setSearchTermError] = useState(null);
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('any');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customFilter, setCustomFilter] = useState(false);
  const [filtersCleared, setFiltersCleared] = useState(false);
  const resultsCountRef = useRef();
  const filterBoxRef = useRef();
  const filterInputRef = useRef();
  const filterFormTitleRef = useRef();

  useEffect(
    () => {
      if (dateRange !== 'any' || category) {
        setCustomFilter(true);
      } else {
        setCustomFilter(false);
      }
    },
    [dateRange, category, customFilter],
  );

  useEffect(
    () => {
      if (resultsCount > 0) focusElement(resultsCountRef.current);
    },
    [resultsCount],
  );

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

  const handleSearch = () => {
    setFiltersCleared(false);
    if (filterBoxRef.current.checkFormValidity()) return;

    let relativeToDate;
    let relativeFromDate;
    let fromDateTime;
    let toDateTime;

    const queryData = {
      category,
      range: DateRangeOptions.find(item => dateRange === item.value),
      searchTerm,
    };

    if (
      dateRange === DateRangeValues.LAST3 ||
      dateRange === DateRangeValues.LAST6 ||
      dateRange === DateRangeValues.LAST12
    ) {
      relativeFromDate = moment.utc(getRelativeDate(dateRange)).startOf('day');
      relativeToDate = moment.utc(new Date()).endOf('day');
    } else if (dateRange === DateRangeValues.CUSTOM) {
      fromDateTime = moment.utc(fromDate).startOf('day');
      toDateTime = moment.utc(toDate).endOf('day');
    }

    if (searchTerm === '' && customFilter === false) {
      setSearchTermError(null);
      setSearchTermError(ErrorMessages.SearchForm.SEARCH_TERM_REQUIRED);
      return;
    }
    setSearchTermError(null);

    dispatch(
      runAdvancedSearch(
        folder,
        {
          category: category.value,
          fromDate: relativeFromDate || fromDateTime,
          toDate: relativeToDate || toDateTime,
        },
        searchTerm.toLowerCase(),
        queryData,
      ),
    );
  };

  const handleFilterClear = e => {
    e.preventDefault();
    dispatch(clearSearchResults());
    setFiltersCleared(true);
    setSearchTerm('');
    focusElement(filterFormTitleRef.current);
    setCategory('');
    setDateRange('any');
    setFromDate('');
    setToDate('');
  };

  const queryItem = (key, value) => {
    if (key?.label) {
      return (
        <li>
          "<strong>{`${key.label}`}</strong>, <strong>{value}</strong>"
        </li>
      );
    }
    return (
      <li>
        {key && `${key}: `}"<strong>{value}</strong>"
      </li>
    );
  };

  const dateRangeDisplay = () => {
    const rangeQueryText =
      query.queryData?.range?.value === DateRangeValues.LAST3 ||
      query.queryData?.range?.value === DateRangeValues.LAST6 ||
      query.queryData?.range?.value === DateRangeValues.LAST12
        ? query.queryData?.range
        : null;

    if (query.fromDate && query.toDate) {
      return queryItem(
        rangeQueryText,
        `${moment.utc(query.fromDate).format('MMMM Do YYYY')} to ${moment
          .utc(query.toDate)
          .format('MMMM Do YYYY')}`,
      );
    }
    return null;
  };

  const displayQuery = () => {
    let folderName;
    if (folder.name === 'Deleted') {
      folderName = 'Trash';
    } else {
      folderName = folder.name;
    }
    return (
      <>
        in <strong>{folderName}</strong> for{' '}
        {keyword && (
          <>
            "<strong>{query.queryData?.searchTerm}</strong>"
          </>
        )}
        <ul>
          {query.category &&
            queryItem('Category', query.queryData?.category?.label)}
          {dateRangeDisplay()}
        </ul>
      </>
    );
  };

  const FilterResults = () => {
    const results =
      resultsCount === undefined || !resultsCount ? null : (
        <>
          <strong className="search-results-count">
            {resultsCount?.toLocaleString()}
          </strong>
          {` match${resultsCount > 1 ? 'es' : ''}`} {displayQuery()}
        </>
      );
    return (
      <span
        ref={resultsCountRef}
        role="status"
        aria-live="polite"
        data-testid="search-message-folder-input-label"
        className={`vads-u-margin-top--4 ${
          resultsCount === undefined ? null : 'filter-results-in-folder'
        }`}
      >
        {results}
      </span>
    );
  };

  const handleFolderName = () => {
    if (folder.name === 'Deleted') {
      return 'Trash';
    }
    return folder.name;
  };
  const filterLabelHeading = `Filter messages in ${handleFolderName()} `;
  let filterLabelBody;
  if (location.pathname.includes('/drafts')) {
    filterLabelBody = filterDescription.noMsgId;
  } else {
    filterLabelBody = filterDescription.withMsgId;
  }

  return (
    <>
      <form
        data-testid="search-form"
        className="search-form"
        onSubmit={() => {
          handleSearch();
        }}
      >
        <h2
          ref={filterFormTitleRef}
          aria-describedby="filter-clear-success"
          onBlur={() => {
            if (filtersCleared) {
              setFiltersCleared(false);
            }
          }}
        >
          {filterLabelHeading}
        </h2>
        <>
          <div className="filter-input-box-container">
            <div className="filter-text-input">
              <va-text-input
                ref={filterInputRef}
                id="filter-input"
                label={filterLabelBody}
                class="filter-input-box"
                value={searchTerm}
                onInput={e => setSearchTerm(e.target.value)}
                data-testid="keyword-search-input"
                onKeyPress={e => {
                  if (e.key === 'Enter') handleSearch();
                }}
                data-dd-privacy="mask"
                error={searchTermError}
              />
            </div>
          </div>
        </>
        {!location.pathname.includes(Paths.DRAFTS) && (
          <va-additional-info
            trigger="What's a message ID?"
            class="message-id-info"
          >
            A message ID is a number we assign to each message. If you sign up
            for email notifications, we’ll send you an email each time you get a
            new message. These emails include the message ID.
          </va-additional-info>
        )}
        {threadCount > 0 && (
          <div>
            <FilterBox
              ref={filterBoxRef}
              keyword={keyword}
              category={category}
              setCategory={setCategory}
              dateRange={dateRange}
              setDateRange={setDateRange}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
            />
          </div>
        )}
        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <va-button
            text="Filter"
            primary
            class="filter-button"
            data-testid="filter-messages-button"
            onClick={e => {
              e.preventDefault();
              handleSearch();
            }}
          />
          {resultsCount !== undefined && (
            <va-button
              text="Clear Filters"
              secondary
              class="clear-filter-button vads-u-margin-top--1 small-screen:vads-u-margin-top--0"
              onClick={handleFilterClear}
            />
          )}
          {filtersCleared && (
            <span
              className="sr-only"
              aria-live="polite"
              id="filter-clear-success"
            >
              Filters succesfully cleared
            </span>
          )}
        </div>
      </form>
      <FilterResults />
    </>
  );
};

SearchForm.propTypes = {
  folder: PropTypes.object,
  keyword: PropTypes.string,
  query: PropTypes.object,
  resultsCount: PropTypes.number,
  threadCount: PropTypes.number,
};

export default SearchForm;
