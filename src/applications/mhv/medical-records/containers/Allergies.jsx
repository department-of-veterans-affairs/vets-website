import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { RecordType } from '../util/constants';
import { getAllergiesList } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { getAllVaccinesPdf } from '../api/MrApi';
import { downloadFile } from '../util/helpers';

const Allergies = () => {
  const dispatch = useDispatch();
  const allergies = useSelector(state => state.mr.allergies.allergiesList);
  const fullState = useSelector(state => state);

  useEffect(() => {
    dispatch(getAllergiesList());
  }, []);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [{ url: '/my-health/medical-records/', label: 'Dashboard' }],
          {
            url: '/my-health/medical-records/allergies',
            label: 'Allergies',
          },
        ),
      );
    },
    [dispatch],
  );

  const download = () => {
    getAllVaccinesPdf().then(res => downloadFile('vaccines.pdf', res.pdf));
  };

  const content = () => {
    if (allergies?.length > 0) {
      return <RecordList records={allergies} type={RecordType.ALLERGIES} />;
    }
    if (allergies?.length === 0) {
      return (
        <div className="vads-u-margin-bottom--3">
          <va-alert background-only status="info">
            You don’t have any records in Allergies
          </va-alert>
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

  return (
    <div id="allergies">
      <PrintHeader />
      <h1 className="vads-u-margin--0">Allergies</h1>
      <p className="vads-u-margin-top--1">
        Review allergies and reactions in your VA medical records.
      </p>
      <va-additional-info
        trigger="What to know about allergy records"
        class="no-print"
      >
        <ul>
          <li className="vads-u-margin-bottom--2">
            <p className="vads-u-margin--0">
              If you have allergies that are missing from this list, send a
              secure message to your care team. You can also send a message to
              ask questions about your allergy records.
            </p>
            <a
              href={mhvUrl(
                isAuthenticatedWithSSOe(fullState),
                'secure-messaging',
              )}
              target="_blank"
              rel="noreferrer"
            >
              Compose a new message
            </a>
          </li>
          <li>
            <p className="vads-u-margin--0">
              This list doesn’t include information you entered yourself. To
              find information you entered, go back to your records on the My
              HealtheVet website.
            </p>
            <a
              href={mhvUrl(
                isAuthenticatedWithSSOe(fullState),
                'download-my-data',
              )}
              target="_blank"
              rel="noreferrer"
            >
              Go back to medical records on the My HealtheVet website
            </a>
          </li>
        </ul>
      </va-additional-info>

      <div className="vads-u-display--flex vads-u-margin-y--1 no-print">
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
          Print page
        </button>
        <button className="link-button" type="button" onClick={download}>
          <i
            aria-hidden="true"
            className="fas fa-download vads-u-margin-right--1"
          />
          Download page
        </button>
      </div>
      <va-additional-info
        trigger="What to know about downloading records"
        class="no-print"
      >
        <ul>
          <li>
            <strong>If you’re on a public or shared computer,</strong> print
            your records instead of downloading. Downloading will save a copy of
            your records to the public computer.
          </li>
          <li>
            <strong>If you use assistive technology,</strong> a Text file (.txt)
            may work better for technology such as screen reader, screen
            enlargers, or Braille displays.
          </li>
        </ul>
      </va-additional-info>

      {content()}
    </div>
  );
};

export default Allergies;
