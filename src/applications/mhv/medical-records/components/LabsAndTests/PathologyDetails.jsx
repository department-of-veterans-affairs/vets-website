import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PrintHeader from '../shared/PrintHeader';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import {
  makePdf,
  getNameDateAndTime,
  generateTextFile,
} from '../../util/helpers';
import {
  updatePageTitle,
  generatePdfScaffold,
} from '../../../shared/util/helpers';
import { EMPTY_FIELD, pageTitles } from '../../util/constants';

const PathologyDetails = props => {
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
      const titleDate = record.date !== EMPTY_FIELD ? `${record.date} - ` : '';
      updatePageTitle(
        `${titleDate}${record.name} - ${
          pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE
        }`,
      );
    },
    [record],
  );

  const generatePathologyPdf = async () => {
    const title = `Pathology: ${record.name} on ${record.date}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      header: 'Details about this test',
      items: [
        {
          title: 'Sample tested',
          value: record.sampleTested,
          inline: true,
        },
        {
          title: 'Lab location',
          value: record.labLocation,
          inline: true,
        },
        { title: 'Date completed', value: record.date, inline: true },
      ],
    };
    scaffold.results = {
      header: 'Results',
      items: [{ items: [{ title: '', value: record.results, inline: true }] }],
    };

    const pdfName = `VA-Pathology-details-${getNameDateAndTime(user)}`;

    makePdf(pdfName, scaffold, 'Pathology details', runningUnitTest);
  };

  const generatePathologyTxt = async () => {
    const content = `
${record.name} \n
Details about this test: \n
_____________________________________________________ \n
Sample tested: ${record.sampleTested} \n
Lab location: ${record.labLocation} \n
Date completed: ${record.date} \n
Results: \n
${record.results} \n`;

    const fileName = `VA-Pathology-details-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1 className="vads-u-margin-bottom--0" aria-describedby="pathology-date">
        {record.name}
      </h1>
      <div className="time-header">
        <h2
          className="vads-u-font-size--base vads-u-font-family--sans"
          id="pathology-date"
        >
          Date:{' '}
          <span className="vads-u-font-weight--normal">{record.date}</span>
        </h2>
      </div>
      <div className="no-print">
        <PrintDownload
          download={generatePathologyPdf}
          allowTxtDownloads={allowTxtDownloads}
          downloadTxt={generatePathologyTxt}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      <div className="test-details-container max-80">
        <h4>Details about this test</h4>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Sample tested
        </h3>
        <p>{record.sampleTested}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Lab location
        </h3>
        <p>{record.labLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Date completed
        </h3>
        <p>{record.date}</p>
      </div>
      <div className="test-results-container">
        <h4>Results</h4>
        <va-additional-info
          trigger="Need help understanding your results?"
          class="no-print"
        >
          <p>
            Your provider will review your results and explain what they mean
            for your health. To ask a question now, send a secure message to
            your care team.
          </p>
          <p>
            <a
              href={mhvUrl(
                isAuthenticatedWithSSOe(fullState),
                'secure-messaging',
              )}
            >
              Start a new message
            </a>
          </p>
        </va-additional-info>
        <p>{record.results}</p>
      </div>
    </div>
  );
};

export default PathologyDetails;

PathologyDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
