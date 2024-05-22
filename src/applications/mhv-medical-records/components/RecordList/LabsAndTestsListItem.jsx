import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { labTypes } from '../../util/constants';

const LabsAndTestsListItem = props => {
  const { record } = props;

  return (
    <va-card
      background
      class="record-list-item vads-u-padding--3 vads-u-margin-y--2p5"
      data-testid="record-list-item"
    >
      <Link
        to={`/labs-and-tests/${record.id}`}
        data-dd-privacy="mask"
        className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin-bottom--0p5"
      >
        <span>
          {record.name} <span className="sr-only">on {record.date}</span>
        </span>
      </Link>

      <div>
        <div>
          {`${
            record.type === labTypes.CHEM_HEM ? 'Date and time collected: ' : ''
          }${record.date}`}
        </div>
        {record.type === labTypes.RADIOLOGY && (
          <div>Type of test: X-rays and imaging tests (Radiology)</div>
        )}
        <div>Ordered by {record.orderedBy}</div>
      </div>
    </va-card>
  );
};

export default LabsAndTestsListItem;

LabsAndTestsListItem.propTypes = {
  record: PropTypes.object,
};
