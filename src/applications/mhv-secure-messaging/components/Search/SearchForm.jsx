import React, { useEffect, useMemo, useRef, useState } from 'react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { clearSearchResults, runAdvancedSearch } from '../../actions/search';
import FilterBox from './FilterBox';
import {
  DefaultFolders,
  ErrorMessages,
  Paths,
  filterDescription,
} from '../../util/constants';
import { DateRangeOptions, DateRangeValues } from '../../util/inputContants';
import { dateFormat, isCustomFolder } from '../../util/helpers';

const FilterStatus = {
  DEFAULT: 'filter-default',
  APPLIED: 'filter-applied-success',
  CLEARED: 'filter-clear-success',
};

const SearchForm = props => {
  const { folder, keyword, resultsCount, query, threadCount } = props;
  const mhvSecureMessagingFilterAccordion = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingFilterAccordion
      ],
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermError, setSearchTermError] = useState(null);
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('any');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customFilter, setCustomFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.DEFAULT);
  const resultsCountRef = useRef();
  const filterBoxRef = useRef();
  const filterInputRef = useRef();
  const filterFormTitleRef = useRef();

  useEffect(() => {
    if (dateRange !== 'any' || category) {
      setCustomFilter(true);
    } else {
      setCustomFilter(false);
    }
  }, [dateRange, category, customFilter]);

  useEffect(() => {
    if (resultsCount > 0) focusElement(resultsCountRef.current);
  }, [resultsCount]);

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
    if (filterBoxRef.current.checkFormValidity()) {
      setSearchTermError(null);
      return;
    }

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
      focusElement(filterInputRef.current);
      return;
    }
    setSearchTermError(null);
    filterBoxRef.current.clearDateErrors();

    setFilterStatus(FilterStatus.APPLIED);

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
    setFilterStatus(FilterStatus.CLEARED);
    setSearchTerm('');
    setSearchTermError(null);
    filterBoxRef.current.clearDateErrors();
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
        data-dd-action-name="Filter Messages matches label"
        className={`vads-u-margin-top--4 ${
          resultsCount === undefined ? null : 'filter-results-in-folder'
        }`}
      >
        {results}
      </span>
    );
  };

  const isCustom = useMemo(
    () => isCustomFolder(folder.folderId),
    [folder.folderId],
  );

  const ddTitle = useMemo(() => {
    return `${isCustom ? 'Custom Folder' : `${folder.name}`}`;
  }, [folder.name, isCustom]);
  const ddPrivacy = useMemo(() => `${isCustom ? 'mask' : 'allow'}`, [isCustom]);

  const filterLabelHeading = useMemo(() => {
    if (isCustom) {
      return `Filter messages in ${folder.name}`;
    }
    return `Filter messages in ${
      folder.name === 'Deleted' ? 'trash' : folder.name.toLowerCase()
    }`;
  }, [folder.name, isCustom]);

  const filterLabelBody = useMemo(() => {
    return folder.folderId === DefaultFolders.DRAFTS.id
      ? filterDescription.noMsgId
      : filterDescription.withMsgId;
  }, [folder.folderId]);

  const getAriaDescribedBy = useMemo(() => {
    if (filterStatus === FilterStatus.CLEARED) return 'filter-clear-success';
    if (filterStatus === FilterStatus.APPLIED) return 'filter-applied-success';
    return 'filter-default';
  }, [filterStatus]);

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
          className="vads-u-font-size--h3 vads-u-margin-top--0"
          ref={filterFormTitleRef}
          aria-describedby={getAriaDescribedBy}
          onBlur={() => {
            if (
              filterStatus === FilterStatus.CLEARED ||
              filterStatus === FilterStatus.APPLIED
            ) {
              setFilterStatus(FilterStatus.DEFAULT);
            }
          }}
          data-dd-privacy={ddPrivacy}
          data-dd-action-name={`Filter Messages in ${ddTitle}`}
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
                data-dd-action-name="Input Field - Filter"
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
            class="message-id-info vads-u-margin-top--1"
            data-dd-action-name="What's a message ID? Expandable Info"
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
        <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
          <va-button
            text="Apply filters"
            primary
            class="filter-button"
            data-testid="filter-messages-button"
            data-dd-action-name="Filter Button"
            onClick={e => {
              e.preventDefault();
              handleSearch();
            }}
          />
          {/* using toggle to hide this btn temporarily until filter accordion redesign is completed */}
          {mhvSecureMessagingFilterAccordion ? (
            <va-button
              text="Clear filters"
              secondary
              class="clear-filter-button vads-u-margin-top--1 mobile-lg:vads-u-margin-top--0"
              onClick={handleFilterClear}
              dd-action-name="Clear filters Button"
            />
          ) : (
            resultsCount !== undefined && (
              <va-button
                text="Clear filters"
                secondary
                class="clear-filter-button vads-u-margin-top--1 mobile-lg:vads-u-margin-top--0"
                onClick={handleFilterClear}
                dd-action-name="Clear filters Button"
              />
            )
          )}
          <span className="sr-only" aria-live="polite" id={filterStatus}>
            {filterStatus === FilterStatus.DEFAULT && 'No filters applied'}
            {filterStatus === FilterStatus.APPLIED &&
              'Filters successfully applied'}
            {filterStatus === FilterStatus.CLEARED &&
              'Filters successfully cleared'}
          </span>
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
