import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import ItemList from '../components/shared/ItemList';
import { getAllergyDetails } from '../actions/allergies';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import { processList, sendErrorToSentry } from '../util/helpers';
import { ALERT_TYPE_ERROR, EMPTY_FIELD } from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import { generatePdfScaffold } from '../../shared/util/helpers';

const AllergyDetails = () => {
  const allergy = useSelector(state => state.mr.allergies.allergyDetails);
  const user = useSelector(state => state.user.profile);
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
      if (allergy) {
        dispatch(
          setBreadcrumbs(
            [
              {
                url: '/my-health/medical-records/allergies',
                label: 'Allergies',
              },
            ],
            {
              url: `/my-health/medical-records/allergies/${allergyId}`,
              label: allergy.name,
            },
          ),
        );
      }
    },
    [allergy],
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
    const title = `Allergy: ${allergy.name} on ${formatDateLong(allergy.date)}`;
    const subject = 'VA Medical Record';
    const preface =
      'Your allergies list may not be complete. If you have any questions about your information, visit the FAQs or contact your VA Health care team.';
    const scaffold = generatePdfScaffold(user, title, subject, preface);

    scaffold.details = {
      items: [
        {
          title: 'Date entered',
          value: allergy.date || EMPTY_FIELD,
          inline: true,
        },
        {
          title: 'Reaction',
          value: processList(allergy.reaction),
          inline: true,
        },
        {
          title: 'Type of allergy',
          value: allergy.type || EMPTY_FIELD,
          inline: true,
        },
        {
          title: 'VA drug class',
          value: allergy.drugClass || EMPTY_FIELD,
          inline: true,
        },
        {
          title: 'Location',
          value: allergy.location || EMPTY_FIELD,
          inline: true,
        },
        {
          title: 'Observed or reported',
          value: allergy.observed ? 'Observed' : 'Reported',
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
      await generatePdf('medicalRecords', 'allergy_report', scaffold);
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
          <h1 className="vads-u-margin-bottom--0p5">Allergy: {allergy.name}</h1>
          <section className="set-width-486">
            <div className="condition-subheader vads-u-margin-bottom--3">
              <div className="time-header">
                <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                  Date entered:{' '}
                </h2>
                <p>{allergy.date}</p>
              </div>
              <PrintDownload list download={generateAllergyPdf} />
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
                    <strong>If you use assistive technology,</strong> a Text
                    file (.txt) may work better for technology such as screen
                    reader, screen enlargers, or Braille displays.
                  </li>
                </ul>
              </va-additional-info>
            </div>
            <div className="condition-details max-80">
              <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                Reaction
              </h2>
              <ItemList list={allergy.reaction} />
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
              {allergy.notes}
            </div>
          </section>
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
