import {
  VaButtonPair,
  VaPagination,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { compareDesc, parse } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Fuse from 'fuse.js';
import {
  ServerErrorAlert,
  formatDate,
  getVAStatusFromCRM,
} from '../config/helpers';
import { URL, envUrl, mockTestingFlagforAPI } from '../constants';
import { mockInquiries } from '../utils/mockData';

const DashboardCards = () => {
  const filterSummaryRef = useRef(null);
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [pendingStatusFilter, setPendingStatusFilter] = useState('All');
  const [pendingCategoryFilter, setPendingCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(0); // 0 for Business, 1 for Personal
  const [query, setQuery] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');
  const itemsPerPage = 4;

  const hasBusinessLevelAuth =
    inquiries.length > 0 &&
    inquiries.some(
      card => card.attributes.levelOfAuthentication === 'Business',
    );

  const transformInquiriesData = data => {
    const transformedInquiries = data.map(inquiry => ({
      ...inquiry,
      attributes: {
        ...inquiry.attributes,
        status: getVAStatusFromCRM(inquiry.attributes.status),
      },
    }));
    const uniqueCategories = [
      ...new Set(
        transformedInquiries
          .filter(
            item => item.attributes.levelOfAuthentication !== 'Unauthenticated',
          )
          .map(item => item.attributes.categoryName),
      ),
    ];

    return { transformedInquiries, uniqueCategories };
  };

  const getApiData = useCallback(url => {
    setLoading(true);

    const processData = data => {
      const { transformedInquiries, uniqueCategories } = transformInquiriesData(
        data,
      );
      setInquiries(transformedInquiries);
      setCategories(uniqueCategories);
      setLoading(false);
    };

    if (mockTestingFlagforAPI && !window.Cypress) {
      processData(mockInquiries.data);
      return Promise.resolve();
    }

    return apiRequest(url)
      .then(res => {
        processData(res.data);
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

  const filterAndSortInquiries = loa => {
    // Since Array.sort() sorts it in place, create a shallow copy first
    const inquiriesCopy = [...inquiries];
    const filteredAndSorted = inquiriesCopy
      .filter(
        card =>
          (categoryFilter === 'All' ||
            card.attributes.categoryName === categoryFilter) &&
          (statusFilter === 'All' || card.attributes.status === statusFilter),
      )
      .filter(
        card => loa === 'All' || card.attributes.levelOfAuthentication === loa,
      )
      .sort((a, b) => {
        const dateA = parse(
          a.attributes.lastUpdate,
          'MM/dd/yyyy hh:mm:ss a',
          new Date(),
        );
        const dateB = parse(
          b.attributes.lastUpdate,
          'MM/dd/yyyy hh:mm:ss a',
          new Date(),
        );
        return compareDesc(dateA, dateB);
      });

    const searchable = new Fuse(filteredAndSorted, {
      keys: [
        'attributes.inquiryNumber',
        'attributes.submitterQuestion',
        'attributes.categoryName',
      ],
      ignoreLocation: true,
      threshold: 0.1,
    });

    const results = searchable.search(query).map(res => res.item);

    // An empty query returns no results, so use the full list as a backup
    return query ? results : filteredAndSorted;
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
    setTimeout(() => {
      focusElement(filterSummaryRef?.current);
    }, 0);
  };

  const handleTabChange = tabIndex => {
    setCurrentTab(tabIndex);
    setCurrentPage(1);
    setTimeout(() => {
      focusElement(filterSummaryRef?.current);
    }, 0);
  };

  const getCurrentTabType = () => {
    if (!hasBusinessLevelAuth) return 'Personal';
    return currentTab === 0 ? 'Business' : 'Personal';
  };

  const inquiriesGridView = loa => {
    const filteredInquiries = filterAndSortInquiries(loa);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInquiries = filteredInquiries.slice(
      indexOfFirstItem,
      indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

    if (filteredInquiries.length === 0) {
      return (
        <va-alert
          close-btn-aria-label="Close notification"
          slim
          status="info"
          visible
        >
          <p className="vads-u-margin-y--0">No questions match your filter</p>
        </va-alert>
      );
    }

    return (
      <>
        <div
          className={
            hasBusinessLevelAuth
              ? 'dashboard-cards-grid-with-business'
              : 'dashboard-cards-grid vads-u-padding--0'
          }
        >
          {currentInquiries.map(card => (
            <div key={card.id} className="dashboard-card-list">
              <va-card class="vacard">
                <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                  <span className="vads-u-margin-bottom--1p5 vads-u-display--block">
                    <span className="sr-only">Status</span>
                    <span>
                      <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
                        {getVAStatusFromCRM(card.attributes.status)}
                      </span>
                    </span>
                  </span>
                  <span className="vads-u-display--block vads-u-font-size--h4 vads-u-margin-top--1p">
                    {`Submitted on ${formatDate(card.attributes.createdOn)}`}
                  </span>
                </h3>
                <div className="vads-u-margin--0 vads-u-padding-bottom--1">
                  <span className="vads-u-font-weight--bold vads-u-display--inline">
                    Last updated:
                  </span>{' '}
                  <span className="vads-u-display--inline">
                    {formatDate(card.attributes.lastUpdate)}
                  </span>
                </div>
                <div className="vads-u-margin--0 vads-u-padding-bottom--1">
                  <span className="vads-u-font-weight--bold vads-u-display--inline">
                    Reference number:
                  </span>{' '}
                  <span className="vads-u-display--inline">
                    {card.attributes.inquiryNumber}
                  </span>
                </div>
                <div className="vads-u-margin-bottom--0 vacardCategory multiline-ellipsis-1">
                  <span className="vads-u-font-weight--bold vads-u-display--inline">
                    Category:
                  </span>{' '}
                  <span className="vads-u-display--inline">
                    {card.attributes.categoryName}
                  </span>
                </div>
                <div className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-margin-bottom--1 vads-u-margin-top--1p5" />
                <p className="vacardSubmitterQuestion">
                  {card.attributes.submitterQuestion}
                </p>
                <Link
                  to={`${URL.DASHBOARD_ID}${card.attributes.inquiryNumber}`}
                  className="vads-u-margin-top--1p5"
                >
                  <va-link
                    active
                    text="Review conversation"
                    label={`Review conversation for question submitted on ${formatDate(
                      card.attributes.createdOn,
                      'long',
                    )}`}
                  />
                </Link>
              </va-card>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <VaPagination
            page={currentPage}
            pages={totalPages}
            maxPageListLength={5}
            showLastPage
            onPageSelect={e => handlePageChange(e.detail.page)}
            className="vads-u-border-top--0 vads-u-padding-top--0 vads-u-padding-bottom--0"
          />
        )}
      </>
    );
  };

  const renderFilteredResultsInfo = () => {
    const currentTabType = getCurrentTabType();
    const filteredInquiries = filterAndSortInquiries(currentTabType);
    const totalFilteredCount = filteredInquiries.length;
    const currentShowingStart = (currentPage - 1) * itemsPerPage + 1;
    const currentShowingEnd = Math.min(
      currentPage * itemsPerPage,
      totalFilteredCount,
    );

    const displayCount =
      totalFilteredCount === 0
        ? 'no'
        : `${currentShowingStart}-${currentShowingEnd} of ${totalFilteredCount}`;
    const queryPart = query ? `"${query}" for ` : '';

    // Singluar or plural
    const statusAmount = `status${statusFilter !== 'All' ? '' : 'es'}`;
    const categoryAmount = `categor${categoryFilter !== 'All' ? 'y' : 'ies'}`;

    const tabInfo = hasBusinessLevelAuth ? ` in "${currentTabType}"` : '';

    return `Showing ${displayCount} results for ${queryPart}"${statusFilter}" ${statusAmount} and "${categoryFilter}" ${categoryAmount}${tabInfo}`;
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
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--0">
        Your questions
      </h2>
      {inquiries.length > 0 ? (
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
            <div // Keeps button pair aligned in parent correctly on mobile & desktop
              className="vads-u-margin-bottom--neg0p5 medium-screen:vads-u-padding-right--0p5 vads-u-margin-x--neg0p5 medium-screen:vads-u-margin-x--0"
            >
              <VaButtonPair
                primaryLabel="Apply filters"
                secondaryLabel="Clear all filters"
                onPrimaryClick={() => {
                  setStatusFilter(pendingStatusFilter);
                  setCategoryFilter(pendingCategoryFilter);
                  setQuery(pendingQuery);
                  setCurrentPage(1);
                  focusElement(filterSummaryRef?.current);
                }}
                onSecondaryClick={() => {
                  setStatusFilter('All');
                  setCategoryFilter('All');
                  setQuery('');
                  setPendingQuery('');
                  setPendingStatusFilter('All');
                  setPendingCategoryFilter('All');
                  setCurrentPage(1);
                  focusElement(filterSummaryRef?.current);
                }}
                leftButtonText="Apply"
                rightButtonText="Clear"
              />
            </div>
          </div>

          {hasBusinessLevelAuth ? (
            <div className="columns small-12 tabs">
              <Tabs onSelect={handleTabChange}>
                <TabList>
                  <Tab className="small-6 tab">Business</Tab>
                  <Tab className="small-6 tab">Personal</Tab>
                </TabList>
                <TabPanel>
                  <p
                    ref={filterSummaryRef}
                    className="vads-u-margin-top--2 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-x--2p5"
                  >
                    {renderFilteredResultsInfo()}
                  </p>
                  {inquiriesGridView('Business')}
                </TabPanel>
                <TabPanel>
                  <p
                    ref={filterSummaryRef}
                    className="vads-u-margin-top--2 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-x--2p5"
                  >
                    {renderFilteredResultsInfo()}
                  </p>
                  {inquiriesGridView('Personal')}
                </TabPanel>
              </Tabs>
            </div>
          ) : (
            <>
              <p
                ref={filterSummaryRef}
                className="vads-u-margin-top--2 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-x--0"
              >
                {renderFilteredResultsInfo()}
              </p>
              {inquiriesGridView('Personal')}
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
};

export default DashboardCards;
