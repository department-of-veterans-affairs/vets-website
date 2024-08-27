import {
  VaPagination,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { format, parse } from 'date-fns';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ServerErrorAlert } from '../config/helpers';
import { mockInquiryData } from '../utils/mockData';

const DashboardCardsMock = () => {
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState('newestToOldest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = dateString => {
    const parsedDate = parse(dateString, 'MM/dd/yy', new Date());
    return format(parsedDate, 'MMM d, yyyy');
  };

  const hasBusinessLevelAuth =
    inquiries.length > 0 &&
    inquiries.some(card => card.levelOfAuthentication === 'Business');

  const getData = async () => {
    setLoading(false);
    const response = mockInquiryData;
    hasError(false);
    const data = [];
    if (response) {
      for (const inquiry of response.data) {
        data.push({
          ...inquiry.attributes,
          id: inquiry.id,
        });
      }
    }

    setInquiries(data);

    const uniqueCategories = [...new Set(data.map(item => item.category))];
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    getData();
  }, []);

  const filterAndSortInquiries = category => {
    return inquiries
      .filter(
        card => categoryFilter === 'All' || card.category === categoryFilter,
      )
      .filter(card => statusFilter === 'All' || card.status === statusFilter)
      .filter(
        card => category === 'All' || card.levelOfAuthentication === category,
      )
      .sort((a, b) => {
        if (lastUpdatedFilter === 'newestToOldest') {
          return (
            moment(b.lastUpdate, 'MM/DD/YY') - moment(a.lastUpdate, 'MM/DD/YY')
          );
        }
        return (
          moment(a.lastUpdate, 'MM/DD/YY') - moment(b.lastUpdate, 'MM/DD/YY')
        );
      });
  };

  const inquiriesGridView = category => {
    const sortedInquiries = filterAndSortInquiries(category);

    return (
      <div className="dashboard-cards-grid">
        {sortedInquiries.map(card => (
          <div key={card.inquiryNumber}>
            <va-card class="vacard">
              <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1p5">
                <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
                  {card.status}
                </span>
                <span className="vads-u-display--block vads-u-font-size--h4 vads-u-margin-top--1p5">
                  {`Submitted on ${formatDate(card.createdOn)}`}
                </span>
              </h3>
              <p className="vads-u-margin--0 vads-u-padding-bottom--1p5">
                {`Last Updated: ${formatDate(card.lastUpdate)}`}
              </p>
              <p className="vacardCategory multiline-ellipsis-1">
                Category: {card.category}
              </p>
              <p className="vacardSubmitterQuestion">
                {card.submitterQuestion}
              </p>
              <Link to={`/user/dashboard-mock/${card.id}`}>
                <va-link active text="Check details" />
              </Link>
            </va-card>
          </div>
        ))}
      </div>
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
          {/* Filters and Buttons  */}
          <div className="vacardSelectFilters">
            <div className="vads-u-flex--1 vads-u-width--full">
              <VaSelect
                hint={null}
                label="Last updated"
                name="lastUpdated"
                value={lastUpdatedFilter}
                onVaSelect={event => setLastUpdatedFilter(event.target.value)}
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
                onVaSelect={event => setCategoryFilter(event.target.value)}
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
                onVaSelect={event => setStatusFilter(event.target.value)}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Replied">Replied</option>
                <option value="Reopened">Reopened</option>
              </VaSelect>
            </div>
          </div>
          {/* Inquiries Views */}
          {hasBusinessLevelAuth ? (
            <div className="columns small-12 vads-u-border--1px vads-u-border-style--solid vads-u-border-color--gray-lightest vads-u-padding--0 vads-u-margin--0 vads-u-border-top--0px">
              <Tabs>
                <TabList>
                  <Tab className="small-6 tab">Business</Tab>
                  <Tab className="small-6 tab">Personal</Tab>
                </TabList>
                <TabPanel>{inquiriesGridView('Business')}</TabPanel>
                <TabPanel>{inquiriesGridView('Personal')}</TabPanel>
              </Tabs>
            </div>
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
      <VaPagination
        page={1}
        pages={3}
        maxPageListLength={5}
        showLastPage
        className="vads-u-border-top--0 vads-u-padding-y--5"
      />
    </div>
  );
};

export default DashboardCardsMock;
