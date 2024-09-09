import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  formatName,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import GenerateRadiologyPdf from './GenerateRadiologyPdf';

import { pageTitles } from '../../util/constants';
import { generateTextFile, getNameDateAndTime } from '../../util/helpers';
import DateSubheading from '../shared/DateSubheading';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import { useIsDetails } from '../../hooks/useIsDetails';

const RadiologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const [downloadStarted, setDownloadStarted] = useState(false);

  const dispatch = useDispatch();
  useIsDetails(dispatch);

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(
        `${record.name} - ${pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE}`,
      );
    },
    [record],
  );

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const downloadPdf = () => {
    setDownloadStarted(true);
    GenerateRadiologyPdf(record, user, runningUnitTest);
  };

  const generateRadioloyTxt = async () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
Date entered: ${record.date}\n
${txtLine}\n\n
Reason for test: ${record.reason} \n
Clinical history: ${record.clinicalHistory} \n
Ordered by: ${record.orderedBy} \n
Location: ${record.imagingLocation} \n
Imaging provider: ${record.imagingProvider} \n
${txtLine}\n\n
Results\n
${record.results}`;

    generateTextFile(
      content,
      `VA-labs-and-tests-details-${getNameDateAndTime(user)}`,
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="radiology-date"
        data-testid="radiology-record-name"
      >
        {record.name}
      </h1>
      <DateSubheading
        date={record.date}
        id="radiology-date"
        label="Date and time performed"
        labelClass="vads-font-weight-regular"
      />
      {downloadStarted && <DownloadSuccessAlert />}
      <PrintDownload
        downloadPdf={downloadPdf}
        downloadTxt={generateRadioloyTxt}
        allowTxtDownloads={allowTxtDownloads}
      />
      <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />

      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Reason for test
        </h3>
        <p data-testid="radiology-reason">{record.reason}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Clinical history
        </h3>
        <p data-testid="radiology-clinical-history">{record.clinicalHistory}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordered by
        </h3>
        <p data-testid="radiology-ordered-by">{record.orderedBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Location
        </h3>
        <p data-testid="radiology-imaging-location">{record.imagingLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Imaging provider
        </h3>
        <p data-testid="radiology-imaging-provider">{record.imagingProvider}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans no-print">
          Images
        </h3>
        <p data-testid="radiology-image" className="no-print">
          Images are not yet available in this new medical records tool. To get
          images, you’ll need to request them in the previous version of medical
          records on the My HealtheVet website.
        </p>
        <va-link
          href={mhvUrl(
            isAuthenticatedWithSSOe(fullState),
            'va-medical-images-and-reports',
          )}
          text="Request images on the My HealtheVet website"
          data-testid="radiology-images-link"
        />
      </div>

      <div className="test-results-container">
        <h2>Results</h2>
        <InfoAlert fullState={fullState} />
        <p data-testid="radiology-record-results" className="monospace">
          {record.results}
        </p>
      </div>
    </div>
  );
};

export default RadiologyDetails;

RadiologyDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
