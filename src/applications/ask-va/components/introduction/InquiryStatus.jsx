import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { envApiUrl, mockTestingFlagForAPI } from '../../constants';
import { mockInquiryStatusResponse } from '../../utils/mockData';
import {
  getVAStatusFromCRM,
  getVAStatusIconAndMessage,
} from '../../config/helpers';

export default function InquiryStatus() {
  const [inquiryData, setInquiryData] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchReferenceNumber, setSearchReferenceNumber] = useState('');

  const getApiData = url => {
    setHasError(false);

    // Mocking the API response for testing when searching for reference number
    // A-20250106-308944
    if (
      mockTestingFlagForAPI &&
      searchReferenceNumber === 'A-20250106-308944'
    ) {
      setInquiryData(mockInquiryStatusResponse.data);
      return Promise.resolve();
    }

    return apiRequest(url)
      .then(res => {
        setInquiryData(res.data);
      })
      .catch(() => setHasError(true));
  };

  const handleSearchByReferenceNumber = async () => {
    const url = `${envApiUrl}/ask_va_api/v0/inquiries/${searchReferenceNumber}/status`;
    await getApiData(url);
    const headingElement = document.querySelector(
      '[data-testid="status-message"] h3, [data-testid="error-message"] p:first-child',
    );
    if (headingElement) headingElement.focus();
  };

  const handleSearchInputChange = async e => {
    setHasError(false);
    setInquiryData(false);
    const searchInputValue = e.target.value.trim();
    setSearchReferenceNumber(searchInputValue);
  };

  const questionStatus = () => {
    if (hasError) {
      return (
        <div className="vads-u-margin-y--3" data-testid="error-message">
          <p tabIndex="-1">
            We didn’t find a question with reference number "
            <span className="vads-u-font-weight--bold">
              {searchReferenceNumber}
            </span>
            ." Check your reference number and try again.
          </p>
          <p>
            If it still doesn’t work, ask the same question again and include
            your original reference number.
          </p>
        </div>
      );
    }

    if (inquiryData?.attributes?.status) {
      const { status } = inquiryData.attributes;
      const AskVAStatus = getVAStatusFromCRM(status);
      const classes = `vads-u-border-left--5px vads-u-padding--0p5 ${
        getVAStatusIconAndMessage[AskVAStatus]?.color
      }`;
      return (
        <div data-testid="status-message">
          <h3
            className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2"
            tabIndex="-1"
          >
            Showing the status for reference number "
            <span className="vads-u-font-weight--bold">
              {searchReferenceNumber}
            </span>
            "
          </h3>
          <p>
            <span className="vads-u-font-weight--bold">Status: </span>{' '}
            {AskVAStatus}
            {getVAStatusIconAndMessage[AskVAStatus]?.icon}
          </p>
          <div className={classes}>
            {getVAStatusIconAndMessage[AskVAStatus]?.message && (
              <p className="vads-u-margin-left--2">
                {getVAStatusIconAndMessage[AskVAStatus].message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="vads-u-margin-top--6">
      <h2 className="vads-u-margin-top--0">
        Check the status of your question
      </h2>
      <p className="vads-u-margin--0 vads-u-margin-bottom--1">
        Enter your reference number
      </p>
      <VaSearchInput
        big
        buttonText="Search"
        label="Reference number"
        onInput={handleSearchInputChange}
        onSubmit={handleSearchByReferenceNumber}
        value={searchReferenceNumber}
      />
      <div className="vads-u-margin-bottom--7">{questionStatus()}</div>
    </div>
  );
}
