import {
  VaButtonPair,
  VaDate,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import NeedHelpSection from './NeedHelpSection';

const DownloadDateRange = () => {
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateSelect = useCallback(
    e => {
      if (!e.detail.value) {
        setSelectedDate('');
        return;
      }

      setSelectedDate(e.detail.value);
    },
    [setSelectedDate],
  );

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
        />
      </div>
      <h2>Select date range</h2>
      <div className="vads-u-margin-bottom--3">
        <VaSelect label="Date range" onVaSelect={handleDateSelect} value="">
          <option value="3">Last 3 months</option>
          <option value="6">Last 6 months</option>
          <option value="12">Last 12 months</option>
          <option value="custom">Custom</option>
        </VaSelect>
      </div>
      {selectedDate === 'custom' && (
        <div className="vads-u-margin-bottom--3">
          <VaDate label="Start date" required="true" />
          <VaDate label="End date" required="true" />
        </div>
      )}
      <VaButtonPair
        continue
        onSecondaryClick={() => {
          history.push('/download');
        }}
        onPrimaryClick={() => {
          history.push('/download/record-type');
        }}
      />
      <NeedHelpSection />
    </div>
  );
};

export default DownloadDateRange;
