import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dateFormat } from '../util/helpers';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getVitalsList } from '../actions/vitals';

const MAX_PAGE_LIST_LENGTH = 5;
const VitalDetails = () => {
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const [filteredVitals, setFilteredVitals] = useState(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [vitalType, setVitalType] = useState('');
  const user = useSelector(state => state.user.profile);
  const { first, last, middle, suffix } = user.userFullName;
  const name = user.first
    ? `${last}, ${first} ${middle}, ${suffix}`
    : 'Doe, John R., Jr.';
  const dob = user.dob || '12/12/1980';
  const { vitalTypeWithPlus } = useParams();
  const dispatch = useDispatch();

  const perPage = 5;
  const [currentVitals, setCurrentVitals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedVitals = useRef([]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs(
        [
          { url: '/my-health/medical-records/', label: 'Dashboard' },
          {
            url: '/my-health/medical-records/health-history',
            label: 'Health history',
          },
          { url: '/my-health/medical-records/vitals', label: 'VA vitals' },
        ],
        {
          url: `/my-health/medical-records/vital-details/${vitalType}`,
          label: vitalType,
        },
      ),
    );
  });

  const paginateData = data => {
    return chunk(data, perPage);
  };

  const onPageChange = page => {
    setCurrentVitals(paginatedVitals.current[page - 1]);
    setCurrentPage(page);
  };

  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  useEffect(
    () => {
      if (filteredVitals?.length) {
        paginatedVitals.current = paginateData(filteredVitals);
        setCurrentVitals(paginatedVitals.current[currentPage - 1]);
      }
    },
    [currentPage, filteredVitals],
  );

  const displayNums = fromToNums(currentPage, filteredVitals?.length);

  useEffect(() => {
    dispatch(getVitalsList());
    setTotalEntries(filteredVitals?.length);
  });

  useEffect(
    () => {
      setVitalType(vitalTypeWithPlus?.replace('+', ' '));
    },
    [vitalTypeWithPlus],
  );

  useEffect(
    () => {
      setFilteredVitals(vitals?.filter(vital => vital.name === vitalType));
    },
    [vitals],
  );

  const content = () => {
    if (filteredVitals?.length) {
      return (
        <>
          <div className="vads-u-padding-y--1 vads-u-margin-bottom--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print">
            Displaying {displayNums[0]}
            &#8211;
            {displayNums[1]} of {totalEntries} vital records
          </div>
          <ul className="vital-details no-print">
            {currentVitals?.length > 0 &&
              currentVitals?.map((vital, idx) => (
                <li key={idx}>
                  <strong>Measurement:</strong>
                  <p>{vital.measurement}</p>
                  <strong>{idx === 0 ? 'Most recent date:' : 'Date'}</strong>
                  <p>{dateFormat(vital.date, 'MMMM D, YYYY')}</p>
                  <strong>Location:</strong>
                  <p>{vital.facility}</p>
                  <strong>Provider comments:</strong>
                  {vital?.comments?.length > 0 ? (
                    <ul className="comment-list">
                      {vital.comments.map((comment, commentIdx) => (
                        <li key={commentIdx}>{comment}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>None noted</p>
                  )}
                </li>
              ))}
          </ul>
          <ul className="vital-details print-only">
            {filteredVitals?.length > 0 &&
              filteredVitals?.map((vital, idx) => (
                <li key={idx}>
                  <strong>Measurement:</strong>
                  <p>{vital.measurement}</p>
                  <strong>{idx === 0 ? 'Most recent date:' : 'Date'}</strong>
                  <p>{dateFormat(vital.date, 'MMMM D, YYYY')}</p>
                  <strong>Location:</strong>
                  <p>{vital.facility}</p>
                  <strong>Provider comments:</strong>
                  {vital?.comments?.length > 0 ? (
                    <ul className="comment-list">
                      {vital.comments.map((comment, commentIdx) => (
                        <li key={commentIdx}>{comment}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>None noted</p>
                  )}
                </li>
              ))}
          </ul>
          <div className="vads-u-margin-bottom--2 no-print">
            <VaPagination
              onPageSelect={e => onPageChange(e.detail.page)}
              page={currentPage}
              pages={paginatedVitals.current.length}
              maxPageListLength={MAX_PAGE_LIST_LENGTH}
              showLastPage
            />
          </div>
        </>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return (
    <>
      <div className="print-only print-header">
        <span>
          {name} - {dob}
        </span>
        <h4>CONFIDENTIAL</h4>
      </div>
      <h1>{vitalType}</h1>
      <div className="vads-u-display--flex vads-u-margin-y--3 no-print">
        <button
          className="link-button vads-u-margin-right--3"
          type="button"
          data-testid="print-records-button"
          onClick={window.print}
        >
          <i
            aria-hidden="true"
            className="fas fa-print vads-u-margin-right--1"
          />
          Print list
        </button>
        <button className="link-button" type="button">
          <i
            aria-hidden="true"
            className="fas fa-download vads-u-margin-right--1"
          />
          Download list
        </button>
      </div>
      {content()}
    </>
  );
};

export default VitalDetails;

VitalDetails.propTypes = {
  print: PropTypes.func,
};
