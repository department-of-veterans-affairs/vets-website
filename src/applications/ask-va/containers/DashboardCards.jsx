import {
  VaButtonPair,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { compareDesc, parse } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ServerErrorAlert } from '../config/helpers';
import { URL, envUrl, mockTestingFlagforAPI } from '../constants';
import { mockInquiries } from '../utils/mockData';
import { categorizeByLOA } from '../utils/dashboard';
import InquiriesList from '../components/dashboard/InquiriesList';

export default function DashboardCards() {
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState({ business: [], personal: [] });
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [pendingStatusFilter, setPendingStatusFilter] = useState('All');
  const [pendingCategoryFilter, setPendingCategoryFilter] = useState('All');
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
      // Focus element if we're on the main dashboard
      if (window.location.pathname.includes('introduction')) {
        focusElement('.schemaform-title > h1');
      }

      // Always fetch inquiries data regardless of route
      getApiData(`${envUrl}${URL.GET_INQUIRIES}`);
    },
    [getApiData],
  );

  useEffect(
    () => {
      setPendingStatusFilter(statusFilter);
      setPendingCategoryFilter(categoryFilter);
    },
    [statusFilter, categoryFilter],
  );

  const filterAndSort = inquiriesArray => {
    // Since Array.sort() sorts it in place, create a shallow copy first
    const inquiriesCopy = [...inquiriesArray];
    return inquiriesCopy
      .filter(inq => {
        return (
          [inq.categoryName, 'All'].includes(categoryFilter) &&
          [inq.status, 'All'].includes(statusFilter)
        );
      })
      .sort((a, b) => {
        const dateA = parse(a.lastUpdate, 'MM/dd/yyyy hh:mm:ss a', new Date());
        const dateB = parse(b.lastUpdate, 'MM/dd/yyyy hh:mm:ss a', new Date());
        return compareDesc(dateA, dateB);
      });
  };

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

  return (
    <div className="vads-u-width--full vads-u-margin-bottom--5">
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2p5">
        Your questions
      </h2>
      {inquiries.personal.length || inquiries.business.length ? (
        <>
          <div className="filter-container">
            <div className="vacardSelectFilters">
              <div>
                <VaSelect
                  hint={null}
                  label="Filter by status"
                  name="status"
                  value={pendingStatusFilter}
                  onVaSelect={event => {
                    setPendingStatusFilter(
                      event.target.value ? event.target.value : 'All',
                    );
                  }}
                >
                  <option value="All">All</option>
                  <option value="In progress">In progress</option>
                  <option value="Replied">Replied</option>
                  <option value="Reopened">Reopened</option>
                </VaSelect>
              </div>
              <div>
                <VaSelect
                  hint={null}
                  label="Filter by category"
                  name="category"
                  value={pendingCategoryFilter}
                  onVaSelect={event => {
                    setPendingCategoryFilter(
                      event.target.value ? event.target.value : 'All',
                    );
                  }}
                >
                  <option value="All">All</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </VaSelect>
              </div>
            </div>

            <div className="filter-actions">
              <VaButtonPair
                primaryLabel="Apply filters"
                secondaryLabel="Clear all filters"
                onPrimaryClick={() => {
                  setStatusFilter(pendingStatusFilter);
                  setCategoryFilter(pendingCategoryFilter);
                }}
                onSecondaryClick={() => {
                  setStatusFilter('All');
                  setCategoryFilter('All');
                  setPendingStatusFilter('All');
                  setPendingCategoryFilter('All');
                }}
                leftButtonText="Apply filters"
                rightButtonText="Clear all filters"
              />
            </div>
          </div>

          {inquiries.business?.length ? (
            <div className="columns small-12 tabs">
              <Tabs>
                <TabList>
                  <Tab className="small-6 tab">Business</Tab>
                  <Tab className="small-6 tab">Personal</Tab>
                </TabList>
                <TabPanel>
                  <InquiriesList
                    inquiries={filterAndSort(inquiries.business)}
                    tabName="Business"
                    {...{ categoryFilter, statusFilter }}
                  />
                </TabPanel>
                <TabPanel>
                  <InquiriesList
                    inquiries={filterAndSort(inquiries.personal)}
                    tabName="Personal"
                    {...{ categoryFilter, statusFilter }}
                  />
                </TabPanel>
              </Tabs>
            </div>
          ) : (
            <>
              <InquiriesList
                inquiries={filterAndSort(inquiries.personal)}
                {...{ categoryFilter, statusFilter }}
              />
            </>
          )}
        </>
      ) : (
        <div className="vads-u-margin-bottom--5">
          <va-alert
            disable-analytics="false"
            full-width="false"
            status="info"
            visible="true"
            slim
          >
            <p className="vads-u-margin-y--0">
              You haven’t submitted a question yet.
            </p>
          </va-alert>
        </div>
      )}
    </div>
  );
}
