import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { DateRanges, SelectCategories } from '../../util/inputContants';
import { runAdvancedSearch } from '../../actions/search';

const SearchMessagesForm = props => {
  const { folders } = props;
  const dispatch = useDispatch();

  const defaultFoldersList = [{ id: 0, name: ' ' }];
  const [foldersList, setFoldersList] = useState(defaultFoldersList);

  const [folder, setFolder] = useState('');
  const [messageId, setMessageId] = useState('');
  const [senderName, setSenderName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('');

  const [, setFolderError] = useState(null);

  useEffect(
    () => {
      if (folders) setFoldersList(folders);
    },
    [folders],
  );

  const handleFormSubmit = e => {
    e.preventDefault();
    setFolderError(null);
    if (Number.isNaN(folder)) {
      setFolderError('Please select a folder');
      return;
    }

    const formData = {};
    if (folder) formData.folder = folder;
    if (messageId) formData.messageId = messageId;
    if (senderName) formData.senderName = senderName;
    if (subject) formData.subject = subject;
    if (category) formData.category = category;
    if (dateRange) formData.dateRange = dateRange;

    dispatch(runAdvancedSearch(formData));
  };

  return (
    <form className="search-form" onSubmit={handleFormSubmit}>
      <VaSelect
        id="folder-dropdown"
        label="Folder"
        name="folder"
        class="selectField"
        value={folder}
        onVaSelect={e => setFolder(e.detail.value)}
        data-testid="search-select"
      >
        {foldersList.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </VaSelect>

      <va-text-input
        label="Message ID"
        name="messageId"
        onBlur={e => setMessageId(e.target.value)}
        class="textField"
      />
      <va-text-input
        label="From"
        name="from"
        onBlur={e => setSenderName(e.target.value)}
        class="textField"
      />
      <va-text-input
        label="Subject"
        name="subject"
        onBlur={e => setSubject(e.target.value)}
        class="textField"
      />

      <VaSelect
        id="category-dropdown"
        label="Category"
        name="category"
        class="selectField"
        value={category}
        onVaSelect={e => setCategory(e.detail.value)}
        data-testid="search-select"
      >
        {SelectCategories.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </VaSelect>

      <VaSelect
        id="date-range-dropdown"
        label="Date range"
        name="dateRange"
        class="selectField"
        value={category}
        onVaSelect={e => setDateRange(e.detail.value)}
        data-testid="search-select"
      >
        {DateRanges.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </VaSelect>

      <div className="advanced-search-actions">
        <button type="submit">Advanced Search</button>
        <button type="button" className="reset">
          Reset Search
        </button>
      </div>
    </form>
  );
};

SearchMessagesForm.propTypes = {
  advancedSearchOpen: PropTypes.bool,
  folders: PropTypes.any,
};

export default SearchMessagesForm;
