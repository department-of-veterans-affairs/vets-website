import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { selectDrupalStaticData } from 'platform/site-wide/drupal-static-data/selectors';
import ItemList from '../components/shared/ItemList';
import { clearAllergyDetails, getAllergyDetails } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  formatNameFirstLast,
  generateTextFile,
  getNameDateAndTime,
  makePdf,
} from '../util/helpers';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import DateSubheading from '../components/shared/DateSubheading';
import { generateAllergyItem } from '../util/pdfHelpers/allergies';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';

import useAcceleratedData from '../hooks/useAcceleratedData';

const AllergyDetails = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const allergy = useSelector(state => state.mr.allergies.allergyDetails);
  const allergyList = useSelector(state => state.mr.allergies.allergiesList);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );

  const { vamcEhrData } = useSelector(selectDrupalStaticData);

  const { isAccelerating } = useAcceleratedData();

  const { allergyId } = useParams();
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const allergyData = useMemo(
    () => {
      if (!allergy) {
        return null;
      }
      return {
        ...allergy,
        isOracleHealthData: isAccelerating,
      };
    },
    [allergy, isAccelerating],
  );

  useEffect(
    () => {
      if (allergyId && !vamcEhrData?.loading) {
        dispatch(getAllergyDetails(allergyId, allergyList, isAccelerating));
      }
    },
    [allergyId, allergyList, dispatch, isAccelerating, vamcEhrData?.loading],
  );

  useEffect(
    () => {
      return () => {
        dispatch(clearAllergyDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (allergyData) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(
          `${allergyData.name} - ${pageTitles.ALLERGIES_PAGE_TITLE}`,
        );
      }
    },
    [dispatch, allergyData],
  );

  usePrintTitle(
    pageTitles.ALLERGIES_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateAllergyPdf = async () => {
    setDownloadStarted(true);
    const title = `Allergies and reactions: ${allergyData.name}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = { ...scaffold, details: generateAllergyItem(allergyData) };
    const pdfName = `VA-allergies-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Allergy details', runningUnitTest);
  };

  const generateAllergyTextContent = () => {
    if (isAccelerating) {
      return `
      ${crisisLineHeader}\n\n
      ${allergyData.name}\n
      ${formatNameFirstLast(user.userFullName)}\n
      Date of birth: ${formatDateLong(user.dob)}\n
      ${reportGeneratedBy}\n
      Date entered: ${allergyData.date} \n
      ${txtLine} \n
      Signs and symptoms: ${allergyData.reaction} \n
      Type of Allergy: ${allergyData.type} \n
      Recorded by: ${allergyData.provider} \n
      Provider notes: ${allergyData.notes} \n`;
    }
    return `
${crisisLineHeader}\n\n
${allergyData.name}\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
Date entered: ${allergyData.date} \n
${txtLine} \n
Signs and symptoms: ${allergyData.reaction} \n
Type of Allergy: ${allergyData.type} \n
Location: ${allergyData.location} \n
Observed or historical: ${allergyData.observedOrReported} \n
Provider notes: ${allergyData.notes} \n`;
  };

  const generateAllergyTxt = async () => {
    setDownloadStarted(true);

    const content = generateAllergyTextContent();

    const fileName = `VA-allergies-details-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
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
    if (allergyData) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0p5"
            aria-describedby="allergy-date"
          >
            Allergies and reactions:{' '}
            <span data-dd-privacy="mask">{allergyData.name}</span>
          </h1>
          <DateSubheading
            date={allergyData.date}
            label="Date entered"
            id="allergy-date"
          />

          {downloadStarted && <DownloadSuccessAlert />}
          <PrintDownload
            downloadPdf={generateAllergyPdf}
            allowTxtDownloads={allowTxtDownloads}
            downloadTxt={generateAllergyTxt}
          />
          <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />

          <div
            className="condition-details max-80 vads-u-margin-top--4"
            data-testid="allergy-reaction"
          >
            <h2 className="vads-u-font-family--sans">Signs and symptoms</h2>
            <ItemList list={allergyData.reaction} />
            <h2 className="vads-u-font-family--sans">Type of allergy</h2>
            <p data-dd-privacy="mask" data-testid="allergy-type">
              {allergyData.type}
            </p>
            {!allergyData.isOracleHealthData && (
              <>
                <h2 className="vads-u-font-family--sans">Location</h2>
                <p data-dd-privacy="mask" data-testid="allergy-location">
                  {allergyData.location}
                </p>
              </>
            )}
            {!allergyData.isOracleHealthData && (
              <>
                <h2 className="vads-u-font-family--sans">
                  Observed or historical
                </h2>
                <p data-dd-privacy="mask" data-testid="allergy-observed">
                  {allergyData.observedOrReported}
                </p>
              </>
            )}
            {allergyData.isOracleHealthData && (
              <>
                <h2 className="vads-u-font-family--sans">Recorded by</h2>
                <p data-dd-privacy="mask" data-testid="allergy-observed">
                  {allergyData.provider}
                </p>
              </>
            )}
            <h2 className="vads-u-font-family--sans">Provider notes</h2>
            <p data-dd-privacy="mask" data-testid="allergy-notes">
              {allergyData.notes}
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
