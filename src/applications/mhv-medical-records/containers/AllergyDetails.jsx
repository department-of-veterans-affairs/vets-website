import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
  formatNameFirstLast,
  getNameDateAndTime,
  makePdf,
  formatUserDob,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';

import ItemList from '../components/shared/ItemList';
import { clearAllergyDetails, getAllergyDetails } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import { generateTextFile, itemListWrapper } from '../util/helpers';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
  statsdFrontEndActions,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import DateSubheading from '../components/shared/DateSubheading';
import { generateAllergyItem } from '../util/pdfHelpers/allergies';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import HeaderSection from '../components/shared/HeaderSection';
import LabelValue from '../components/shared/LabelValue';

import { useTrackAction } from '../hooks/useTrackAction';

const AllergyDetails = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const allergy = useSelector(state => state.mr.allergies.allergyDetails);
  const allergyList = useSelector(state => state.mr.allergies.allergiesList);
  const user = useSelector(state => state.user.profile);

  const { isLoading, isCerner, isAcceleratingAllergies } = useAcceleratedData();

  const { allergyId } = useParams();
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);
  useTrackAction(statsdFrontEndActions.ALLERGIES_DETAILS);

  const allergyData = useMemo(
    () => {
      if (!allergy) {
        return null;
      }
      return {
        ...allergy,
        // Note: isOracleHealthData is true for both v2 unified data and v1 OH data
        // The v2 endpoint combines Oracle Health and VistA records into a single format,
        // and the backend doesn't provide a field to distinguish the source.
        // Components use this flag to determine which template to render.
        isOracleHealthData: isAcceleratingAllergies || isCerner,
      };
    },
    [allergy, isAcceleratingAllergies, isCerner],
  );

  useEffect(
    () => {
      if (allergyId && !isLoading) {
        dispatch(
          getAllergyDetails(
            allergyId,
            allergyList,
            isAcceleratingAllergies,
            isCerner,
          ),
        );
      }
      updatePageTitle(pageTitles.ALLERGY_DETAILS_PAGE_TITLE);
    },
    [
      allergyId,
      allergyList,
      dispatch,
      isLoading,
      isAcceleratingAllergies,
      isCerner,
    ],
  );

  useEffect(
    () => {
      if (allergyData) {
        focusElement(document.querySelector('h1'));
      }
    },
    [allergyData],
  );

  useEffect(
    () => {
      return () => {
        dispatch(clearAllergyDetails());
      };
    },
    [dispatch],
  );

  usePrintTitle(
    pageTitles.ALLERGIES_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateAllergyPdf = async () => {
    setDownloadStarted(true);
    const title = allergyData.name;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = { ...scaffold, details: generateAllergyItem(allergyData) };
    const pdfName = `VA-allergies-details-${getNameDateAndTime(user)}`;
    makePdf(
      pdfName,
      pdfData,
      'medicalRecords',
      'Medical Records - Allergy details - PDF generation error',
      runningUnitTest,
    );
  };

  const generateAllergyTextContent = () => {
    if (allergyData.isOracleHealthData) {
      return `
      ${crisisLineHeader}\n\n
      ${allergyData.name}\n
      ${formatNameFirstLast(user.userFullName)}\n
      Date of birth: ${formatUserDob(user)}\n
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
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
${txtLine} \n
Date entered: ${allergyData.date} \n
Signs and symptoms: ${allergyData.reaction} \n
Type of allergy: ${allergyData.type} \n
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

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.ALLERGY}
        className="vads-u-margin-bottom--9"
      />
    );
  }

  const content = () => {
    if (allergyData) {
      return (
        <>
          <PrintHeader />

          <HeaderSection
            header={`${allergyData.name}`}
            className="vads-u-margin-bottom--0p5"
            aria-describedby="allergy-date"
            data-dd-privacy="mask"
            data-dd-action-name="[allergy name]"
          >
            <DateSubheading
              date={allergyData.date}
              label="Date entered"
              id="allergy-date"
            />

            {downloadStarted && <DownloadSuccessAlert />}

            <div
              className="max-80 vads-u-margin-top--4"
              data-testid="allergy-reaction"
            >
              <LabelValue
                label="Signs and symptoms"
                element={itemListWrapper(allergyData?.reaction)}
                testId="allergy-signs-symptoms"
              >
                <ItemList list={allergyData.reaction} />
              </LabelValue>
              <LabelValue
                label="Type of allergy"
                value={allergyData.type}
                testId="allergy-type"
                actionName="[allergy type]"
              />
              {!allergyData.isOracleHealthData && (
                <LabelValue
                  label="Location"
                  value={allergyData.location}
                  testId="allergy-location"
                  actionName="[allergy location]"
                />
              )}
              {!allergyData.isOracleHealthData && (
                <LabelValue
                  label="Observed or historical"
                  value={allergyData.observedOrReported}
                  testId="allergy-observed"
                  actionName="[allergy observed]"
                />
              )}
              {allergyData.isOracleHealthData && (
                <LabelValue
                  label="Recorded by"
                  value={allergyData.provider}
                  testId="allergy-recorded-by"
                  actionName="[allergy recorded by]"
                />
              )}
              <LabelValue
                label="Provider notes"
                value={allergyData.notes}
                testId="allergy-notes"
                actionName="[allergy provider notes]"
              />
            </div>
            <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
            <DownloadingRecordsInfo description="Allergy Detail" />
            <PrintDownload
              description="Allergies Detail"
              downloadPdf={generateAllergyPdf}
              downloadTxt={generateAllergyTxt}
            />
            <br />
            <br />
            <br />
            <div className="vads-u-margin-bottom--300 vads-u-border-top--1px vads-u-border-color--white" />
          </HeaderSection>
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
