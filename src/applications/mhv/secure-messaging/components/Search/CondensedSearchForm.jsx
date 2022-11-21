import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { runBasicSearch } from '../../actions/search';

const CondensedSearchForm = props => {
  const { folder, keyword, resultsView } = props;
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
    if (!resultsView) {
      history.push('/search/results');
    }
  };

  const label = () => {
    const labelString = resultsView
      ? folder.name
      : `Search the ${folder.name} messages folder`;
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

      {resultsView && (
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
  resultsView: PropTypes.bool,
};

export default CondensedSearchForm;
