import {
  VaAlert,
  VaCard,
  VaLink,
  VaLoadingIndicator,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ServerErrorAlert } from '../config/helpers';
import { envUrl } from '../constants';
import { mockInquiryData } from '../utils/mockData';

const DashboardCards = () => {
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [, setOriginalInquries] = useState([]);
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState('newestToOldest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = dateString => {
    return moment(dateString, 'MM/DD/YY').format('MMM D, YYYY');
  };

  const DASHBOARD_DATA = `${envUrl}/ask_va_api/v0/inquiries?user_mock_data=true`;
  const hasBusinessLevelAuth =
    inquiries.length > 0 &&
    inquiries.some(card => card.levelOfAuthentication === 'Business');

  const getData = async () => {
    const response = await apiRequest(DASHBOARD_DATA)
      .then(res => {
        // Using mock data until BE is ready with new fields and pagination
        setOriginalInquries(res);
        setLoading(false);
        return mockInquiryData;
      })
      .catch(() => {
        hasError(true);
      });

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
      <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-padding--1 vads-u-padding-top--0 vads-l-grid-container">
        {sortedInquiries.map(card => (
          <div
            className="vads-l-col--12 medium-screen:vads-l-col--6 vads-u-padding--1"
            key={card.inquiryNumber}
          >
            <VaCard className="vacard">
              <div>
                <span className="usa-label">{card.status}</span>
              </div>
              <h3 className="vads-u-margin-y--0 vads-u-font-size--h4 vads-u-padding-top--1p5">
                {formatDate(card.createdOn)}
              </h3>
              <p className="vads-u-margin--0 vads-u-padding-bottom--1p5">
                Last Updated: {formatDate(card.lastUpdate)}
              </p>
              <p className="vads-u-margin--0">Category: {card.category}</p>
              <hr className="vads-u-margin-y--1p5 vads-u-background-color--gray-lightest" />
              <p className="vads-u-margin-y--1p5 multiline-ellipsis-4">
                {card.submitterQuestion}
              </p>
              <Link to={`/user/dashboard/${card.id}`}>
                <VaLink active text="Check details" />
              </Link>
            </VaCard>
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <VaAlert status="info" className="vads-u-margin-y--4">
        <ServerErrorAlert />
      </VaAlert>
    );
  }

  if (loading) {
    return (
      <VaLoadingIndicator
        data-testid="loading-indicator"
        message="Loading..."
      />
    );
  }

  return (
    <div className="vads-u-width--full">
      <h2 className="vads-u-margin-top--5 vads-u-margin-bottom--3">
        Your questions
      </h2>
      {inquiries.length > 0 ? (
        <div className="vads-u-margin-bottom--2">
          {/* Filters and Buttons  */}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--flex-end vads-u-margin-bottom--3">
            <div className="vads-u-flex--1">
              <VaSelect
                hint={null}
                label="Last updated"
                name="lastUpdated"
                value={lastUpdatedFilter}
                onVaSelect={event => setLastUpdatedFilter(event.target.value)}
                uswds
              >
                <option value="newestToOldest">Newest to oldest</option>
                <option value="oldestToNewest">Oldest to newest</option>
              </VaSelect>
            </div>
            <div className="vads-u-flex--1 vads-u-margin-left--2">
              <VaSelect
                hint={null}
                label="Filter by category"
                name="category"
                value={categoryFilter}
                onVaSelect={event => setCategoryFilter(event.target.value)}
                uswds
              >
                <option value="All">All</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </VaSelect>
            </div>
            <div className="vads-u-flex--1 vads-u-margin-left--2">
              <VaSelect
                hint={null}
                label="Filter by status"
                name="status"
                value={statusFilter}
                onVaSelect={event => setStatusFilter(event.target.value)}
                uswds
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Reopened">Reopened</option>
                <option value="Resolved">Archived</option>
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
        </div>
      ) : (
        <div className="vads-u-margin-bottom--5">
          <va-alert
            disable-analytics="false"
            full-width="false"
            status="info"
            visible="true"
            uswds
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
