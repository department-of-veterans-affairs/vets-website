import {
  VaAlert,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ServerErrorAlert } from '../config/helpers';

const DashboardCards = () => {
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState('newestToOldest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [displayViewGrid, setDisplayViewGrid] = useState(true);
  const formatDate = dateString => {
    return moment(dateString, 'MM/DD/YY').format('MMM D, YYYY');
  };
  const DASHBOARD_DATA = `${
    environment.API_URL
  }/ask_va_api/v0/inquiries?mock=true`;
  const hasBusinessLevelAuth =
    inquiries.length > 0 &&
    inquiries.some(card => card.levelOfAuthentication === 'Business');

  // Now use sortedInquiries in your map function instead of inquiries

  const getData = async () => {
    const response = await apiRequest(DASHBOARD_DATA)
      .then(res => {
        return res;
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
  };

  useEffect(() => {
    getData();
  }, []);

  const filterAndSortInquiries = category => {
    return inquiries
      .filter(card => card.levelOfAuthentication === category)
      .filter(card => statusFilter === 'All' || card.status === statusFilter)
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
      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        {sortedInquiries
          .filter(card => card.levelOfAuthentication === category)
          .map(card => (
            <div
              className="vads-l-col--12 medium-screen:vads-l-col--6 vads-u-padding--2"
              key={card.inquiryNumber}
            >
              <va-card
                className="vads-u-flex--1 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-height--auto"
                show-shadow
              >
                <h3 className="vads-u-margin-y--0 vads-u-font-size--h4">
                  {card.inquiryNumber}
                </h3>
                <p className="vads-u-margin-bottom--5 multiline-ellipsis-3">
                  {card.submitterQuestion}
                </p>
                <div>
                  <p className="vads-u-margin--0">
                    <span className="vads-u-font-weight--bold">Status: </span>
                    {card.status}{' '}
                    {card.correspondences && (
                      <span className="vads-u-font-weight--bold vads-u-margin-left--1">
                        "You have a reply"
                      </span>
                    )}
                  </p>
                  <p className="vads-u-margin--0">
                    <span className="vads-u-font-weight--bold">
                      Last Update:{' '}
                    </span>
                    {formatDate(card.lastUpdate)}
                  </p>
                </div>
                <hr className="vads-u-margin-y--2" />
                <Link
                  className="vads-c-action-link--blue"
                  to={`/user/dashboard/${card.id}`}
                >
                  Check details
                </Link>
              </va-card>
            </div>
          ))}
      </div>
    );
  };

  // Per Sketch Notes - The lists are Unordered lists and using flexbox for the layout --not tables
  const inquiriesListView = category => {
    const sortedInquiries = filterAndSortInquiries(category);

    return (
      <div className="vads-l-grid-container">
        <div className="vads-l-row vads-u-margin-bottom--2 vads-u-font-weight--bold">
          <div className="vads-l-col--2">Inquiry Number</div>
          <div className="vads-l-col--4">Your question</div>
          <div className="vads-l-col--2">Status</div>
          <div className="vads-l-col--2">Last updated</div>
          <div className="vads-l-col--2" />
        </div>
        {sortedInquiries
          .filter(card => card.levelOfAuthentication === category)
          .map(card => (
            <div
              className="vads-l-row vads-u-padding-y--2"
              key={card.inquiryNumber}
            >
              <div className="vads-l-col--2">{card.inquiryNumber}</div>
              <div className="vads-l-col--4 multiline-ellipsis-2">
                {card.submitterQuestion}
              </div>
              <div className="vads-l-col--2">{card.status}</div>
              <div className="vads-l-col--2">{formatDate(card.lastUpdate)}</div>
              <div className="vads-l-col--2">
                <Link to={`/user/dashboard/${card.id}`}>Check details</Link>
              </div>
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

  return (
    <div className="vads-u-width--full">
      <h2 className="vads-u-margin-bottom--2">Your questions</h2>
      {inquiries.length > 0 ? (
        <div className="vads-u-margin-bottom--2">
          {/* Filters and Buttons  */}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--flex-end vads-u-margin-bottom--3">
            <div className="vads-u-flex--2">
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
                label="Status"
                name="status"
                value={statusFilter}
                onVaSelect={event => setStatusFilter(event.target.value)}
                uswds
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Reopened">Reopened</option>
                <option value="Resolved">Resolved</option>
              </VaSelect>
            </div>
            <div className="vads-u-flex--1 vads-u-margin-left--2">
              <va-button
                viewGrid
                onClick={() => setDisplayViewGrid(true)}
                text="View grid"
                uswds
              />
            </div>
            <div className="vads-u-flex--1">
              <va-button
                onClick={() => setDisplayViewGrid(false)}
                secondary
                text="View list"
                uswds
              />
            </div>
          </div>
          {/* Inquiries Views */}
          {hasBusinessLevelAuth ? (
            <va-accordion
              disable-analytics={{
                value: 'false',
              }}
              section-heading={{
                value: 'null',
              }}
              uswds={{
                value: 'true',
              }}
              className="vads-u-width--viewport"
            >
              <va-accordion-item header="Business" id="business">
                {displayViewGrid
                  ? inquiriesGridView('Business')
                  : inquiriesListView('Business')}
              </va-accordion-item>
              <va-accordion-item header="Personal" id="personal">
                {displayViewGrid
                  ? inquiriesGridView('Personal')
                  : inquiriesListView('Personal')}
              </va-accordion-item>
            </va-accordion>
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
