import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { format } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import {
  VaPagination,
  VaDate,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { DivWithBackIcon } from '../edit/EditBreadcrumb';
import { PROFILE_PATHS } from '../../constants';

const mockApiRequest = async () => {
  await new Promise(r => setTimeout(r, 2000));

  const events = [
    'Logged in',
    'Logged out',
    'Updated email',
    'Viewed profile',
    'Updated address',
    'Session timed out',
    'Changed password',
    'Deleted account',
    'Added new device',
    'Removed device',
    'Enabled two-factor authentication',
    'Disabled two-factor authentication',
    'Reset password',
    'Failed login attempt',
    'Updated preferences',
    'Uploaded document',
    'Downloaded report',
    'Sent message',
    'Received notification',
    'Scheduled appointment',
  ];

  const devices = ['Mozilla Firefox', 'Google Chrome', 'Microsoft Edge'];

  const ipAddresses = ['192.168.1.1', '192.168.2.1', '192.168.3.1'];

  const statuses = ['Success', 'Failure', 'Pending', 'Error'];

  const performedBy = ['User', 'Guardian', 'System'];

  const data = [];

  const startDate = new Date('2021-01-01T00:00:00Z');
  const endDate = new Date('2022-12-31T23:59:59Z');
  const numEntries = 200;

  for (let i = 0; i < numEntries; i++) {
    const date = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );
    const dateStr = date.toISOString();

    const ipAddress =
      ipAddresses[Math.floor(Math.random() * ipAddresses.length)];
    const event = events[Math.floor(Math.random() * events.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const performer =
      performedBy[Math.floor(Math.random() * performedBy.length)];

    data.push({
      timestamp: dateStr,
      ipAddress,
      performer,
      device,
      event,
      status,
    });
  }

  return { data };
};

const formatTimestamp = timestamp => {
  return format(parseISO(timestamp), "yyyy-MM-dd 'at' h:mm a zzz");
};

export default function AccountActivity() {
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const dataToDisplay = filteredData.length > 0 ? filteredData : apiResponse;
  const currentItems = dataToDisplay.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await mockApiRequest();
        setApiResponse(response.data);
      } catch (error) {
        // add loading error state
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filtered = apiResponse.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= start && recordDate <= end;
      });

      filtered.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredData([]);
    setCurrentPage(1);
  };

  return (
    <>
      <DivWithBackIcon className="vads-u-margin-top--2 vads-u-margin-bottom--3">
        <NavLink
          activeClassName="is-active"
          exact
          to={PROFILE_PATHS.ACCOUNT_SECURITY}
        >
          Back to account security
        </NavLink>
      </DivWithBackIcon>
      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
        Account activity
      </h1>
      <form onSubmit={handleFilter}>
        <fieldset>
          <legend>Date Filter</legend>
          <VaDate
            label="Start Date"
            name="startDate"
            value={startDate}
            onDateChange={e => setStartDate(e.target.value)}
          />
          <VaDate
            label="End Date"
            name="endDate"
            value={endDate}
            onDateChange={e => setEndDate(e.target.value)}
          />
          <VaButtonPair
            className="vads-u-margin-top--4"
            submit="prevent"
            leftButtonText="Submit"
            rightButtonText="Clear"
            onSecondaryClick={clearFilter}
          />
        </fieldset>
      </form>
      {loading ? (
        <va-loading-indicator
          setFocus
          message="Loading your account activity..."
          class="vads-u-margin-top--4"
        />
      ) : (
        <va-table striped full-width>
          <va-table-row slot="headers">
            <span>Timestamp</span>
            <span>Event</span>
            <span>Performed By</span>
            <span>IP Address</span>
            <span>Device Information</span>
            <span>Status</span>
          </va-table-row>
          {currentItems.map((record, index) => (
            <va-table-row key={index}>
              <span>{formatTimestamp(record.timestamp)}</span>
              <span>{record.event}</span>
              <span>{record.performer}</span>
              <span>{record.ipAddress}</span>
              <span>{record.device}</span>
              <span>{record.status}</span>
            </va-table-row>
          ))}
        </va-table>
      )}

      {totalPages > 1 && (
        <VaPagination
          page={currentPage}
          pages={totalPages}
          showLastPage
          onPageSelect={e => setCurrentPage(e.detail.page)}
        />
      )}
    </>
  );
}
