import {
  VaPagination,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { compareAsc, compareDesc, format, parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ServerErrorAlert } from '../config/helpers';
import { mockInquiryData } from '../utils/mockData';

const DashboardCards = () => {
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState('newestToOldest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const formatDate = dateString => {
    const parsedDate = parse(dateString, 'MM/dd/yy', new Date());
    return format(parsedDate, 'MMM d, yyyy');
  };

  const formatLongDate = dateString => {
    const parsedDate = parse(dateString, 'MM/dd/yy', new Date());
    return format(parsedDate, 'MMMM d, yyyy');
  };

  const hasBusinessLevelAuth =
    inquiries.length > 0 &&
    inquiries.some(
      card => card.attributes.levelOfAuthentication === 'Business',
    );

  const getApiData = () => {
    setLoading(true);
    const res = mockInquiryData;
    setInquiries(res.data);
    const uniqueCategories = [
      ...new Set(res.data.map(item => item.attributes.categoryName)),
    ];
    setCategories(uniqueCategories);
    setLoading(false);
    hasError(false);
  };

  useEffect(() => {
    focusElement('.schemaform-title > h1');
    getApiData();
  }, []);

  const filterAndSortInquiries = loa => {
    return inquiries
      .filter(
        card =>
          categoryFilter === 'All' ||
          card.attributes.categoryName === categoryFilter,
      )
      .filter(
        card =>
          statusFilter === 'All' || card.attributes.status === statusFilter,
      )
      .filter(
        card => loa === 'All' || card.attributes.levelOfAuthentication === loa,
      )
      .sort((a, b) => {
        const dateA = parse(a.attributes.lastUpdate, 'MM/dd/yy', new Date());
        const dateB = parse(b.attributes.lastUpdate, 'MM/dd/yy', new Date());
        if (lastUpdatedFilter === 'newestToOldest') {
          return compareDesc(dateA, dateB);
        }
        return compareAsc(dateA, dateB);
      });
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  const inquiriesGridView = category => {
    const filteredInquiries = filterAndSortInquiries(category);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInquiries = filteredInquiries.slice(
      indexOfFirstItem,
      indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

    if (filteredInquiries.length === 0) {
      return (
        <div className="vads-u-margin-y--2">
          <va-alert
            close-btn-aria-label="Close notification"
            slim
            status="info"
            visible
          >
            <p className="vads-u-margin-y--0">No questions match your filter</p>
          </va-alert>
        </div>
      );
    }

    return (
      <>
        <div className="dashboard-cards-grid">
          {currentInquiries.map(card => (
            <div key={card.id}>
              <va-card class="vacard">
                <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                  <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
                    {card.attributes.status}
                  </span>
                  <span className="vads-u-display--block vads-u-font-size--h4 vads-u-margin-top--1p5">
                    {`Submitted on ${formatDate(card.attributes.createdOn)}`}
                  </span>
                </h3>
                <p className="vads-u-margin--0 vads-u-padding-bottom--1p5">
                  <span className="vads-u-font-weight--bold">
                    Last updated:
                  </span>{' '}
                  {formatDate(card.attributes.lastUpdate)}
                </p>
                <p className="vacardCategory multiline-ellipsis-1">
                  <span className="vads-u-font-weight--bold">Category:</span>{' '}
                  {card.attributes.categoryName}
                </p>
                <p className="vacardSubmitterQuestion">
                  {card.attributes.submitterQuestion}
                </p>
                <Link to={`/user/dashboard-mock/${card.id}`}>
                  <va-link
                    active
                    text="Check details"
                    label={`Check details for question submitted on ${formatLongDate(
                      card.attributes.createdOn,
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
            className="vads-u-border-top--0 vads-u-padding-top--0 vads-u-padding-bottom--5"
          />
        )}
      </>
    );
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
    <div className="vads-u-width--full">
      <h2 className="vads-u-margin-top--5 vads-u-margin-bottom--0">
        Your questions
      </h2>
      {inquiries.length > 0 ? (
        <>
          <div className="vacardSelectFilters">
            <div className="vads-u-flex--1 vads-u-width--full">
              <VaSelect
                hint={null}
                label="Last updated"
                name="lastUpdated"
                value={lastUpdatedFilter}
                onVaSelect={event => {
                  setLastUpdatedFilter(
                    event.target.value ? event.target.value : 'newestToOldest',
                  );
                  setCurrentPage(1);
                }}
              >
                <option value="newestToOldest">Newest to oldest</option>
                <option value="oldestToNewest">Oldest to newest</option>
              </VaSelect>
            </div>
            <div className="vads-u-flex--1 vads-u-margin-left--2 vads-u-width--full">
              <VaSelect
                hint={null}
                label="Filter by category"
                name="category"
                value={categoryFilter}
                onVaSelect={event => {
                  setCategoryFilter(
                    event.target.value ? event.target.value : 'All',
                  );
                  setCurrentPage(1);
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
            <div className="vads-u-flex--1 vads-u-margin-left--2 vads-u-width--full">
              <VaSelect
                hint={null}
                label="Filter by status"
                name="status"
                value={statusFilter}
                onVaSelect={event => {
                  setStatusFilter(
                    event.target.value ? event.target.value : 'All',
                  );
                  setCurrentPage(1);
                }}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Replied">Replied</option>
                <option value="Reopened">Reopened</option>
              </VaSelect>
            </div>
          </div>
          {hasBusinessLevelAuth ? (
            <Tabs onSelect={handleTabChange}>
              <TabList>
                <Tab className="small-6 tab">Business</Tab>
                <Tab className="small-6 tab">Personal</Tab>
              </TabList>
              <TabPanel>{inquiriesGridView('Business')}</TabPanel>
              <TabPanel>{inquiriesGridView('Personal')}</TabPanel>
            </Tabs>
          ) : (
            inquiriesGridView('Personal')
          )}
        </>
      ) : (
        <div className="vads-u-margin-bottom--5">
          <va-alert
            disable-analytics="false"
            full-width="false"
            status="info"
            visible="true"
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
