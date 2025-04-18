import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { format } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import {
  VaPagination,
  VaDate,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from 'platform/utilities/api';
import { DivWithBackIcon } from '../edit/EditBreadcrumb';
import { PROFILE_PATHS } from '../../constants';

const formatTimestamp = timestamp => {
  return format(parseISO(timestamp), "yyyy-MM-dd 'at' h:mm a zzz");
};

export default function AccountActivity() {
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [included, setIncluded] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDateBuffer, setStartDateBuffer] = useState('');
  const [endDateBuffer, setEndDateBuffer] = useState('');

  useEffect(
    () => {
      window.scrollTo(0, 0);
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await apiRequest(
            `/user_actions?per_page=${itemsPerPage}&page=${currentPage}&q[created_at_gteq]=${startDate}&q[created_at_lteq]=${endDate}`,
          );
          setData(response.data);
          setIncluded(response.included);
          setCurrentPage(response.meta.currentPage);
          setTotalPages(response.meta.totalPages);
        } catch (error) {
          // add loading error state
        }
        setLoading(false);
      };
      fetchData();
    },
    [currentPage, endDate, startDate],
  );

  const handleFilter = e => {
    e.preventDefault();
    setStartDate(startDateBuffer);
    setEndDate(endDateBuffer);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setStartDateBuffer('');
    setEndDateBuffer('');
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
            value={startDateBuffer}
            onDateChange={e => setStartDateBuffer(e.target.value)}
          />
          <VaDate
            label="End Date"
            name="endDate"
            value={endDateBuffer}
            onDateChange={e => setEndDateBuffer(e.target.value)}
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
            <span>IP Address</span>
            <span>Device Information</span>
            <span>Status</span>
          </va-table-row>
          {data.map((record, index) => (
            <va-table-row key={index}>
              <span>{formatTimestamp(record.attributes.createdAt)}</span>
              <span>
                {
                  included.find(
                    otherRecord =>
                      otherRecord.id ===
                      record.relationships.userActionEvent.data.id,
                  )?.attributes.details
                }
              </span>
              <span>{record.attributes.actingIpAddress}</span>
              <span>{record.attributes.actingUserAgent}</span>
              <span>{record.attributes.status}</span>
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
