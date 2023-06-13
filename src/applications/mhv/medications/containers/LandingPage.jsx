import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPrescriptionsList } from '../actions/prescriptions';
import MedicationsList from './MedicaitonsList';
import MedicationsListSort from './MedicationsListSort';

const LandingPage = () => {
  const prescriptions = useSelector(
    state => state.rx.prescriptions.prescriptionsList,
  );
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getPrescriptionsList());
    },
    [dispatch],
  );

  const content = () => {
    if (prescriptions) {
      return (
        <div className="landing-page">
          <h1 className="vads-u-margin-bottom--1p5">Medications</h1>
          <div>
            Review your prescription medicaitons from VA, and providers outside
            of our network
          </div>
          <div>
            <button
              type="button"
              className="link-button vads-u-display--block vads-u-margin-bottom--2"
              data-testid="print-records-button"
            >
              <i
                aria-hidden="true"
                className="fas fa-print vads-u-margin-right--0p5"
              />
              Print medication list
            </button>
            <button
              type="button"
              className="link-button vads-u-display--block vads-u-margin-bottom--2"
            >
              <i
                aria-hidden="true"
                className="fas fa-download vads-u-margin-right--0p5"
              />
              Download list as a PDF
            </button>
            <button
              type="button"
              className="link-button vads-u-display--block vads-u-margin-bottom--2"
            >
              <i
                aria-hidden="true"
                className="fas fa-download vads-u-margin-right--0p5"
              />
              Download list as a Text file
            </button>
            <va-additional-info trigger="What to know about downloading records">
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
            <MedicationsListSort />
            <div className="rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter vads-u-padding--0p5">
              Showing 1 - 20 of 51 medications
            </div>
            <MedicationsList rxList={prescriptions} />
          </div>
        </div>
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

  return <div className="vads-u-margin-top--3">{content()}</div>;
};

export default LandingPage;
