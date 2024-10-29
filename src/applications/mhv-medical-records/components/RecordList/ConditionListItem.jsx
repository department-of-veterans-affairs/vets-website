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
        className="vads-u-margin-x--0 vads-u-margin-y--1 vads-u-line-height--4 vads-u-font-weight--bold no-print"
        data-dd-privacy="mask"
      >
        {record.name} <span className="sr-only">on {record.date}</span>
      </Link>
      <h2 className="print-only" aria-hidden="true" data-dd-privacy="mask">
        {record.name}
      </h2>

      <p className="vads-u-margin--0">
        Date entered: <span data-dd-privacy="mask">{record?.date}</span>
      </p>
    </va-card>
  );
};

export default ConditionListItem;

ConditionListItem.propTypes = {
  record: PropTypes.object,
};
