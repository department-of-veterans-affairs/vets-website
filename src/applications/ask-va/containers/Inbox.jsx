import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { ServerErrorAlert } from '../config/helpers';
import { URL, envUrl, mockTestingFlagforAPI } from '../constants';
import { mockInquiries } from '../utils/mockData';
import { categorizeByLOA } from '../utils/inbox';
import InboxLayout from '../components/inbox/InboxLayout';

export default function Inbox() {
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState({ business: [], personal: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const saveInState = rawInquiries => {
    const { business, personal, uniqueCategories } = categorizeByLOA(
      rawInquiries,
    );
    setInquiries({ business, personal });
    setCategories(uniqueCategories);
    setLoading(false);
  };

  const getApiData = useCallback(url => {
    setLoading(true);

    if (mockTestingFlagforAPI && !window.Cypress) {
      saveInState(mockInquiries.data);
      return Promise.resolve();
    }

    return apiRequest(url)
      .then(res => {
        saveInState(res.data);
      })
      .catch(() => {
        setLoading(false);
        hasError(true);
      });
  }, []);

  useEffect(
    () => {
      // Focus element if we're on the main inbox
      if (window.location.pathname.includes('introduction')) {
        focusElement('.schemaform-title > h1');
      }

      // Always fetch inquiries data regardless of route
      getApiData(`${envUrl}${URL.GET_INQUIRIES}`);
    },
    [getApiData],
  );

  if (error) {
    return (
      <va-alert status="info" className="vads-u-margin-y--4">
        <ServerErrorAlert />
      </va-alert>
    );
  }

  if (loading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message="Loading..."
      />
    );
  }

  return <InboxLayout {...{ inquiries, categories }} />;
}
