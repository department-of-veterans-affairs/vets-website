import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { runBasicSearch } from '../../actions/search';

const CondensedSearchForm = props => {
  const { folder, keyword, resultsCount, query } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(
    () => {
      setSearchTerm(keyword);
    },
    [keyword],
  );

  const handleSearch = e => {
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
    const labelString = resultsCount ? (
      <>
        <strong className="search-results-count">
          {resultsCount.toLocaleString()}
        </strong>{' '}
        results {displayQuery()}
      </>
    ) : (
      `Search the ${folder.name} messages folder`
    );
    return (
      <label
        htmlFor="search-message-folder-input"
        className="search-in-description"
      >
        {labelString}
      </label>
    );
  };

  return (
    <div className="condensed-search-form">
      {label()}

      <va-search-input
        onInput={e => setSearchTerm(e.target.value)}
        onSubmit={handleSearch}
        value={searchTerm}
        label="search-message-folder-input"
      />

      {resultsCount && (
        <div className="condensed-advanced-search-button">
          <Link to="/search/advanced">Advanced search</Link>
        </div>
      )}
    </div>
  );
};

CondensedSearchForm.propTypes = {
  folder: PropTypes.object,
  keyword: PropTypes.string,
  query: PropTypes.object,
  resultsCount: PropTypes.number,
};

export default CondensedSearchForm;
