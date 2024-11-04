import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { labTypes } from '../../util/constants';

const LabsAndTestsListItem = props => {
  const { record } = props;

  return (
    <va-card
      background
      class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3"
      data-testid="record-list-item"
    >
      <Link to={`/labs-and-tests/${record.id}`} data-dd-privacy="mask">
        <div className="vads-u-font-weight--bold vads-u-margin-bottom--0p5">
          {record.name} <span className="sr-only">on {record.date}</span>
        </div>
      </Link>

      <div>
        {/* date */}
        <div data-dd-privacy="mask">{record.date}</div>

        {/* ordered by */}
        {(record.type === labTypes.CHEM_HEM ||
          record.type === labTypes.MICROBIOLOGY ||
          record.type === labTypes.RADIOLOGY ||
          record.type === labTypes.PATHOLOGY) && (
          <div data-dd-privacy="mask">{`Ordered by ${record.orderedBy}`}</div>
        )}
        {record.type === labTypes.EKG && (
          <div data-dd-privacy="mask">{`Signed by ${record.signedBy}`}</div>
        )}
      </div>
    </va-card>
  );
};

export default LabsAndTestsListItem;

LabsAndTestsListItem.propTypes = {
  record: PropTypes.object,
};
