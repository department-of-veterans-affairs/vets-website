import {
  VaButtonPair,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ServerErrorAlert } from '../config/helpers';
import { URL, envUrl, mockTestingFlagforAPI } from '../constants';
import { mockInquiries } from '../utils/mockData';
import { categorizeByLOA, filterAndSort } from '../utils/dashboard';
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
  const [query, setQuery] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');

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
    <div id="inbox">
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--0">
        Your questions
      </h2>
      {inquiries.personal.length || inquiries.business.length ? (
        <>
          <div className="filter-container">
            <div className="search-container">
              <VaTextInput
                value={pendingQuery}
                label="Search"
                inputMode="search"
                onVaInput={e => {
                  setPendingQuery(e.target.value);
                }}
              />
            </div>
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
            <div className="vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--0">
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

            <div
              // Keeps button pair aligned in parent correctly on mobile & desktop
              className="vads-u-margin-bottom--neg0p5 medium-screen:vads-u-padding-right--0p5 vads-u-margin-x--neg0p5 medium-screen:vads-u-margin-x--0"
            >
              <VaButtonPair
                primaryLabel="Apply filters"
                secondaryLabel="Clear all filters"
                onPrimaryClick={() => {
                  setStatusFilter(pendingStatusFilter);
                  setCategoryFilter(pendingCategoryFilter);
                  setQuery(pendingQuery);
                }}
                onSecondaryClick={() => {
                  setStatusFilter('All');
                  setCategoryFilter('All');
                  setQuery('');
                  setPendingQuery('');
                  setPendingStatusFilter('All');
                  setPendingCategoryFilter('All');
                }}
                leftButtonText="Apply"
                rightButtonText="Clear"
              />
            </div>
          </div>

          {inquiries.business?.length ? (
            <div className="tabs">
              <Tabs className="inbox-tab-container">
                <TabList className="inbox-tab-list">
                  <Tab className="inbox-tab">Business</Tab>
                  <Tab className="inbox-tab">Personal</Tab>
                </TabList>
                <TabPanel>
                  <InquiriesList
                    inquiries={filterAndSort({
                      inquiriesArray: inquiries.business,
                      categoryFilter,
                      statusFilter,
                      query,
                    })}
                    tabName="Business"
                    {...{ categoryFilter, statusFilter, query }}
                  />
                </TabPanel>
                <TabPanel>
                  <InquiriesList
                    inquiries={filterAndSort({
                      inquiriesArray: inquiries.personal,
                      categoryFilter,
                      statusFilter,
                      query,
                    })}
                    tabName="Personal"
                    {...{ categoryFilter, statusFilter, query }}
                  />
                </TabPanel>
              </Tabs>
            </div>
          ) : (
            <>
              <InquiriesList
                inquiries={filterAndSort({
                  inquiriesArray: inquiries.personal,
                  categoryFilter,
                  statusFilter,
                  query,
                })}
                {...{ categoryFilter, statusFilter, query }}
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
