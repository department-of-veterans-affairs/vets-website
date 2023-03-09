import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { dateFormat, typeAndDose } from '../util/helpers';
import ItemList from '../components/shared/ItemList';
import { getVaccineDetails } from '../actions/vaccine';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const VaccineDetails = () => {
  const vaccineDetails = useSelector(state => state.mr.vaccines.vaccineDetails);
  const user = useSelector(state => state.user.profile);
  const { first, last, middle, suffix } = user.userFullName;
  const name = user.first
    ? `${last}, ${first} ${middle}, ${suffix}`
    : 'Doe, John R., Jr.';
  const dob = user.dob || '12/12/1980';
  const { vaccineId } = useParams();
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (vaccineId) dispatch(getVaccineDetails(vaccineId));
    },
    [vaccineId, dispatch],
  );
  const formattedDate = dateFormat(vaccineDetails?.date, 'MMMM D, YYYY');

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [
            { url: '/my-health/medical-records/', label: 'Dashboard' },
            {
              url: '/my-health/medical-records/health-history',
              label: 'Health history',
            },
            {
              url: '/my-health/medical-records/vaccines',
              label: 'VA vaccines',
            },
          ],
          {
            url: `/my-health/medical-records/vaccine-details/${vaccineId}`,
            label: vaccineDetails?.name,
          },
        ),
      );
    },
    [vaccineDetails, dispatch],
  );

  const content = () => {
    if (vaccineDetails) {
      return (
        <>
          <div className="print-only print-header">
            <span>
              {name} - {dob}
            </span>
            <h4>CONFIDENTIAL</h4>
          </div>
          <h1 className="vaccine-header">{vaccineDetails.name}</h1>
          <div className="vads-u-display--flex vads-u-margin-y--3 no-print">
            <button
              className="link-button vads-u-margin-right--3 no-print"
              type="button"
              onClick={window.print}
            >
              <i
                aria-hidden="true"
                className="fas fa-print vads-u-margin-right--1"
                data-testid="print-records-button"
              />
              Print page
            </button>
            <button className="link-button no-print" type="button">
              <i
                aria-hidden="true"
                className="fas fa-download vads-u-margin-right--1"
              />
              Download page
            </button>
          </div>
          <div className="detail-block">
            <h2 className="vads-u-margin-top--0">Date received</h2>
            <p>{formattedDate}</p>
            <h2>Type and dosage</h2>
            <p>{typeAndDose(vaccineDetails.type, vaccineDetails.dosage)}</p>
            <h2>Series</h2>
            <p>
              {vaccineDetails.series ||
                'There is no series reported at this time'}
            </p>
            <h2>Location</h2>
            <p>
              {vaccineDetails.facility ||
                'There is no facility reported at this time'}
            </p>
            <h2>Reactions recorded by provider</h2>
            <ItemList
              list={vaccineDetails.reactions}
              emptyMessage="None reported"
            />
            <h2>Provider comments</h2>
            <ItemList
              list={vaccineDetails.comments}
              emptyMessage="No comments at this time"
            />
          </div>

          <iframe
            title="contentsToPrint"
            id="contentsToPrint"
            style={{
              height: '0px',
              width: '0px',
              position: 'absolute',
              border: 'none',
            }}
          />
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
    <div
      className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5"
      id="vaccine-details"
    >
      {content()}
    </div>
  );
};

export default VaccineDetails;

VaccineDetails.propTypes = {
  print: PropTypes.func,
};
