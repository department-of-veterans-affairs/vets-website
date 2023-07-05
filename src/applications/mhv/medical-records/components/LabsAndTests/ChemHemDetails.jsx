import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { downloadFile } from '../../util/helpers';
import PrintHeader from '../shared/PrintHeader';
import { getVaccinePdf } from '../../api/MrApi';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import ItemList from '../shared/ItemList';
import ChemHemResults from './ChemHemResults';
import PrintDownload from '../shared/PrintDownload';

const ChemHemDetails = props => {
  const { record, fullState } = props;

  const formattedDate = formatDateLong(record?.date);

  const download = () => {
    getVaccinePdf(1).then(res =>
      downloadFile('chemistry-hematology.pdf', res.pdf),
    );
  };

  const content = () => {
    if (record) {
      return (
        <>
          <PrintHeader />
          <h1 className="vads-u-margin-bottom--1">{record.name}</h1>
          <div className="time-header">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Date:{' '}
            </h2>
            <p>{formattedDate}</p>
          </div>

          <div className="no-print">
            <PrintDownload list download={download} />
            <va-additional-info trigger="What to know about downloading records">
              <ul>
                <li>
                  <strong>If you’re on a public or shared computer,</strong>{' '}
                  print your records instead of downloading. Downloading will
                  save a copy of your records to the public computer.
                </li>
                <li>
                  <strong>If you use assistive technology,</strong> a Text file
                  (.txt) may work better for technology such as screen reader,
                  screen enlargers, or Braille displays.
                </li>
              </ul>
            </va-additional-info>
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
            <ItemList
              list={record.comments}
              emptyMessage="No notes reported at this time"
            />
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
              <p>
                To ask a question now, send a secure message to your care team.
              </p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'secure-messaging',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Compose a message.
                </a>
              </p>
            </va-additional-info>
            <div className="print-only">
              <p>
                Your provider will review your results and explain what they
                mean for your health. To ask a question now, send a secure
                message to your care team.
              </p>
              <h4 className="vads-u-margin--0 vads-u-font-size--base vads-u-font-family--sans">
                Standard range
              </h4>
              <p className="vads-u-margin-top--0">
                The standard range is one tool your providers use to understand
                your results. If your results are outside the standard range,
                this doesn’t automatically mean you have a health problem. Your
                provider will explain what your results mean for your health.
              </p>
            </div>
            <ChemHemResults results={record.results} />
            <va-back-to-top class="no-print" />
          </div>
        </>
      );
    }
    return <></>;
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {content()}
    </div>
  );
};

export default ChemHemDetails;

ChemHemDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
};
