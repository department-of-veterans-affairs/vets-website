import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ConditionListItem = props => {
  const { record } = props;

  return (
    <va-card
      background
      class="record-list-item vads-u-padding--3 vads-u-margin-y--2p5"
      data-testid="record-list-item"
    >
      <Link
        to={`/conditions/${record.id}`}
        className="vads-u-margin--0"
        data-dd-privacy="mask"
      >
        <span className="vads-u-font-weight--bold vads-u-margin-y--1 vads-u-line-height--4 no-print">
          {record.name} <span className="sr-only">on {record.date}</span>
        </span>
      </Link>
      <span
        className="vads-u-font-size--h4 vads-u-line-height--4 print-only"
        aria-hidden="true"
        data-dd-privacy="mask"
      >
        {record.name}
      </span>

      <p className="vads-u-margin--0">Date entered: {record?.date}</p>
    </va-card>
  );
};

export default ConditionListItem;

ConditionListItem.propTypes = {
  record: PropTypes.object,
};
