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
import PrintDownload from '../components/shared/PrintDownload';

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
                url:
                  '/my-health/medical-records/health-history/health-conditions',
                label: 'VA health conditions',
              },
            ],
            {
              url: `/my-health/medical-records/health-history/condition-details/${conditionId}`,
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
          <h1 className="vads-u-margin-bottom--0">
            {conditionDetails.name.split(' (')[0]}
          </h1>
          <div className="set-width">
            <div className="condition-subheader vads-u-margin-bottom--3">
              <div className="time-header">
                <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                  Date and time entered:{' '}
                </h2>
                <p>{formattedDate}</p>
              </div>
              <PrintDownload list download={download} />
            </div>

            <div className="condition-details max-80">
              <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                Status of health condition
              </h2>
              <p>{conditionDetails.active ? 'Active' : 'Inactive'}</p>
              <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                Provider
              </h2>
              <p>{conditionDetails.provider}</p>
              <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                Location
              </h2>
              <p>
                {conditionDetails.facility ||
                  'There is no facility reported at this time'}
              </p>
              <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                SNOMED Clinical term
              </h2>
              <p>{conditionDetails.name}</p>
              <h2 className="vads-u-margin-bottom--0">Provider comments</h2>
              <ItemList
                list={conditionDetails.comments}
                emptyMessage="No comments at this time"
              />
            </div>
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
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {content()}
    </div>
  );
};

export default ConditionDetails;

ConditionDetails.propTypes = {
  print: PropTypes.func,
};
