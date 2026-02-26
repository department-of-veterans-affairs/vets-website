import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { mockTestingFlagForAPI } from '../../constants';
import { mockInquiryStatusResponse } from '../../utils/mockData';
import { getVAStatusFromCRM } from '../../config/helpers';
import {
  clockIcon,
  folderIcon,
  starIcon,
  successIcon,
} from '../../utils/helpers';
import { getInquiryStatus } from '../../utils/api';

const uiDetailsMap = {
  New: {
    icon: starIcon,
    message: "We received your question. We'll review it soon.",
    color: 'primary',
  },
  'In progress': {
    icon: clockIcon,
    message: "We're reviewing your question.",
    color: 'grey',
  },
  Replied: {
    icon: successIcon,
    message:
      "We either answered your question or didn't have enough information to answer your question. If you need more help, ask a new question.",
    color: 'green',
  },
  Reopened: {
    icon: clockIcon,
    message: "We received your reply. We'll respond soon.",
    color: 'grey',
  },
  Closed: {
    icon: folderIcon,
    message: 'We closed this question after 60 days without any updates.',
    color: 'grey',
  },
};

/**
 * @typedef {Object} StatusResponse
 * @property {Object} data
 * @property {string | null} data.id
 * @property {string} data.type
 * @property {Object} data.attributes
 * @property {string} data.attributes.status
 */

export default function StatusChecker() {
  const [statusData, setStatusData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [displayQuery, setDisplayQuery] = useState('');

  const handleSubmit = e => {
    const query = e.target.value.trim();
    setIsLoading(true);
    setDisplayQuery(query);
    setHasError(false);
    setStatusData({});

    // Mocking the API response for testing when searching for reference number
    // A-20250106-308944
    if (mockTestingFlagForAPI && query === 'A-20250106-308944') {
      setStatusData(mockInquiryStatusResponse.data);
      setIsLoading(false);
    } else {
      getInquiryStatus(query)
        .then(res => {
          setStatusData(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setHasError(true);
        });
    }
  };

  useEffect(() => {
    focusElement('#status-message');
  });

  const questionStatus = () => {
    if (isLoading) {
      return (
        <va-loading-indicator
          data-testid="loading-indicator"
          message="Loading question status..."
        />
      );
    }

    if (hasError) {
      return (
        <div className="vads-u-margin-y--3" id="status-message">
          <p tabIndex="-1">
            We didn’t find a question with reference number "
            <span className="vads-u-font-weight--bold">{displayQuery}</span>
            ." Check your reference number and try again.
          </p>
          <p>
            If it still doesn’t work, ask the same question again and include
            your original reference number.
          </p>
        </div>
      );
    }

    if (statusData?.attributes?.status) {
      const rawStatus = statusData.attributes.status;
      const uiStatus = getVAStatusFromCRM(rawStatus);
      const uiDetails = uiDetailsMap[uiStatus];

      return (
        <div>
          <h3
            id="status-message"
            className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--2"
            tabIndex="-1"
          >
            Showing the status for reference number "
            <span className="vads-u-font-weight--bold">{displayQuery}</span>"
          </h3>
          <div className="vads-u-border-bottom--1px vads-u-border-color--gray-light" />
          <p>
            <span className="vads-u-font-weight--bold">Status: </span>
            {uiStatus} {uiDetails?.icon}
          </p>
          {uiDetails?.message && (
            <div
              className={`vads-u-border-left--5px vads-u-padding--0p5 vads-u-border-color--${
                uiDetails?.color
              }`}
            >
              <p className="vads-u-margin-left--2">{uiDetails.message}</p>
            </div>
          )}
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
        onSubmit={handleSubmit}
      />
      <div className="vads-u-margin-bottom--7">{questionStatus()}</div>
    </div>
  );
}
