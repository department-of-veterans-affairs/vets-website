import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import { sendErrorToSentry } from '../../util/helpers';
import { generatePdfScaffold } from '../../../shared/util/helpers';

const ProgressNoteDetails = props => {
  const { record } = props;
  const user = useSelector(state => state.user.profile);

  const generateCareNotesPDF = async () => {
    const title = `Care summaries and notes on ${formatDateLong(record.date)}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      header: 'Details',
      items: [
        {
          title: 'Location',
          value: record.location,
          inline: true,
        },
        {
          title: 'Signed by',
          value: record.physician,
          inline: true,
        },
        {
          title: 'Last updated',
          value: record.dateUpdated,
          inline: true,
        },
        {
          title: 'Date signed',
          value: record.dateSigned,
          inline: true,
        },
      ],
    };
    scaffold.results = {
      header: 'Notes',
      items: [
        {
          items: [
            {
              title: '',
              value: record.summary,
              inline: false,
            },
          ],
        },
      ],
    };

    try {
      await generatePdf('medicalRecords', 'care_notes_report', scaffold);
    } catch (error) {
      sendErrorToSentry(error, 'Care Note details');
    }
  };

  const download = () => {
    generateCareNotesPDF();
  };

  const content = () => {
    if (record) {
      return (
        <>
          <PrintHeader />
          <h1 className="vads-u-margin-bottom--0">{record.name}</h1>
          <section className="set-width-486">
            <div className="time-header">
              <h2 className="vads-u-font-size--base vads-u-font-family--sans">
                Date:{' '}
                <span className="vads-u-font-weight--normal">
                  {record.dateSigned}
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
              <h2>Details</h2>
              <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                Location
              </h3>
              <p>{record.location}</p>
              <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                Signed by
              </h3>
              <p>{record.physician}</p>
              <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                Last updated
              </h3>
              <p>{record.dateUpdated}</p>
              <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                Date signed
              </h3>
              <p>{record.dateSigned}</p>
            </div>

            <div className="test-results-container">
              <h2>Note</h2>
              <p>{record.summary}</p>
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

export default ProgressNoteDetails;

ProgressNoteDetails.propTypes = {
  record: PropTypes.object,
};
