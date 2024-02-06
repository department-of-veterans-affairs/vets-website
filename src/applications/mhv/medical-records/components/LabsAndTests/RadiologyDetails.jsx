import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import GenerateRadiologyPdf from './GenerateRadiologyPdf';
import { formatName, updatePageTitle } from '../../../shared/util/helpers';
import { pageTitles } from '../../util/constants';
import { generateTextFile, getNameDateAndTime } from '../../util/helpers';
import DateSubheading from '../shared/DateSubheading';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import {
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '../../../shared/util/constants';

const RadiologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(
        `${record.name} - ${pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE}`,
      );
    },
    [record],
  );

  const download = () => {
    GenerateRadiologyPdf(record, user, runningUnitTest);
  };

  const generateRadioloyTxt = async () => {
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
Imaging location: ${record.imagingLocation} \n
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
      <h1 className="vads-u-margin-bottom--0" aria-describedby="radiology-date">
        {record.name}
      </h1>
      <DateSubheading date={record.date} id="radiology-date" />

      <div className="no-print">
        <PrintDownload
          download={download}
          downloadTxt={generateRadioloyTxt}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans no-print">
          Images
        </h3>
        <p data-testid="radiology-image" className="no-print">
          <va-link
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'va-medical-images-and-reports',
            )}
            text="Request images on the My HealtheVet website"
          />
        </p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Reason for test
        </h3>
        <p>{record.reason}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Clinical history
        </h3>
        <p>{record.clinicalHistory}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordered by
        </h3>
        <p>{record.orderedBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Imaging location
        </h3>
        <p>{record.imagingLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Imaging provider
        </h3>
        <p>{record.imagingProvider}</p>
      </div>

      <div className="test-results-container">
        <h2>Results</h2>
        <InfoAlert fullState={fullState} />
        <p className="monospace">{record.results}</p>
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
