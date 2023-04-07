import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { runBasicSearch } from '../../actions/search';
import FilterBox from '../MessageActionButtons/FilterBox';

const SearchForm = props => {
  const { folder, keyword, resultsCount, query } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const folders = useSelector(state => state.sm.folders.folderList);
  const [searchTerm, setSearchTerm] = useState('');
  // const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedOpen] = useState(false);

  const [searchTermError, setSearchTermError] = useState(null);

  useEffect(
    () => {
      setSearchTerm(keyword);
    },
    [keyword],
  );

  const handleSearch = e => {
    setSearchTermError(null);

    if (!searchTerm) {
      setSearchTermError('Please enter a search term');
      return;
    }
    dispatch(runBasicSearch(folder.folderId, e.target.value.toLowerCase()));
    if (!resultsCount) {
      history.push('/search/results');
    }
  };

  const queryItem = (key, value) => {
    return (
      <li>
        {key && `${key}: `}"<strong>{value}</strong>"
      </li>
    );
  };

  const dateRange = () => {
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
    if (keyword) {
      return (
        <>
          for "<strong>{keyword}</strong>" in <strong>{folder.name}</strong>
        </>
      );
    }
    return (
      <>
        in <strong>{folder.name}</strong> for
        <ul>
          {query.messageId && queryItem('Message ID', query.messageId)}
          {query.sender && queryItem('From', query.sender)}
          {query.subject && queryItem('Subject', query.subject)}
          {query.category && queryItem('Category', query.category)}
          {dateRange()}
        </ul>
      </>
    );
  };

  const label = () => {
    const labelString =
      resultsCount === undefined ? (
        <>
          <div>
            Search your <strong>{folder.name}</strong> messages folder
          </div>
          <div className="keyword-help-text">
            Keyword (Sender, subject line, or category)
          </div>
        </>
      ) : (
        <>
          <strong className="search-results-count">
            {resultsCount.toLocaleString()}
          </strong>{' '}
          results {displayQuery()}
        </>
      );
    if (advancedOpen)
      return (
        <p className="vads-u-margin--0">
          <strong>Search messages</strong>
        </p>
      );
    return (
      <label
        htmlFor="search-message-folder-input"
        data-testid="search-message-folder-input-label"
        className={
          resultsCount === undefined
            ? 'keyword-search-label'
            : 'search-in-description'
        }
      >
        {labelString}
      </label>
    );
  };

  return (
    <div className="search-form">
      {label()}

      {!advancedOpen && (
        <>
          {searchTermError && (
            <div className="error-message" role="alert">
              <span className="sr-only">Error</span>
              {searchTermError}
            </div>
          )}
          <VaSearchInput
            buttonText={window.innerWidth <= 481 ? null : 'Search'}
            onInput={e => setSearchTerm(e.target.value)}
            onSubmit={handleSearch}
            value={searchTerm}
            label="search-message-folder-input"
            data-testid="keyword-search-input"
          />
        </>
      )}

      {folders && (
        <>
          <FilterBox />
        </>
      )}
    </div>
  );
};

SearchForm.propTypes = {
  folder: PropTypes.object,
  keyword: PropTypes.string,
  query: PropTypes.object,
  resultsCount: PropTypes.number,
};

export default SearchForm;
