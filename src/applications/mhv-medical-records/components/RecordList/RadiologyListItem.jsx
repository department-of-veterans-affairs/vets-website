import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { sendDataDogAction } from '../../util/helpers';

const RadiologyListItem = props => {
  const { record } = props;
  return (
    <va-card
      background
      class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3"
      data-testid="record-list-item"
    >
      <div className="vads-u-font-weight--bold vads-u-margin-bottom--0p5">
        <Link
          to={`/imaging-results/${record.id}`}
          data-dd-privacy="mask"
          data-dd-action-name="Radiology Detail Link"
          onClick={() => {
            sendDataDogAction('Radiology Detail Link');
          }}
        >
          {record.name} <span className="sr-only">{`on ${record.date}`}</span>
        </Link>
      </div>

      <div>
        {/* date */}
        <div
          className="vads-u-margin-bottom--0p5"
          data-dd-privacy="mask"
          data-dd-action-name="[radiology - date - list]"
        >
          {record.date}
        </div>

        {/* ordered by */}
        {record.orderedBy && (
          <div data-dd-privacy="mask" data-dd-action-name>
            {`Ordered by ${record.orderedBy}`}
          </div>
        )}

        {/* image count indicator */}
        {record.imageCount > 0 && (
          <div className="vads-u-margin-top--1 vads-u-color--secondary-dark">
            <va-icon icon="image" size={3} aria-hidden="true" />
            <span className="vads-u-margin-left--0p5">
              {record.imageCount} {record.imageCount === 1 ? 'image' : 'images'}{' '}
              available
            </span>
          </div>
        )}
      </div>
    </va-card>
  );
};
export default RadiologyListItem;

RadiologyListItem.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    orderedBy: PropTypes.string,
    imageCount: PropTypes.number,
    studyId: PropTypes.string,
  }).isRequired,
};
