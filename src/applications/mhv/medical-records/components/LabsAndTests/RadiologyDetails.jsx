import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PrintHeader from '../shared/PrintHeader';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import PrintDownload from '../shared/PrintDownload';
import GenerateRadiologyPdf from './GenerateRadiologyPdf';
import { updatePageTitle } from '../../../shared/util/helpers';
import { pageTitles } from '../../util/constants';

const RadiologyDetails = props => {
  const { record, fullState } = props;
  const formattedDate = formatDateLong(record?.date);

  useEffect(() => {
    focusElement(document.querySelector('h1'));
    const titleDate = formattedDate ? `${formattedDate} - ` : '';
    updatePageTitle(
      `${titleDate}${record.name} - ${
        pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE
      }`,
    );
  }, []);

  const download = () => {
    GenerateRadiologyPdf(record);
  };

  const content = () => {
    if (record) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0"
            aria-describedby="radiology-date"
          >
            {record.name}
          </h1>
          <section className="set-width-486">
            <div className="time-header">
              <h2
                className="vads-u-font-size--base vads-u-font-family--sans"
                id="radiology-date"
              >
                Date:{' '}
                <span className="vads-u-font-weight--normal">
                  {formattedDate}
                </span>
              </h2>
            </div>
            <div className="no-print">
              <PrintDownload download={download} />
              <va-additional-info trigger="What to know about downloading records">
                <ul>
                  <li>
                    <strong>If you’re on a public or shared computer,</strong>{' '}
                    print your records instead of downloading. Downloading will
                    save a copy of your records to the public computer.
                  </li>
                  <li>
                    <strong>If you use assistive technology,</strong> a Text
                    file (.txt) may work better for technology such as screen
                    reader, screen enlargers, or Braille displays.
                  </li>
                </ul>
              </va-additional-info>
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

              <va-alert-expandable
                status="info"
                trigger="Need help understanding your results?"
                class="no-print"
              >
                <p>
                  Your provider will review your results. If you need to do
                  anything, your provider will contact you.
                </p>
                <p>
                  If you have questions, send a message to the care team that
                  ordered this test.
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
                    Compose a new message
                  </a>
                </p>
                <p>
                  <strong>Note: </strong>
                  If you have questions about more than 1 test ordered by the
                  same care team, send 1 message with all of your questions.
                </p>
              </va-alert-expandable>
              <p className="monospace">{record.results}</p>
            </div>
          </section>
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

export default RadiologyDetails;

RadiologyDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
};
