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
      <h5 className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin-y--1">
        <Link to={`/labs-and-tests/${record.id}`} data-dd-privacy="mask">
          {record.name} <span className="sr-only">on {record.date}</span>
        </Link>
      </h5>
      <div>
        {/* date */}
        <div>{record.date}</div>

        {/* ordered by */}
        {(record.type === labTypes.CHEM_HEM ||
          record.type === labTypes.MICROBIOLOGY ||
          record.type === labTypes.RADIOLOGY ||
          record.type === labTypes.PATHOLOGY) && (
          <div>{`Ordered by ${record.orderedBy}`}</div>
        )}
        {record.type === labTypes.EKG && (
          <div>{`Signed by ${record.signedBy}`}</div>
        )}
      </div>
    </va-card>
  );
};

export default LabsAndTestsListItem;

LabsAndTestsListItem.propTypes = {
  record: PropTypes.object,
};
