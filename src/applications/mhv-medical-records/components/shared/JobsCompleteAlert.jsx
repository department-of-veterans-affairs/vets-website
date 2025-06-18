import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDateAndTime, sendDataDogAction } from '../../util/helpers';

export default function JobsCompleteAlert({ records, studyJobs }) {
  const endDate = formatDateAndTime(
    new Date(studyJobs[0].endDate + 3 * 24 * 60 * 60 * 1000), // Add 3 days
  );

  const imageCount = records.reduce((totalImages, record) => {
    return totalImages + record.imageCount;
  }, 0);

  if (records.length === 1) {
    return (
      <>
        <p>
          You have until {endDate.date} at {endDate.time} {endDate.timeZone} to
          view and download your images. After that, you’ll need to request them
          again.
        </p>
        <p>
          <Link
            to={`/labs-and-tests/${records[0].id}/images`}
            className="vads-c-action-link--blue"
            data-testid="radiology-view-all-images"
            onClick={() => {
              sendDataDogAction('View all images');
            }}
          >
            View all {imageCount} images
          </Link>
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        View or download your images now. They'll be available here for 3 days.
      </p>
      <ul
        style={{ listStyle: 'none' }}
        className="vads-u-padding-x--0 vads-u-margin-bottom--0"
      >
        {records.map(record => {
          const studyJob =
            studyJobs?.find(img => img.studyIdUrn === record.studyId) || null;
          return (
            <li key={record.id}>
              <Link
                to={`/labs-and-tests/${record.id}/images`}
                data-testid="radiology-view-all-images"
                onClick={() => {
                  sendDataDogAction('View all images');
                }}
              >
                {record.name} ({studyJob.imageCount} images)
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

JobsCompleteAlert.propTypes = {
  records: PropTypes.array,
  studyJobs: PropTypes.array,
};
