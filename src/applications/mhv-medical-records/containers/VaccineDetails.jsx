import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  updatePageTitle,
  generatePdfScaffold,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  formatNameFirstLast,
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  formatUserDob,
} from '../util/helpers';
import { clearVaccineDetails, getVaccineDetails } from '../actions/vaccines';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import DateSubheading from '../components/shared/DateSubheading';
import { generateVaccineItem } from '../util/pdfHelpers/vaccines';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import HeaderSection from '../components/shared/HeaderSection';
import LabelValue from '../components/shared/LabelValue';

const VaccineDetails = props => {
  const { runningUnitTest } = props;
  const record = useSelector(state => state.mr.vaccines.vaccineDetails);
  const vaccines = useSelector(state => state.mr.vaccines.vaccinesList);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { vaccineId } = useParams();
  const dispatch = useDispatch();
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (vaccineId) {
      dispatch(getVaccineDetails(vaccineId, vaccines));
    }
  }, [vaccineId, vaccines, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearVaccineDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (record) {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.VACCINE_DETAILS_PAGE_TITLE);
    }
  }, [dispatch, record]);

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
    makePdf(pdfName, pdfData, 'Vaccine details', runningUnitTest);
  };

  const generateVaccineTxt = async () => {
    setDownloadStarted(true);
    const content = `
${crisisLineHeader}\n\n
${record.name}\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
${txtLine}\n\n
Date received: ${record.date}\n
Location: ${record.location}\n`;

    const fileName = `VA-vaccines-details-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
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
            <PrintDownload
              description="Vaccines Detail"
              downloadPdf={generateVaccinePdf}
              allowTxtDownloads={allowTxtDownloads}
              downloadTxt={generateVaccineTxt}
            />
            <DownloadingRecordsInfo
              allowTxtDownloads={allowTxtDownloads}
              description="Vaccines Detail"
            />
            <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
            <div>
              <LabelValue
                label="Location"
                value={record.location}
                testId="vaccine-location"
                actionName="[vaccine details - location]"
              />
              {/* <LabelValue
                label="Reactions recorded by provider"
                value={record.reactions}
              /> */}
            </div>
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
