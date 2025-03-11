import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectionError, setSelectionError] = useState(null);
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [customToError, setCustomToError] = useState(null);
  const [customFromError, setCustomFromError] = useState(null);
  const dispatch = useDispatch();

  const ERROR_VALID_DATE_RANGE = 'Please select a valid date range.';
  const ERROR_VALID_START_DATE = 'Please enter a valid start date.';
  const ERROR_VALID_END_DATE = 'Please enter a valid end date.';

  const handleDateSelect = useCallback(
    e => {
      if (!e.detail.value) {
        setSelectedDate('');
        return;
      }
      const { value } = e.detail;
      setSelectionError(null);
      setSelectedDate(value);
      if (value === 'any') {
        dispatch(updateReportDateRange('any', 'any', 'any'));
      } else if (value !== 'custom') {
        const currentDate = new Date();
        dispatch(
          updateReportDateRange(
            value,
            format(subMonths(currentDate, value), 'yyyy-MM-dd'),
            format(currentDate, 'yyyy-MM-dd'),
          ),
        );
      }
      const valMap = {
        any: 'Any',
        '3': 'Last 3 months',
        '6': 'Last 6 months',
        '12': 'Last 12 months',
        custom: 'Custom',
      };
      sendDataDogAction(`Date range option - ${valMap[value]}`);
    },
    [setSelectedDate, dispatch],
  );

  const dateInputRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const progressBarRef = useRef(null);

  useFocusOutline(progressBarRef);

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

  useEffect(
    () => {
      if (customFromDate !== '' && customToDate !== '') {
        dispatch(updateReportDateRange('custom', customFromDate, customToDate));
      }
    },
    [customFromDate, customToDate, dispatch],
  );

  const handleBack = () => {
    history.push('/download');
    sendDataDogAction('Date range  - Back');
  };

  const handleSubmit = () => {
    if (selectedDate === '') {
      setSelectionError(ERROR_VALID_DATE_RANGE);
      focusElement('#input-error-message', {}, dateInputRef.current.shadowRoot);
      return;
    }
    if (selectedDate === 'custom') {
      if (customFromDate === '') {
        setCustomFromError(ERROR_VALID_START_DATE);
        focusElement('#error-message', {}, startDateRef.current.shadowRoot);
        return;
      }
      if (customToDate === '') {
        setCustomToError(ERROR_VALID_END_DATE);
        focusElement('#error-message', {}, endDateRef.current.shadowRoot);
        return;
      }
    }
    history.push('/download/record-type');
    sendDataDogAction('Date range  - Continue');
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
            value=""
            data-testid="va-select-date-range"
            error={selectionError}
            ref={dateInputRef}
          >
            <option value="any">Any</option>
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
              onDateChange={e => {
                if (e.target.value) {
                  const [year, month, day] = e.target.value?.split('-');
                  if (parseInt(year, 10) >= 1900 && month && day) {
                    setCustomFromError(null);
                    setCustomFromDate(e.target.value);
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
              onDateChange={e => {
                const [year, month, day] = e.target.value.split('-');
                if (parseInt(year, 10) >= 1900 && month && day) {
                  setCustomToError(null);
                  setCustomToDate(e.target.value);
                }
              }}
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
