import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import ItemList from '../shared/ItemList';

const VaccinesListItem = props => {
  const { record } = props;

  return (
    <va-card
      background
      class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3"
      data-testid="record-list-item"
    >
      {/* web view header */}
      <Link
        to={`/vaccines/${record.id}`}
        data-dd-privacy="mask"
        className="vads-u-font-weight--bold vads-u-margin-y--1 vads-u-line-height--4 no-print"
      >
        {record.name} <span className="sr-only">on {record.date}</span>
      </Link>

      {/* print view header */}
      <h2 className="print-only" aria-hidden="true" data-dd-privacy="mask">
        {record.name}
      </h2>

      {/* fields */}
      <div>
        <span className="vads-u-display--inline vads-u-font-weight--bold">
          Date received:
        </span>{' '}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.date}
        </span>
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline vads-u-font-weight--bold">
          Location:
        </span>{' '}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.location}
        </span>
      </div>
    </va-card>
  );
};

export default VaccinesListItem;

VaccinesListItem.propTypes = {
  record: PropTypes.object,
};
