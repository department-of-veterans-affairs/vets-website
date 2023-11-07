import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PrintHeader from '../shared/PrintHeader';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import GenerateRadiologyPdf from './GenerateRadiologyPdf';
import { updatePageTitle } from '../../../shared/util/helpers';
import { EMPTY_FIELD, pageTitles } from '../../util/constants';

const RadiologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      const titleDate = record.date !== EMPTY_FIELD ? `${record.date} - ` : '';
      updatePageTitle(
        `${titleDate}${record.name} - ${
          pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE
        }`,
      );
    },
    [record],
  );

  const download = () => {
    GenerateRadiologyPdf(record, runningUnitTest);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1 className="vads-u-margin-bottom--0" aria-describedby="radiology-date">
        {record.name}
      </h1>
      <div className="time-header">
        <h2
          className="vads-u-font-size--base vads-u-font-family--sans"
          id="radiology-date"
        >
          Date:{' '}
          <span
            className="vads-u-font-weight--normal"
            data-testid="header-time"
          >
            {record.date}
          </span>
        </h2>
      </div>
      <div className="no-print">
        <PrintDownload
          download={download}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans no-print">
          Images
        </h3>
        <p className="no-print">
          <va-link
            active
            href={`/my-health/medical-records/labs-and-tests/${
              record.id
            }/images`}
            text={`See all ${record.images.length} images`}
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
          Ordering location
        </h3>
        <p>{record.orderingLocation}</p>
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
        <InfoAlert
          messagingURL={mhvUrl(
            isAuthenticatedWithSSOe(fullState),
            'compose-message',
          )}
        />
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
