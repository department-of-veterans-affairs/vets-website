import React, { useEffect, useState } from 'react';
import { ServerErrorAlert } from '../config/helpers';
import { mockTestingFlagForAPI } from '../constants';
import { mockInquiries } from '../utils/mockData';
import { categorizeByLOA } from '../utils/inbox';
import InboxLayout from '../components/inbox/InboxLayout';
import { getAllInquiries } from '../utils/api';

export default function Inbox() {
  const [hasError, setHasError] = useState(false);
  const [inquiries, setInquiries] = useState({ business: [], personal: [] });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function saveInState(rawInquiries) {
      const { business, personal, uniqueCategories } = categorizeByLOA(
        rawInquiries,
      );
      setInquiries({ business, personal });
      setCategoryOptions(uniqueCategories);
      setIsLoading(false);
    }

    function getApiData() {
      setIsLoading(true);

      if (mockTestingFlagForAPI && !window.Cypress) {
        saveInState(mockInquiries.data);
      } else {
        getAllInquiries()
          .then(res => saveInState(res.data))
          .catch(() => {
            setIsLoading(false);
            setHasError(true);
          });
      }
    }
    getApiData();
  }, []);

  if (hasError) {
    return (
      <va-alert status="info" className="vads-u-margin-y--4">
        <ServerErrorAlert />
      </va-alert>
    );
  }

  if (isLoading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message="Loading..."
      />
    );
  }

  return <InboxLayout {...{ inquiries, categoryOptions }} />;
}
