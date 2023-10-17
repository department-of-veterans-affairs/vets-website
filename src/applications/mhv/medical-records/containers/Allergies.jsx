import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { recordType, ALERT_TYPE_ERROR, pageTitles } from '../util/constants';
import { getAllergiesList } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import { processList, sendErrorToSentry } from '../util/helpers';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import {
  updatePageTitle,
  generatePdfScaffold,
} from '../../shared/util/helpers';

const Allergies = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const allergies = useSelector(state => state.mr.allergies.allergiesList);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const user = useSelector(state => state.user.profile);
  const alertList = useSelector(state => state.mr.alerts?.alertList);
  const [activeAlert, setActiveAlert] = useState();

  useEffect(
    () => {
      dispatch(getAllergiesList());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (alertList?.length) {
        const filteredSortedAlerts = alertList
          .filter(alert => alert.isActive)
          .sort((a, b) => {
            // Sort chronologically descending.
            return b.datestamp - a.datestamp;
          });
        if (filteredSortedAlerts.length > 0) {
          // The activeAlert is the most recent alert marked as active.
          setActiveAlert(filteredSortedAlerts[0]);
        }
      }
    },
    [alertList],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          { url: '/my-health/medical-records/', label: 'Medical records' },
        ]),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.ALLERGIES_PAGE_TITLE);
    },
    [dispatch],
  );

  const generateAllergiesPdf = async () => {
    const title = 'Allergies';
    const subject = 'VA Medical Record';
    const preface = `This list includes all allergies your VA providers have entered. If you have allergies that are missing from this list, contact your care team.\n\nShowing ${
      allergies.length
    } records from newest to oldest`;
    const pdfData = generatePdfScaffold(user, title, subject, preface);
    pdfData.results = { items: [] };

    allergies.forEach(item => {
      pdfData.results.items.push({
        header: item.name,
        items: [
          {
            title: 'Date entered',
            value: item.date,
            inline: true,
          },
          {
            title: 'Reaction',
            value: processList(item.reaction),
            inline: true,
          },
          {
            title: 'Type of allergy',
            value: item.type,
            inline: true,
          },
          {
            title: 'Location',
            value: item.location,
            inline: true,
          },
          {
            title: 'Observed or reported',
            value: item.observedOrReported,
            inline: true,
          },
          {
            title: 'Provider notes',
            value: item.notes,
            inline: !item.notes,
          },
        ],
      });
    });

    try {
      if (!runningUnitTest) {
        await generatePdf(
          'medicalRecords',
          `VA-Allergies-list-${user.userFullName.first}-${
            user.userFullName.last
          }-${moment()
            .format('M-D-YYYY_hhmmssa')
            .replace(/\./g, '')}`,
          pdfData,
        );
      }
    } catch (error) {
      sendErrorToSentry(error, 'Allergies');
    }
  };

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return <AccessTroubleAlertBox />;
    }
    if (allergies?.length > 0) {
      return <RecordList records={allergies} type={recordType.ALLERGIES} />;
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
        class="loading-indicator"
      />
    );
  };

  return (
    <div id="allergies">
      <PrintHeader />
      <h1 className="vads-u-margin--0">Allergies and reactions</h1>
      <p className="page-description">
        Review allergies, reactions, and side effects in your VA medical
        records. This includes medication side effects (also called adverse drug
        reactions).
      </p>
      <p className="page-description">
        If you have allergies that are missing from this list, tell your care
        team at your next appointment.
      </p>
      {!accessAlert && (
        <>
          <PrintDownload
            list
            download={generateAllergiesPdf}
            allowTxtDownloads={allowTxtDownloads}
          />
          <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
        </>
      )}
      {content()}
    </div>
  );
};

export default Allergies;

Allergies.propTypes = {
  runningUnitTest: PropTypes.bool,
};
