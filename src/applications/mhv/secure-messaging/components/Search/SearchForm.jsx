import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { runAdvancedSearch } from '../../actions/search';
import FilterBox from './FilterBox';
import { ErrorMessages } from '../../util/constants';
import { DateRangeValues } from '../../util/inputContants';
import { dateFormat } from '../../util/helpers';

const SearchForm = props => {
  const { folder, keyword, resultsCount, query } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const folders = useSelector(state => state.sm.folders.folderList);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermError, setSearchTermError] = useState(null);
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('any');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customFilter, setCustomFilter] = useState(false);
  const resultsCountRef = useRef();

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
      setSearchTerm(keyword);
    },
    [keyword],
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
          category,
          fromDate: relativeFromDate || fromDateTime,
          toDate: relativeToDate || toDateTime,
        },
        searchTerm.toLowerCase(),
      ),
    );
  };

  const queryItem = (key, value) => {
    return (
      <li>
        {key && `${key}: `}"<strong>{value}</strong>"
      </li>
    );
  };

  const dateRangeDisplay = () => {
    if (query.fromDate && query.toDate) {
      return queryItem(
        null,
        `${moment(query.fromDate).format('MMMM Do YYYY')} to ${moment(
          query.toDate,
        ).format('MMMM Do YYYY')}`,
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
            "<strong>{keyword}</strong>"
          </>
        )}
        <ul>
          {query.category && queryItem('Category', query.category)}
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
          </strong>{' '}
          matches {displayQuery()}
        </>
      );
    return (
      <span
        ref={resultsCountRef}
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
    filterLabelBody =
      'Enter information from one of these fields: to, from, or subject';
  } else {
    filterLabelBody =
      'Enter information from one of these fields: to, from, message ID, or subject';
  }

  return (
    <>
      <div className="search-form">
        <h2>{filterLabelHeading}</h2>
        <>
          {searchTermError && (
            <div className="error-message" role="alert">
              <span className="sr-only">Error</span>
              {searchTermError}
            </div>
          )}
          <div className="filter-input-box-container">
            <div className="filter-text-input">
              <va-text-input
                id="filter-input"
                label={filterLabelBody}
                className="filter-input-box"
                message-aria-describedby="filter text input"
                value={searchTerm}
                onInput={e => setSearchTerm(e.target.value)}
                aria-label={filterLabelHeading + filterLabelBody}
                data-testid="keyword-search-input"
              />
            </div>
            <div className="basic-filter-button">
              <button
                type="button"
                className="usa-button-primary filter-button"
                onClick={e => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                Filter
              </button>
            </div>
          </div>
        </>
        {!location.pathname.includes('/drafts') && (
          <va-additional-info
            trigger="What's a message ID?"
            class="message-id-info"
          >
            A message ID is a number we assign to each message. If you sign up
            for email notifications, we’ll send you an email each time you get a
            new message. These emails include the message ID.
          </va-additional-info>
        )}
        {folders && (
          <div>
            <FilterBox
              folders={folders}
              keyword={keyword}
              handleSearch={handleSearch}
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
      </div>
      <FilterResults />
    </>
  );
};

SearchForm.propTypes = {
  folder: PropTypes.object,
  keyword: PropTypes.string,
  query: PropTypes.object,
  resultsCount: PropTypes.number,
};

export default SearchForm;
