import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AlertBackgroundBox from '../shared/AlertBackgroundBox';
import { runBasicSearch } from '../../actions/search';

const BasicSearchForm = props => {
  const { folders, toggleAdvancedSearch, testingKeyword } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const [foldersList, setFoldersList] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [folder, setFolder] = useState(0);

  const [keywordError, setKeywordError] = useState(null);

  useEffect(
    () => {
      if (folders) setFoldersList(folders);
    },
    [folders],
  );

  const handleFormSubmit = e => {
    e.preventDefault();
    setKeywordError(null);

    if (!keyword && !testingKeyword) {
      setKeywordError('Please enter a keyword');
      return;
    }

    dispatch(runBasicSearch(folder, keyword.toLowerCase()));
    history.push('/search/results');
  };

  return (
    <form className="search-form" onSubmit={handleFormSubmit}>
      <AlertBackgroundBox closeable />

      <VaTextInput
        label="Enter keyword"
        name="keyword"
        onKeyPress={e => e.charCode === 13 && handleFormSubmit(e)}
        onInput={e => setKeyword(e.target.value)}
        value={keyword}
        class="textField"
        error={keywordError}
        data-testid="keyword-text-input"
        required
      />

      <VaSelect
        id="folder-dropdown"
        label="Folder"
        name="folder"
        class="selectField"
        value={folder}
        onVaSelect={e => setFolder(e.detail.value)}
        data-testid="folder-dropdown"
      >
        {foldersList.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </VaSelect>

      <button
        type="submit"
        className="search-messages-button"
        data-testid="search-messages-button"
      >
        <i className="fas fa-search" aria-hidden="true" />
        <span
          className="search-messages-button-text"
          data-testid="basic-search-submit"
        >
          Search
        </span>
      </button>

      <button
        type="button"
        className="link-button advanced-search-toggle"
        data-testid="advanced-search-link"
        onClick={toggleAdvancedSearch}
      >
        Or try the advanced search.
      </button>
    </form>
  );
};

BasicSearchForm.propTypes = {
  folders: PropTypes.any,
  submitBasicSearch: PropTypes.func,
  testingKeyword: PropTypes.string,
  toggleAdvancedSearch: PropTypes.func,
};

export default BasicSearchForm;
