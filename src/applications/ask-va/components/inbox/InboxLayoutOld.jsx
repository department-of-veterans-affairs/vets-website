import {
  VaButtonPair,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import PropTypes from 'prop-types';
import InquiriesList from './InquiriesList';
import { filterAndSort } from '../../utils/inbox';

/**
 * @typedef {import('./InquiryCard').Inquiry} Inquiry
 */

/**
 * @typedef {Object} Props
 * @property {string[]} inquiryTypes
 * @property {string[]} categoryOptions
 * @property {string[]} statusOptions
 * @property {Inquiry[]} inquiries
 */

/**
 * @param {Props} props
 */
export default function InboxLayoutOld({
  inquiries,
  inquiryTypes,
  categoryOptions,
  statusOptions,
}) {
  const [pendingCategoriesFilter, setPendingCategoriesFilter] = useState('All');
  const [pendingStatusesFilter, setPendingStatusesFilter] = useState('All');
  const [pendingQuery, setPendingQuery] = useState('');
  const [filters, setFilters] = useState({
    statuses: ['All'],
    categories: ['All'],
    query: '',
  });

  return (
    <div id="inbox-old">
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--0">
        Your questions
      </h2>
      {inquiryTypes.length ? (
        <>
          <div className="filter-container">
            <div className="search-container">
              <VaTextInput
                value={pendingQuery}
                label="Search"
                inputMode="search"
                onVaInput={e => {
                  setPendingQuery(e.target.value || '');
                }}
              />
            </div>
            <div>
              <VaSelect
                hint={null}
                label="Filter by status"
                name="status"
                value={pendingStatusesFilter}
                onVaSelect={event => {
                  setPendingStatusesFilter(event.target.value || 'All');
                }}
              >
                <option value="All">All</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </VaSelect>
            </div>
            <div className="vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--0">
              <VaSelect
                hint={null}
                label="Filter by category"
                name="category"
                value={pendingCategoriesFilter}
                onVaSelect={event => {
                  setPendingCategoriesFilter(event.target.value || 'All');
                }}
              >
                <option value="All">All</option>
                {categoryOptions.map(category => (
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
                  setFilters(() => ({
                    categories: [pendingCategoriesFilter],
                    statuses: [pendingStatusesFilter],
                    query: pendingQuery,
                  }));
                  focusElement('#search-description');
                }}
                onSecondaryClick={() => {
                  setFilters(() => ({
                    statuses: ['All'],
                    categories: ['All'],
                    query: '',
                  }));
                  setPendingStatusesFilter('All');
                  setPendingCategoriesFilter('All');
                  setPendingQuery('');
                  focusElement('#search-description');
                }}
                leftButtonText="Apply"
                rightButtonText="Clear"
              />
            </div>
          </div>

          {inquiryTypes.includes('business') ? (
            <div className="tabs">
              <Tabs className="inbox-tab-container">
                <TabList className="inbox-tab-list">
                  <Tab className="inbox-tab">Business</Tab>
                  <Tab className="inbox-tab">Personal</Tab>
                </TabList>
                <TabPanel>
                  <InquiriesList
                    inquiries={filterAndSort({
                      inquiriesArray: inquiries,
                      filters: { ...filters, inquiryTypes: ['business'] },
                    })}
                    tabName="Business"
                    categoryFilter={filters.categories[0]}
                    statusFilter={filters.statuses[0]}
                    query={filters.query}
                  />
                </TabPanel>
                <TabPanel>
                  <InquiriesList
                    inquiries={filterAndSort({
                      inquiriesArray: inquiries,
                      filters: { ...filters, inquiryTypes: ['personal'] },
                    })}
                    tabName="Personal"
                    categoryFilter={filters.categories[0]}
                    statusFilter={filters.statuses[0]}
                    query={filters.query}
                  />
                </TabPanel>
              </Tabs>
            </div>
          ) : (
            <InquiriesList
              inquiries={filterAndSort({
                inquiriesArray: inquiries,
                filters: { ...filters, inquiryTypes: ['personal'] },
              })}
              categoryFilter={filters.categories[0]}
              statusFilter={filters.statuses[0]}
              query={filters.query}
            />
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

InboxLayoutOld.propTypes = {
  categoryOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  inquiryTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  inquiries: InquiriesList.propTypes.inquiries,
};
