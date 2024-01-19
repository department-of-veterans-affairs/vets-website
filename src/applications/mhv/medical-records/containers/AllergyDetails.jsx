import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import ItemList from '../components/shared/ItemList';
import { clearAllergyDetails, getAllergyDetails } from '../actions/allergies';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  processList,
} from '../util/helpers';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import {
  generatePdfScaffold,
  updatePageTitle,
} from '../../shared/util/helpers';
import useAlerts from '../hooks/use-alerts';
import DateSubheading from '../components/shared/DateSubheading';
import { txtLine } from '../../shared/util/constants';

const AllergyDetails = props => {
  const { runningUnitTest } = props;
  const allergy = useSelector(state => state.mr.allergies.allergyDetails);
  const allergyList = useSelector(state => state.mr.allergies.allergiesList);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { allergyId } = useParams();
  const dispatch = useDispatch();
  const activeAlert = useAlerts();

  useEffect(
    () => {
      if (allergyId) dispatch(getAllergyDetails(allergyId, allergyList));
    },
    [allergyId, allergyList, dispatch],
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
    [dispatch, allergy],
  );

  const generateAllergyPdf = async () => {
    const title = `Allergies and reactions: ${allergy.name}`;
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
          title: 'Signs and symptoms',
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
          title: 'Observed or historical',
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

    const pdfName = `VA-Allergies-details-${getNameDateAndTime(user)}`;

    makePdf(pdfName, scaffold, 'Allergy details', runningUnitTest);
  };

  const generateAllergyTxt = async () => {
    const content = `
    ${allergy.name} \n
    Date entered: ${allergy.date} \n
    ${txtLine} \n
    \t Signs and symptoms: ${allergy.reaction} \n
    \t Type of Allergy: ${allergy.type} \n
    \t Location: ${allergy.location} \n
    \t Observed or historical: ${allergy.observedOrReported} \n
    \t Provider notes: ${allergy.notes} \n`;

    generateTextFile(content, 'Allergy');
  };

  const content = () => {
    if (activeAlert && activeAlert.type === ALERT_TYPE_ERROR) {
      return (
        <>
          <h1 className="vads-u-margin-bottom--0p5">Allergy:</h1>
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.ALLERGY}
            className="vads-u-margin-bottom--9"
          />
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
          <DateSubheading
            date={allergy.date}
            label="Date entered"
            id="allergy-date"
          />

          <div className="condition-subheader vads-u-margin-bottom--4">
            <PrintDownload
              download={generateAllergyPdf}
              allowTxtDownloads={allowTxtDownloads}
              downloadTxt={generateAllergyTxt}
            />
            <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          </div>
          <div
            className="condition-details max-80"
            data-testid="allergy-reaction"
          >
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Signs and symptoms
            </h2>
            <ItemList list={allergy.reaction} />
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Type of allergy
            </h2>
            <p data-dd-privacy="mask" data-testid="allergy-type">
              {allergy.type}
            </p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Location
            </h2>
            <p data-dd-privacy="mask" data-testid="allergy-location">
              {allergy.location}
            </p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Observed or historical
            </h2>
            <p data-dd-privacy="mask" data-testid="allergy-observed">
              {allergy.observedOrReported}
            </p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Provider notes
            </h2>
            <p data-dd-privacy="mask" data-testid="allergy-notes">
              {allergy.notes}
            </p>
          </div>
        </>
      );
    }
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          message="Loading..."
          setFocus
          data-testid="loading-indicator"
        />
      </div>
    );
  };

  return <div className="vads-u-margin-bottom--5">{content()}</div>;
};

export default AllergyDetails;

AllergyDetails.propTypes = {
  runningUnitTest: PropTypes.bool,
};
