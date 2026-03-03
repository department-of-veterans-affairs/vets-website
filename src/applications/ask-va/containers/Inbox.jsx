import React, { useEffect, useState } from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import { ServerErrorAlert } from '../config/helpers';
import { mockTestingFlagForAPI } from '../constants';
import { mockInquiries } from '../utils/mockData';
import { standardizeInquiries } from '../utils/inbox';
import InboxLayoutOld from '../components/inbox/InboxLayoutOld';
import InboxLayoutNew from '../components/inbox/InboxLayoutNew';
import { getAllInquiries } from '../utils/api';

export default function Inbox() {
  const [hasError, setHasError] = useState(false);
  const [inquiries, setInquiries] = useState({ business: [], personal: [] });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function saveInState(rawInquiries) {
      const {
        business,
        personal,
        uniqueCategories,
        uniqueStatuses,
      } = standardizeInquiries(rawInquiries);

      setInquiries({ business, personal });
      setCategoryOptions(uniqueCategories);
      setStatusOptions(uniqueStatuses);
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

  // TODO feature toggle uses redux state - remember to remove from unit tests as well
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.askVaEnhancedInbox}>
      <Toggler.Enabled>
        <InboxLayoutNew {...{ inquiries, categoryOptions, statusOptions }} />
      </Toggler.Enabled>
      <Toggler.Disabled>
        <InboxLayoutOld {...{ inquiries, categoryOptions, statusOptions }} />
      </Toggler.Disabled>
    </Toggler>
  );
}
