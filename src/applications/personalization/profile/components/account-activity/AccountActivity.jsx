import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { formatDatetime, parseDate } from 'platform/mhv/downtime/utils/date';
import {
  VaPagination,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from 'platform/utilities/api';
import { DivWithBackIcon } from '../edit/EditBreadcrumb';
import { PROFILE_PATHS } from '../../constants';

export default function AccountActivity() {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [apiIncluded, setApiIncluded] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 8;
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const dataToDisplay = filteredData.length > 0 ? filteredData : apiData;
  // const currentItems = dataToDisplay.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const response = await apiRequest('/user_action_events');
      setLoading(false);
      setApiData(response.data);
      setApiIncluded(response.included);
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filtered = apiData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });

      filtered.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
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
      <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        <fieldset className="vads-u-flex--auto vads-u-max-width--none vads-u-width--auto vads-u-margin-bottom--2">
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
          <div className="vads-u-margin-top--4">
            <va-button
              onClick={handleFilter}
              text="Submit"
              class="vads-u-margin-right--1"
            />
            <va-button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setFilteredData([]);
                setCurrentPage(1);
              }}
              secondary
              text="Clear"
            />
          </div>
        </fieldset>
        <div className="vads-u-flex--2 medium-screen:vads-u-padding-left--3">
          {loading ? (
            <va-loading-indicator
              setFocus
              message="Loading your account activity..."
              class="vads-u-margin-top--4"
            />
          ) : (
            <va-table sortable table-type="bordered">
              <va-table-row slot="headers">
                <span>Timestamp</span>
                <span>IP Address</span>
                <span>Device Information</span>
                <span>Event</span>
                <span>Status</span>
              </va-table-row>
              {apiData.map((record, index) => (
                <va-table-row key={index}>
                  <span>
                    {formatDatetime(parseDate(record.attributes.createdAt))}
                  </span>
                  <span>{record.attributes.actingIpAddress}</span>
                  <span>{record.attributes.actingUserAgent}</span>
                  <span>
                    {
                      apiIncluded.find(
                        otherRecord =>
                          otherRecord.id ===
                          record.relationships.userActionEvent.data.id,
                      )?.attributes.details
                    }
                  </span>
                  <span>{record.attributes.status}</span>
                </va-table-row>
              ))}
            </va-table>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <VaPagination
          page={currentPage}
          pages={totalPages}
          maxPageListLength={10}
          showLastPage
          onPageSelect={e => setCurrentPage(e.detail.page)}
        />
      )}
    </>
  );
}
