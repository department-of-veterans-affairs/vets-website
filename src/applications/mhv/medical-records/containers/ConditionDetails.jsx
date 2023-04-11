import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { dateFormat, downloadFile } from '../util/helpers';
import ItemList from '../components/shared/ItemList';
import { getConditionDetails } from '../actions/conditions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import { getVaccinePdf } from '../api/MrApi';

const ConditionDetails = () => {
  const conditionDetails = useSelector(
    state => state.mr.conditions.conditionDetails,
  );
  const { conditionId } = useParams();
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (conditionId) dispatch(getConditionDetails(conditionId));
    },
    [conditionId, dispatch],
  );
  const formattedDate = dateFormat(
    conditionDetails?.date,
    'MMMM D, YYYY [at] h:mm z',
  );

  useEffect(
    () => {
      if (conditionDetails?.name) {
        dispatch(
          setBreadcrumbs(
            [
              { url: '/my-health/medical-records/', label: 'Dashboard' },
              {
                url: '/my-health/medical-records/health-history',
                label: 'Health history',
              },
              {
                url: '/my-health/medical-records/health-history/conditions',
                label: 'VA health conditions',
              },
            ],
            {
              url: `/my-health/medical-records/health-history/conditions/${conditionId}`,
              label: conditionDetails?.name,
            },
          ),
        );
      }
    },
    [conditionDetails, dispatch],
  );

  const download = () => {
    getVaccinePdf(1).then(res => downloadFile('condition.pdf', res.pdf));
  };

  const content = () => {
    if (conditionDetails) {
      return (
        <>
          <PrintHeader />
          <h1 className="condition-header">
            {conditionDetails.name.split('(')[0]}
          </h1>
          <div className="time-header">
            <h2>Date and time entered: </h2>
            <p>{formattedDate}</p>
          </div>
          <div className="condition-buttons vads-u-display--flex vads-u-padding-y--3 vads-u-margin-y--0 no-print">
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
            <button
              className="link-button no-print"
              type="button"
              onClick={download}
            >
              <i
                aria-hidden="true"
                className="fas fa-download vads-u-margin-right--1"
              />
              Download page
            </button>
          </div>
          <div className="condition-details max-80">
            <h2>Status of health condition</h2>
            <p>{conditionDetails.active ? 'Active' : 'Inactive'}</p>
            <h2>Provider</h2>
            <p>{conditionDetails.provider}</p>
            <h2>Location</h2>
            <p>
              {conditionDetails.facility ||
                'There is no facility reported at this time'}
            </p>
            <h2>SNOMED Clinical term</h2>
            <p>{conditionDetails.name}</p>
            <h2 className="vads-u-margin-bottom--0">Provider comments</h2>
            <ItemList
              list={conditionDetails.comments}
              emptyMessage="No comments at this time"
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
    <div
      className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5"
      id="condition-details"
    >
      {content()}
    </div>
  );
};

export default ConditionDetails;

ConditionDetails.propTypes = {
  print: PropTypes.func,
};
