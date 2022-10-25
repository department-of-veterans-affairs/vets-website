import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CondensedSearchForm = props => {
  const { folder, keyword, submitBasicSearch } = props;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(
    () => {
      setSearchTerm(keyword);
    },
    [keyword],
  );

  const handleSearch = e => {
    submitBasicSearch({ folder: folder.folderId, keyword: e.target.value });
  };

  return (
    <div className="condensed-search-form">
      <div className="search-in-description">{folder.name}</div>

      <va-search-input
        onInput={e => setSearchTerm(e.target.value)}
        onSubmit={handleSearch}
        value={searchTerm}
      />

      <div className="condensed-advanced-search-button">
        <Link to="/search/advanced">Advanced search</Link>
      </div>
    </div>
  );
};

CondensedSearchForm.propTypes = {
  folder: PropTypes.object,
  keyword: PropTypes.string,
  submitBasicSearch: PropTypes.func,
};

export default CondensedSearchForm;
