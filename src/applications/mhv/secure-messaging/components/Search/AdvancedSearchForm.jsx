import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  VaDate,
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory } from 'react-router-dom';
import {
  DateRangeValues,
  DateRangeOptions,
  SelectCategories,
} from '../../util/inputContants';
import { runAdvancedSearch } from '../../actions/search';
import { dateFormat } from '../../util/helpers';

const SearchMessagesForm = props => {
  const { folders } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const [foldersList, setFoldersList] = useState([]);

  const [folder, setFolder] = useState(0);
  const [messageId, setMessageId] = useState('');
  const [senderName, setSenderName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('any');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [fromDateError, setFromDateError] = useState('');
  const [toDateError, setToDateError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(
    () => {
      if (folders) setFoldersList(folders);
    },
    [folders],
  );

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

  const checkFormValidity = () => {
    let formInvalid;
    if (dateRange === 'custom') {
      if (!fromDate) {
        formInvalid = true;
        setFromDateError('Please enter a start date');
      }
      if (!toDate) {
        formInvalid = true;
        setToDateError('Please enter an end date');
      }
    } else if (
      dateRange === 'any' &&
      !messageId &&
      !senderName &&
      !subject &&
      !category
    ) {
      formInvalid = true;
      setFormError(true);
    }
    return formInvalid;
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    const formInvalid = checkFormValidity();
    if (formInvalid) return;

    let relativeToDate;
    let relativeFromDate;

    if (
      dateRange === DateRangeValues.LAST3 ||
      dateRange === DateRangeValues.LAST6 ||
      dateRange === DateRangeValues.LAST12
    ) {
      relativeToDate = dateFormat(new Date(), 'yyyy-MM-DD');
      relativeFromDate = getRelativeDate(dateRange);
    }

    const folderData = folders.find(item => item.id === folder);

    dispatch(
      runAdvancedSearch(folderData, {
        messageId,
        sender: senderName,
        subject,
        category,
        fromDate: relativeFromDate || fromDate,
        toDate: relativeToDate || toDate,
      }),
    );
    history.push('/search/results');
  };

  return (
    <form className="search-form" onSubmit={handleFormSubmit}>
      {formError && (
        <VaModal
          modalTitle="Invalid search"
          onPrimaryButtonClick={() => setFormError()}
          primaryButtonText="Ok"
          status="error"
          visible
        >
          <p>
            Please use at least one of the following search fields or choose a
            date range other than 'any'.
          </p>
          <ul>
            <li>Message ID</li>
            <li>From</li>
            <li>Subject</li>
            <li>Category</li>
          </ul>
        </VaModal>
      )}
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
        value={dateRange}
        onVaSelect={e => setDateRange(e.detail.value)}
        data-testid="search-select"
      >
        {DateRangeOptions.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </VaSelect>

      {dateRange === 'custom' && (
        <div className="fromToDatesContainer">
          <div className="fromToDates">
            <VaDate
              label="Start date"
              name="discharge-date"
              onDateChange={e => setFromDate(e.target.value)}
              required
              error={fromDateError}
            />
            <VaDate
              label="End date"
              name="discharge-date"
              onDateChange={e => setToDate(e.target.value)}
              required
              error={toDateError}
            />
          </div>
        </div>
      )}

      <div className="advanced-search-actions">
        <button type="submit" data-testid="advanced-search-submit">
          Advanced Search
        </button>
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
