import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { subMonths, format } from 'date-fns';
import {
  VaButtonPair,
  VaDate,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import NeedHelpSection from './NeedHelpSection';
import { updateReportDateRange } from '../../actions/downloads';
import { pageTitles } from '../../util/constants';
import { sendDataDogAction } from '../../util/helpers';
import useFocusOutline from '../../hooks/useFocusOutline';

const DownloadDateRange = () => {
  const history = useHistory();

  const dateFilter = useSelector(state => state.mr.downloads?.dateFilter);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectionError, setSelectionError] = useState(null);
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [customToError, setCustomToError] = useState(null);
  const [customFromError, setCustomFromError] = useState(null);
  const dispatch = useDispatch();

  const ERROR_VALID_DATE_RANGE = 'Please select a valid date range.';
  const ERROR_PLEASE_ENTER_COMPLETE_DATE = 'Please enter a complete date';
  const ERROR_END_AFTER_START_DATE = 'End date must be on or after start date.';

  const handleDateSelect = useCallback(
    e => {
      if (!e.detail.value) {
        setSelectedDate('');
        return;
      }
      const { value } = e.detail;
      setSelectionError(null);
      setSelectedDate(value);
      const valMap = {
        any: 'All time',
        '3': 'Last 3 months',
        '6': 'Last 6 months',
        '12': 'Last 12 months',
        custom: 'Custom',
      };
      sendDataDogAction(`Date range option - ${valMap[value]}`);
    },
    [setSelectedDate],
  );

  const dateInputRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const progressBarRef = useRef(null);

  useFocusOutline(progressBarRef);

  useEffect(
    () => {
      if (dateFilter && dateFilter.option) {
        setSelectedDate(dateFilter.option);
        if (dateFilter.option === 'custom') {
          setCustomFromDate(dateFilter.fromDate);
          setCustomToDate(dateFilter.toDate);
        }
      }
    },
    [dateFilter],
  );

  useEffect(
    () => {
      setTimeout(() => {
        const heading = progressBarRef?.current?.shadowRoot?.querySelector(
          'h2',
        );
        focusElement(heading);
      }, 400);
      updatePageTitle(pageTitles.DOWNLOAD_FORMS_PAGES_TITLE);
    },
    [progressBarRef],
  );

  const handleBack = () => {
    history.push('/download');
    sendDataDogAction('Date range  - Back');
  };

  const handleSubmit = () => {
    const checkFrom = new Date(customFromDate);
    const checkTo = new Date(customToDate);

    if (selectedDate === '') {
      setSelectionError(ERROR_VALID_DATE_RANGE);
      focusElement('#input-error-message', {}, dateInputRef.current.shadowRoot);
      return;
    }
    let fromDate;
    let toDate;
    const currentDate = new Date();
    if (selectedDate === 'custom') {
      if (customFromDate === '' && customToDate === '') {
        setCustomFromError(ERROR_PLEASE_ENTER_COMPLETE_DATE);
        setCustomToError(ERROR_PLEASE_ENTER_COMPLETE_DATE);
        focusElement('#error-message', {}, startDateRef.current.shadowRoot);
      }
      if (customFromDate === '') {
        setCustomFromError(ERROR_PLEASE_ENTER_COMPLETE_DATE);
        focusElement('#error-message', {}, startDateRef.current.shadowRoot);
        return;
      }
      if (customToDate === '') {
        setCustomToError(ERROR_PLEASE_ENTER_COMPLETE_DATE);
        focusElement('#error-message', {}, endDateRef.current.shadowRoot);
        return;
      }
      if (checkFrom > checkTo) {
        setCustomToError(ERROR_END_AFTER_START_DATE);
        focusElement('#error-message', {}, endDateRef.current.shadowRoot);
        return;
      }
      fromDate = customFromDate;
      toDate = customToDate;
    } else if (selectedDate === 'any') {
      fromDate = 'any';
      toDate = 'any';
    } else {
      // For preset date ranges like 3, 6, or 12 months
      fromDate = format(
        subMonths(currentDate, parseInt(selectedDate, 10)),
        'yyyy-MM-dd',
      );
      toDate = format(currentDate, 'yyyy-MM-dd');
    }
    // Dispatch the update once the user clicks Continue
    dispatch(updateReportDateRange(selectedDate, fromDate, toDate));
    history.push('/download/record-type');
    sendDataDogAction('Date range  - Continue');
  };

  const checkForStartEndError = () => {
    return customToError === ERROR_END_AFTER_START_DATE;
  };

  return (
    <div>
      <h1>Select records and download report</h1>
      <div
        style={{
          margin: '1.9rem 0',
        }}
      >
        <va-segmented-progress-bar
          current={1}
          heading-text="Select date range"
          total={3}
          header-level={2}
          ref={progressBarRef}
        />
      </div>

      <form>
        <div className="vads-u-margin-bottom--3">
          <VaSelect
            label="Date range"
            onVaSelect={handleDateSelect}
            value={selectedDate}
            data-testid="va-select-date-range"
            error={selectionError}
            ref={dateInputRef}
          >
            <option value="any">All time</option>
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
            <option value="custom">Custom</option>
          </VaSelect>
        </div>
        {selectedDate === 'custom' && (
          <div className="vads-u-margin-bottom--3">
            <VaDate
              label="Start date"
              required="true"
              error={customFromError}
              data-testid="va-date-start-date"
              value={customFromDate}
              onDateChange={e => {
                if (e.target.value) {
                  const val = e.target.value;
                  const [year, month, day] = e.target.value?.split('-');
                  if (parseInt(year, 10) >= 1900 && month && day) {
                    setCustomFromError(null);
                    setCustomFromDate(val);
                  }
                }
              }}
              ref={startDateRef}
            />
            <VaDate
              label="End date"
              required="true"
              error={customToError}
              data-testid="va-date-end-date"
              value={customToDate}
              onDateChange={e => {
                const val = e.target.value;
                const [year, month, day] = e.target.value.split('-');
                if (parseInt(year, 10) >= 1900 && month && day) {
                  setCustomToError(null);
                  setCustomToDate(val);
                }
              }}
              invalidDay={checkForStartEndError}
              invalidMonth={checkForStartEndError}
              invalidYear={checkForStartEndError}
              ref={endDateRef}
            />
          </div>
        )}
        <VaButtonPair
          continue
          onSecondaryClick={handleBack}
          onPrimaryClick={handleSubmit}
        />
      </form>
      <NeedHelpSection />
    </div>
  );
};

export default DownloadDateRange;
