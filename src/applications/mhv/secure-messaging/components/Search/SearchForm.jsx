import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { runBasicSearch } from '../../actions/search';
import FilterBox from './FilterBox';

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

  const FilterResults = () => {
    const results =
      resultsCount === undefined ? null : (
        <>
          <strong className="search-results-count">
            {resultsCount.toLocaleString()}
          </strong>{' '}
          results {displayQuery()}
        </>
      );
    return (
      <label
        data-testid="search-message-folder-input-label"
        className={
          resultsCount === undefined ? null : 'filter-results-in-folder'
        }
      >
        {results}
      </label>
    );
  };

  const filterLabelHeading = `Filter messages in ${folder.name} `;
  const filterLabelBody =
    'Enter information from one of these fields: to, from, message ID, or subject';

  return (
    <>
      <div className="search-form">
        <h3>{filterLabelHeading}</h3>
        <div className="keyword-help-text">{filterLabelBody}</div>
        {!advancedOpen && (
          <>
            {searchTermError && (
              <div className="error-message" role="alert">
                <span className="sr-only">Error</span>
                {searchTermError}
              </div>
            )}
            <VaSearchInput
              buttonText={window.innerWidth <= 481 ? null : 'Filter'}
              onInput={e => setSearchTerm(e.target.value)}
              onSubmit={handleSearch}
              value={searchTerm}
              label={filterLabelHeading + filterLabelBody}
              data-testid="keyword-search-input"
            />
          </>
        )}
        <va-additional-info
          trigger="What's a message ID?"
          class="message-id-info"
        >
          A message ID is a number we assign to each message. If you sign up for
          email notifications, we’ll send you an email each time you get a new
          message. These emails include the message ID.
        </va-additional-info>

        {folders && (
          <div>
            <FilterBox folderId={folder.folderId} />
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
