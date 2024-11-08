import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const VaccinesListItem = props => {
  const { record } = props;

  return (
    <va-card
      background
      class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3 left-align-print margin-zero-print"
      data-testid="record-list-item"
    >
      {/* web view header */}
      <Link
        to={`/vaccines/${record.id}`}
        data-dd-privacy="mask"
        className="no-print"
      >
        <div className="vads-u-font-weight--bold vads-u-margin-bottom--0p5">
          {record.name} <span className="sr-only">on {record.date}</span>
        </div>
      </Link>

      {/* print view header */}
      <h2
        className="print-only vads-u-margin-bottom--1 vads-u-margin-top--0"
        aria-hidden="true"
        data-dd-privacy="mask"
      >
        {record.name}
      </h2>

      {/* fields */}
      <div className="print-indent">
        <span className="vads-u-display--inline print-bold">
          Date received:
        </span>{' '}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.date}
        </span>
      </div>
      <div className="print-only print-indent">
        <span className="vads-u-display--inline print-bold">Location:</span>{' '}
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
