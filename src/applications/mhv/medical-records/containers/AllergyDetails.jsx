import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import ItemList from '../components/shared/ItemList';
import { clearAllergyDetails, getAllergyDetails } from '../actions/allergies';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import { processList, sendErrorToSentry } from '../util/helpers';
import { ALERT_TYPE_ERROR, pageTitles } from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import {
  generatePdfScaffold,
  updatePageTitle,
} from '../../shared/util/helpers';

const AllergyDetails = props => {
  const { runningUnitTest } = props;
  const allergy = useSelector(state => state.mr.allergies.allergyDetails);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { allergyId } = useParams();
  const dispatch = useDispatch();
  const alertList = useSelector(state => state.mr.alerts?.alertList);
  const [activeAlert, setActiveAlert] = useState();

  useEffect(
    () => {
      if (allergyId) dispatch(getAllergyDetails(allergyId));
    },
    [allergyId, dispatch],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/my-health/medical-records/allergies',
            label: 'Allergies',
          },
        ]),
      );
      return () => {
        dispatch(clearAllergyDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (allergy) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(`${allergy.name} - ${pageTitles.ALLERGIES_PAGE_TITLE}`);
      }
    },
    [dispatch, allergy, allergyId],
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

  const generateAllergyPdf = async () => {
    const title = `Allergy: ${allergy.name}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      items: [
        {
          title: 'Date entered',
          value: allergy.date,
          inline: true,
        },
        {
          title: 'Reaction',
          value: processList(allergy.reaction),
          inline: true,
        },
        {
          title: 'Type of allergy',
          value: allergy.type,
          inline: true,
        },
        {
          title: 'Location',
          value: allergy.location,
          inline: true,
        },
        {
          title: 'Observed or reported',
          value: allergy.observedOrReported,
          inline: true,
        },
        {
          title: 'Provider notes',
          value: allergy.notes,
          inline: !allergy.notes,
        },
      ],
    };

    try {
      if (!runningUnitTest) {
        await generatePdf(
          'medicalRecords',
          `VA-Allergies-details-${user.userFullName.first}-${
            user.userFullName.last
          }-${moment()
            .format('M-D-YYYY_hhmmssa')
            .replace(/\./g, '')}`,
          scaffold,
        );
      }
    } catch (error) {
      sendErrorToSentry(error, 'Allergy details');
    }
  };

  const content = () => {
    if (activeAlert && activeAlert.type === ALERT_TYPE_ERROR) {
      return (
        <>
          <h1 className="vads-u-margin-bottom--0p5">Allergy:</h1>
          <AccessTroubleAlertBox className="vads-u-margin-bottom--9" />
        </>
      );
    }
    if (allergy) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0p5"
            aria-describedby="allergy-date"
          >
            Allergies and reactions:{' '}
            <span data-dd-privacy="mask">{allergy.name}</span>
          </h1>
          <div className="condition-subheader vads-u-margin-bottom--4">
            <div className="time-header">
              <p
                className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--bold"
                id="allergy-date"
              >
                Date entered:{' '}
                <span
                  className="vads-u-font-weight--normal"
                  data-dd-privacy="mask"
                  data-testid="header-time"
                >
                  {allergy.date}
                </span>
              </p>
            </div>
            <PrintDownload
              download={generateAllergyPdf}
              allowTxtDownloads={allowTxtDownloads}
            />
            <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          </div>
          <div className="condition-details max-80">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Signs and symptoms
            </h2>
            <ItemList list={allergy.reaction} />
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Type of allergy
            </h2>
            <p data-dd-privacy="mask">{allergy.type}</p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Location
            </h2>
            <p data-dd-privacy="mask">{allergy.location}</p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Provider notes
            </h2>
            <p data-dd-privacy="mask">{allergy.notes}</p>
          </div>
        </>
      );
    }
    return (
      <>
        <va-loading-indicator
          message="Loading..."
          setFocus
          data-testid="loading-indicator"
          class="loading-indicator"
        />
      </>
    );
  };

  return <div className="vads-u-margin-bottom--5">{content()}</div>;
};

export default AllergyDetails;

AllergyDetails.propTypes = {
  print: PropTypes.func,
  runningUnitTest: PropTypes.bool,
};
