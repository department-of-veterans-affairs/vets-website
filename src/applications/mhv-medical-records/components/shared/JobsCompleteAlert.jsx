import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  formatDateAndTimeWithGenericZone,
  sendDataDogAction,
} from '../../util/helpers';

export default function JobsCompleteAlert({ records, studyJobs }) {
  const endDate = formatDateAndTimeWithGenericZone(
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
        <p className="vads-u-margin-bottom--0">
          <Link
            to={`/labs-and-tests/${records[0].id}/images`}
            data-testid="radiology-view-all-images"
            onClick={() => {
              sendDataDogAction('View all images');
            }}
          >
            <strong>View all {imageCount} images</strong>
          </Link>
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        Images are available here for 3 days. After that, you'll need to request
        them again.
      </p>
      <ul
        style={{ listStyle: 'none' }}
        className="vads-u-padding-x--0 vads-u-margin-bottom--0"
      >
        {records.map((record, index) => {
          const isLast = index === records.length - 1;
          const liClass = isLast ? '' : 'vads-u-margin-bottom--2';

          return (
            <li key={record.id} className={liClass}>
              <Link
                to={`/labs-and-tests/${record.id}/images`}
                data-testid="radiology-view-all-images"
                onClick={() => {
                  sendDataDogAction('View all images');
                }}
              >
                {record.name} ({record.imageCount}{' '}
                {record.imageCount > 1 ? 'images' : 'image'})
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
