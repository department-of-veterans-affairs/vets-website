import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import AlertBackgroundBox from '../shared/AlertBackgroundBox';

const SearchMessagesForm = props => {
  const { folders, toggleAdvancedSearch, submitBasicSearch } = props;

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

    if (!keyword) {
      setKeywordError('Please enter a keyword');
      return;
    }

    submitBasicSearch({ folder, keyword });
  };

  return (
    <form className="search-form" onSubmit={handleFormSubmit}>
      <AlertBackgroundBox closeable />

      <VaTextInput
        label="Enter keyword"
        name="keyword"
        onKeyPress={e => e.charCode === 13 && handleFormSubmit(e)}
        onInput={e => setKeyword(e.target.value)}
        class="textField"
        error={keywordError}
        required
      />

      <VaSelect
        id="folder-dropdown"
        label="Folder"
        name="folder"
        class="selectField"
        value={folder}
        onVaSelect={e => setFolder(e.detail.value)}
        data-testid="compose-select"
      >
        {foldersList.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </VaSelect>

      <button type="submit" className="search-messages-button">
        <i className="fas fa-search" aria-hidden="true" />
        <span className="search-messages-button-text">Search</span>
      </button>

      <button
        type="button"
        className="link-button advanced-search-toggle"
        onClick={toggleAdvancedSearch}
      >
        Or try the advanced search.
      </button>
    </form>
  );
};

SearchMessagesForm.propTypes = {
  folders: PropTypes.any,
  submitBasicSearch: PropTypes.func,
  toggleAdvancedSearch: PropTypes.func,
};

export default SearchMessagesForm;
