import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ItemList from '../shared/ItemList';
import { EMPTY_FIELD } from '../../util/constants';

const VaccinesListItem = props => {
  const { record } = props;

  return (
    <div
      className="record-list-item vads-u-padding-x--3 vads-u-padding-y--2p5 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      {/* web view header */}
      <h3 className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin-bottom--0p5 no-print">
        <Link
          to={`/vaccines/${record.id}`}
          data-dd-privacy="mask"
          aria-label={`${record.name} on ${record.date}`}
        >
          {record.name}
        </Link>
      </h3>

      {/* print view header */}
      <h3
        className="vads-u-font-size--h4 vads-u-line-height--4 print-only"
        data-dd-privacy="mask"
        aria-label={`${record.name} ${record.date}`}
      >
        {record.name}
      </h3>

      {/* web view fields */}
      <div className="no-print">
        {record.date === EMPTY_FIELD && (
          <span className="vads-u-display--inline">Date entered: </span>
        )}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.date}
        </span>
      </div>
      <div className="no-print">
        {record.location === EMPTY_FIELD && (
          <span className="vads-u-display--inline">Location: </span>
        )}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.location}
        </span>
      </div>

      {/* print view fields */}
      <div className="print-only">
        <span className="vads-u-display--inline vads-u-font-weight--bold">
          Date entered:
        </span>{' '}
        <ItemList list={record.date} />
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline vads-u-font-weight--bold">
          Location:
        </span>{' '}
        <ItemList list={record.location} />
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline vads-u-font-weight--bold">
          Reaction:
        </span>{' '}
        <ItemList list={record.reactions} />
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline vads-u-font-weight--bold">
          Provider notes:
        </span>{' '}
        <ItemList list={record.notes} />
      </div>
    </div>
  );
};

export default VaccinesListItem;

VaccinesListItem.propTypes = {
  record: PropTypes.object,
};
