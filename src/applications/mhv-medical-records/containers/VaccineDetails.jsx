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

import { generateTextFile } from '../util/helpers';
import { clearVaccineDetails, getVaccineDetails } from '../actions/vaccines';
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
import { generateVaccineItem } from '../util/pdfHelpers/vaccines';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import HeaderSection from '../components/shared/HeaderSection';
import LabelValue from '../components/shared/LabelValue';
import { useTrackAction } from '../hooks/useTrackAction';

const VaccineDetails = props => {
  const { runningUnitTest } = props;
  const record = useSelector(state => state.mr.vaccines.vaccineDetails);
  const vaccines = useSelector(state => state.mr.vaccines.vaccinesList);
  const user = useSelector(state => state.user.profile);
  const { vaccineId } = useParams();
  const dispatch = useDispatch();
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const { isAcceleratingVaccines, isLoading } = useAcceleratedData();

  useTrackAction(statsdFrontEndActions.VACCINES_DETAILS);

  useEffect(
    () => {
      if (vaccineId && !isLoading) {
        dispatch(
          getVaccineDetails(vaccineId, vaccines, isAcceleratingVaccines),
        );
      }
    },
    [vaccineId, vaccines, dispatch, isAcceleratingVaccines, isLoading],
  );

  useEffect(
    () => {
      return () => {
        dispatch(clearVaccineDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (record) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(pageTitles.VACCINE_DETAILS_PAGE_TITLE);
      }
    },
    [dispatch, record],
  );

  usePrintTitle(
    pageTitles.VACCINES_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateVaccinePdf = async () => {
    setDownloadStarted(true);
    const title = `${record.name}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = { ...scaffold, details: generateVaccineItem(record) };
    const pdfName = `VA-Vaccines-details-${getNameDateAndTime(user)}`;
    makePdf(
      pdfName,
      pdfData,
      'medicalRecords',
      'Medical Records - Vaccine details - PDF generation error',
      runningUnitTest,
    );
  };

  const generateVaccineTxt = async () => {
    setDownloadStarted(true);
    const content = [
      `${crisisLineHeader}\n\n`,
      `${record.name}\n`,
      `${formatNameFirstLast(user.userFullName)}\n`,
      `Date of birth: ${formatUserDob(user)}\n`,
      `${reportGeneratedBy}\n`,
      `${txtLine}\n\n`,
      `Date received: ${record.date}\n`,
    ];

    // Add conditional fields based on whether accelerating vaccines is enabled
    if (isAcceleratingVaccines) {
      content.push(`Provider: ${record.location || 'None recorded'}\n`);
      content.push(`Type and dosage: ${record.shortDescription}\n`);
      content.push(`Manufacturer: ${record.manufacturer}\n`);
      content.push(`Series status: ${record.doseDisplay}\n`);
      content.push(`Dose number: ${record.doseNumber}\n`);
      content.push(`Dose series: ${record.doseSeries}\n`);
      content.push(`CVX code: ${record.cvxCode}\n`);
      content.push(`Reactions: ${record.reaction}\n`);
      content.push(`Notes: ${record.note}\n`);
    } else {
      content.push(`Location: ${record.location || 'None recorded'}\n`);
    }

    const fileName = `VA-vaccines-details-${getNameDateAndTime(user)}`;

    generateTextFile(content.join(''), fileName);
  };

  const content = () => {
    if (activeAlert && activeAlert.type === ALERT_TYPE_ERROR) {
      return (
        <>
          <h1 className="vads-u-margin-bottom--0p5">Vaccine:</h1>
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.VACCINE}
            className="vads-u-margin-bottom--9"
          />
        </>
      );
    }

    if (record) {
      return (
        <>
          <PrintHeader />

          <HeaderSection
            header={`${record.name}`}
            className="vads-u-margin-bottom--0p5"
            aria-describedby="vaccine-date"
            data-testid="vaccine-name"
            data-dd-privacy="mask"
            data-dd-action-name="[vaccine details - name]"
          >
            <DateSubheading
              date={record.date}
              label="Date received"
              id="vaccine-date"
            />
            {downloadStarted && <DownloadSuccessAlert />}

            <div>
              {isAcceleratingVaccines && (
                <LabelValue
                  label="Type and dosage"
                  value={record.shortDescription}
                  testId="vaccine-description"
                  actionName="[vaccine details - description]"
                />
              )}
              {isAcceleratingVaccines && (
                <LabelValue
                  label="Manufacturer"
                  value={record.manufacturer}
                  testId="vaccine-manufacturer"
                  actionName="[vaccine details - manufacturer]"
                />
              )}
              {isAcceleratingVaccines && (
                <LabelValue
                  label="Series status"
                  value={record.doseDisplay}
                  testId="vaccine-dosage"
                  actionName="[vaccine details - dosage]"
                />
              )}
              <LabelValue
                label={isAcceleratingVaccines ? 'Provider' : 'Location'}
                value={record.location}
                testId={
                  isAcceleratingVaccines
                    ? 'vaccine-provider'
                    : 'vaccine-location'
                }
                actionName={
                  isAcceleratingVaccines
                    ? '[vaccine details - provider]'
                    : '[vaccine details - location]'
                }
              />

              {isAcceleratingVaccines && (
                <LabelValue
                  label="Reactions"
                  value={record.reaction}
                  testId="vaccine-reactions"
                  actionName="[vaccine details - reaction]"
                />
              )}
              {isAcceleratingVaccines && (
                <LabelValue
                  label="Notes"
                  value={record.note}
                  testId="vaccine-notes"
                  actionName="[vaccine details - note]"
                />
              )}
            </div>
            <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
            <DownloadingRecordsInfo description="Vaccines Detail" />
            <PrintDownload
              description="Vaccines Detail"
              downloadPdf={generateVaccinePdf}
              downloadTxt={generateVaccineTxt}
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

export default VaccineDetails;

VaccineDetails.propTypes = {
  runningUnitTest: PropTypes.bool,
};
