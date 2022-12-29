import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  VaAdditionalInfo,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { foldersList as folders } from '../../selectors';
import { runBasicSearch } from '../../actions/search';

const DashboardSearch = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const foldersList = useSelector(folders);
  const [searchFolder, setSearchFolder] = useState(null);
  const [keyword, setKeyword] = useState('');

  const handleSearchSubmit = () => {
    dispatch(runBasicSearch(searchFolder, keyword.toLowerCase()));
    history.push('/search/results');
  };

  return (
    <div className="dashboard-search">
      <h2>Search for messages</h2>
      <div className="dashboard-search-card">
        <p>Search messages</p>
        <div className="vads-u-width--full vads-u-display--inline-block medium-screen:vads-u-display--flex vads-u-align-items--flex-end vads-u-justify-content--flex-start vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
          <VaSelect
            id="select-search-folder-dropdown"
            label="Folder:"
            name="search-folder"
            onVaSelect={e => {
              setSearchFolder(e.target.value);
            }}
          >
            <option value={null}> </option>
            {foldersList?.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </VaSelect>
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--flex-end vads-u-justify-content--flex-start">
            <VaTextInput
              label="Keyword (sender, subject line, or category)"
              name="keyword"
              onKeyPress={e => e.charCode === 13 && handleSearchSubmit()}
              onInput={e => setKeyword(e.target.value)}
              value={keyword}
              data-testid="search-keyword-text-input"
              id="search-keyword-text-input"
            />
            <button
              type="button"
              className="search-button"
              onClick={handleSearchSubmit}
            >
              <i className="fas fa-search" />
            </button>
          </div>
        </div>
        {/* TODO this is a placeholder until search components are refactored  */}
        <VaAdditionalInfo
          trigger="Advanced search"
          className="search-additinoal-info-adv"
        />
      </div>
    </div>
  );
};

export default DashboardSearch;
