import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PrintHeader from '../shared/PrintHeader';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import ItemList from '../shared/ItemList';
import ChemHemResults from './ChemHemResults';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import { makePdf, processList } from '../../util/helpers';
import {
  generatePdfScaffold,
  updatePageTitle,
} from '../../../shared/util/helpers';
import { EMPTY_FIELD, pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

const ChemHemDetails = props => {
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
    [record.date, record.name],
  );

  const generateChemHemPdf = async () => {
    const title = `Lab and test results: ${record.name} on ${formatDateLong(
      record.date,
    )}`;
    const subject = 'VA Medical Record';
    const preface =
      'If you have questions about these results, send a secure message to your care team. ';
    const scaffold = generatePdfScaffold(user, title, subject, preface);

    scaffold.details = {
      header: 'Details about this test',
      items: [
        {
          title: 'Type of test',
          value: record.type,
          inline: true,
        },
        {
          title: 'Sample tested',
          value: record.sampleTested,
          inline: true,
        },
        {
          title: 'Ordered by',
          value: record.orderedBy,
          inline: true,
        },
        {
          title: 'Ordering location',
          value: record.orderingLocation,
          inline: true,
        },
        {
          title: 'Collecting location',
          value: record.collectingLocation,
          inline: true,
        },
        {
          title: 'Provider notes',
          value: processList(record.comments),
          inline: !record.comments,
        },
      ],
    };
    scaffold.results = {
      header: 'Results',
      preface:
        "If your results are outside the standard range, this doesn't automatically mean you have a health problem. Your provider will review your results and explain what they mean for your health.",
      sectionSeparators: true,
      items: record.results.map(item => ({
        header: item.name,
        items: [
          {
            title: 'Result',
            value: item.result,
            inline: true,
          },
          {
            title: 'Standard range',
            value: item.standardRange,
            inline: true,
          },
          {
            title: 'Status',
            value: item.status,
            inline: true,
          },
          {
            title: 'Lab location',
            value: item.labLocation,
            inline: true,
          },
          {
            title: 'Interpretation',
            value: item.interpretation,
            inline: true,
          },
        ],
      })),
    };

    makePdf(
      'microbiology_report',
      scaffold,
      'Microbiology details',
      runningUnitTest,
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1 className="vads-u-margin-bottom--1" aria-describedby="chem-hem-date">
        {record.name}
      </h1>
      <DateSubheading date={record.date} id="chem-hem-date" />

      <div className="no-print">
        <PrintDownload
          download={generateChemHemPdf}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      {/*                   TEST DETAILS                          */}
      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Type of test
        </h3>
        <p>{record.category}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Sample tested
        </h3>
        <p>{record.sampleTested}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordered by
        </h3>
        <p>{record.orderedBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordering location
        </h3>
        <p>{record.orderingLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Collecting location
        </h3>
        <p>{record.collectingLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Provider notes
        </h3>
        <ItemList list={record.comments} />
      </div>
      {/*         RESULTS CARDS            */}
      <div className="test-results-container">
        <h2>Results</h2>
        <va-additional-info
          trigger="Need help understanding your results?"
          class="no-print"
        >
          <p className="vads-u-margin-bottom--1">
            If your results are outside the standard range, this doesn’t
            automatically mean you have a health problem. Your provider will
            review your results and explain what they mean for your health.
          </p>
          <p>To ask a question now, send a secure message to your care team.</p>
          <p>
            <a
              href={mhvUrl(
                isAuthenticatedWithSSOe(fullState),
                'secure-messaging',
              )}
              rel="noreferrer" // check dis
            >
              Compose a message.
            </a>
          </p>
        </va-additional-info>
        <div className="print-only">
          <p>
            Your provider will review your results and explain what they mean
            for your health. To ask a question now, send a secure message to
            your care team.
          </p>
          <h4 className="vads-u-margin--0 vads-u-font-size--base vads-u-font-family--sans">
            Standard range
          </h4>
          <p className="vads-u-margin-top--0">
            The standard range is one tool your providers use to understand your
            results. If your results are outside the standard range, this
            doesn’t automatically mean you have a health problem. Your provider
            will explain what your results mean for your health.
          </p>
        </div>
        <ChemHemResults results={record.results} />
      </div>
    </div>
  );
};

export default ChemHemDetails;

ChemHemDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
