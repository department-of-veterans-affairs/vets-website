import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ItemList from '../components/shared/ItemList';
import { getAllergyDetails } from '../actions/allergies';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';

const AllergyDetails = () => {
  const allergy = useSelector(state => state.mr.allergies.allergyDetails);
  const { allergyId } = useParams();
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (allergyId) dispatch(getAllergyDetails(allergyId));
    },
    [allergyId, dispatch],
  );

  useEffect(
    () => {
      if (allergy) {
        dispatch(
          setBreadcrumbs(
            [
              { url: '/my-health/medical-records/', label: 'Dashboard' },
              {
                url: '/my-health/medical-records/health-history',
                label: 'Health history',
              },
              {
                url: '/my-health/medical-records/health-history/allergies',
                label: 'VA allergies',
              },
            ],
            {
              url: `/my-health/medical-records/health-history/allergies/${allergyId}`,
              label: allergy.name,
            },
          ),
        );
      }
    },
    [allergy],
  );

  const download = () => {};

  const content = () => {
    if (allergy) {
      return (
        <>
          <PrintHeader />
          <h1 className="vads-u-margin-bottom--0p5">Allergy: {allergy.name}</h1>
          <div className="condition-subheader vads-u-margin-bottom--3">
            <div className="time-header">
              <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                Date entered:{' '}
              </h2>
              <p>{allergy.date}</p>
            </div>
            <PrintDownload list download={download} />
            <va-additional-info
              trigger="What to know about downloading records"
              class="no-print"
            >
              <ul>
                <li>
                  <strong>If you’re on a public or shared computer,</strong>{' '}
                  print your records instead of downloading. Downloading will
                  save a copy of your records to the public computer.
                </li>
                <li>
                  <strong>If you use assistive technology,</strong> a Text file
                  (.txt) may work better for technology such as screen reader,
                  screen enlargers, or Braille displays.
                </li>
              </ul>
            </va-additional-info>
          </div>

          <div className="condition-details max-80">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Reaction
            </h2>
            <ItemList list={allergy.reaction} emptyMessage="None noted" />
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Type of allergy
            </h2>
            <p>{allergy.type || 'None noted'}</p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              VA drug class
            </h2>
            <p>{allergy.drugClass || 'None noted'}</p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Location
            </h2>
            <p>{allergy.location || 'None noted'}</p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Observed or reported
            </h2>
            <p>
              {allergy.observed
                ? 'Observed (your provider observed the reaction in person)'
                : 'Reported (you told your provider about the reaction)'}
            </p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Provider notes
            </h2>
            <ItemList list={allergy.notes} emptyMessage="None noted" />
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

export default AllergyDetails;

AllergyDetails.propTypes = {
  print: PropTypes.func,
};
