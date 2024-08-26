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
      <h5 className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin-y--1 no-print">
        <Link to={`/vaccines/${record.id}`} data-dd-privacy="mask">
          <span>
            {record.name} <span className="sr-only">on {record.date}</span>
          </span>
        </Link>
      </h5>

      {/* print view header */}
      <h3
        className="vads-u-font-size--h4 vads-u-line-height--4 print-only"
        data-dd-privacy="mask"
      >
        {record.name}
      </h3>

      {/* fields */}
      <div>
        <span className="vads-u-display--inline">Date received:</span>{' '}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.date}
        </span>
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline">Location:</span>{' '}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.location}
        </span>
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline">Provider notes:</span>{' '}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.notes}
        </span>
      </div>
    </va-card>
  );
};

export default VaccinesListItem;

VaccinesListItem.propTypes = {
  record: PropTypes.object,
};
