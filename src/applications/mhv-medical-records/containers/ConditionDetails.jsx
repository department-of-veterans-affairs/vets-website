import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  updatePageTitle,
  generatePdfScaffold,
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
import {
  generateTextFile,
  processList,
  itemListWrapper,
} from '../util/helpers';
import ItemList from '../components/shared/ItemList';
import {
  getConditionDetails,
  clearConditionDetails,
} from '../actions/conditions';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
  statsdFrontEndActions,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import DateSubheading from '../components/shared/DateSubheading';
import { generateConditionContent } from '../util/pdfHelpers/conditions';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import HeaderSection from '../components/shared/HeaderSection';
import LabelValue from '../components/shared/LabelValue';
import { useTrackAction } from '../hooks/useTrackAction';

const ConditionDetails = props => {
  const { runningUnitTest } = props;
  const record = useSelector(state => state.mr.conditions.conditionDetails);
  const conditionList = useSelector(
    state => state.mr.conditions.conditionsList,
  );
  const user = useSelector(state => state.user.profile);
  const { conditionId } = useParams();
  const dispatch = useDispatch();
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);
  useTrackAction(statsdFrontEndActions.HEALTH_CONDITIONS_DETAILS);

  useEffect(
    () => {
      return () => {
        dispatch(clearConditionDetails());
      };
    },
    [dispatch],
  );

  const { isAcceleratingConditions } = useAcceleratedData();

  useEffect(
    () => {
      if (conditionId)
        dispatch(
          getConditionDetails(
            conditionId,
            conditionList,
            isAcceleratingConditions,
          ),
        );
    },
    [conditionId, conditionList, isAcceleratingConditions, dispatch],
  );

  useEffect(
    () => {
      if (record?.name) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(pageTitles.HEALTH_CONDITIONS_DETAILS_PAGE_TITLE);
      }
    },
    [record],
  );

  usePrintTitle(
    pageTitles.HEALTH_CONDITIONS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateConditionDetailsPdf = async () => {
    setDownloadStarted(true);
    const title = `${record.name}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = { ...scaffold, ...generateConditionContent(record) };
    const pdfName = `VA-conditions-details-${getNameDateAndTime(user)}`;
    makePdf(
      pdfName,
      pdfData,
      'medicalRecords',
      'Medical Records - Condition details - PDF generation error',
      runningUnitTest,
    );
  };

  const generateConditionTxt = async () => {
    setDownloadStarted(true);
    const content = `
${crisisLineHeader}\n\n
${record.name} \n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
${txtLine}\n
Date entered: ${record.date}\n
Provider: ${record.provider}\n
Location: ${record.facility}\n
Provider Notes: ${processList(record.comments)}\n`;

    const fileName = `VA-Conditions-details-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  function containsSctOrIcd(inputString) {
    const regex = /\b(sct|icd)/i;
    return regex.test(inputString);
  }

  const content = () => {
    if (accessAlert) {
      return (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.HEALTH_CONDITIONS}
          className="vads-u-margin-bottom--9"
        />
      );
    }
    if (record) {
      return (
        <>
          <PrintHeader />
          <HeaderSection
            header={`${record.name}`}
            className="vads-u-margin-bottom--0"
            aria-describedby="condition-date"
            data-dd-privacy="mask"
            data-dd-action-name="[condition details - name]"
          >
            <DateSubheading
              date={record.date}
              id="condition-date"
              label="Date entered"
            />

            {downloadStarted && <DownloadSuccessAlert />}

            <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />

            <div className="max-80">
              <LabelValue
                label="Provider"
                value={record.provider}
                testId="condition-provider"
                actionName="[condition details - provider]"
              />
              <LabelValue
                label="Location"
                value={record.facility}
                ifEmpty="There is no facility reported at this time"
                testId="condition-location"
                actionName="[condition details - location]"
              />
              <LabelValue
                label="Provider notes"
                element={itemListWrapper(record?.comments)}
                testId="condition-provider-notes"
              >
                <ItemList list={record.comments} />
              </LabelValue>
              {containsSctOrIcd(record.name) && (
                <LabelValue
                  label="About the code in this condition name"
                  testId="about-the-condition-code"
                >
                  Some of your health conditions may have diagnosis codes in the
                  name that start with SCT or ICD. Providers use these codes to
                  track your health conditions and to communicate with other
                  providers about your care. If you have a question about these
                  codes or a health condition, ask your provider at your next
                  appointment.
                </LabelValue>
              )}
            </div>
            <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
            <DownloadingRecordsInfo description="Health Conditions Detail" />
            <PrintDownload
              description="Health Conditions Detail"
              downloadPdf={generateConditionDetailsPdf}
              downloadTxt={generateConditionTxt}
            />
            <div className="vads-u-margin-y--5 vads-u-border-top--1px" />
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

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {content()}
    </div>
  );
};

export default ConditionDetails;

ConditionDetails.propTypes = {
  runningUnitTest: PropTypes.bool,
};
