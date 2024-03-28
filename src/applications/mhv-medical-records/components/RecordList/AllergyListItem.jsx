import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ItemList from '../shared/ItemList';

const AllergyListItem = props => {
  const { record } = props;

  return (
    <va-card
      background
      class="record-list-item vads-u-margin-y--2p5"
      data-testid="record-list-item"
    >
      {/* web view header */}
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0p5 vads-u-line-height--4 no-print">
        <Link
          to={`/allergies/${record.id}`}
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
      >
        {record.name}
      </h3>

      {/* web view fields */}
      <div className="no-print">
        <span className="vads-u-display--inline-block">Date entered:</span>{' '}
        <span className="vads-u-display--inline-block" data-dd-privacy="mask">
          {record.date}
        </span>
      </div>

      {/* print view fields */}
      <div className="print-only">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Date entered:
        </span>{' '}
        <span className="vads-u-display--inline-block" data-dd-privacy="mask">
          {record.date}
        </span>
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Signs and symptoms:
        </span>{' '}
        <ItemList list={record.reaction} />
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Type of allergy:
        </span>{' '}
        <span className="vads-u-display--inline-block" data-dd-privacy="mask">
          {record.type}
        </span>
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Location:
        </span>{' '}
        <span className="vads-u-display--inline-block" data-dd-privacy="mask">
          {record.location}
        </span>
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Observed or historical:
        </span>{' '}
        <span className="vads-u-display--inline-block" data-dd-privacy="mask">
          {record.observedOrReported}
        </span>
      </div>
      <div className="print-only">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Provider notes:
        </span>{' '}
        <span className="vads-u-display--inline-block" data-dd-privacy="mask">
          {record.notes}
        </span>
      </div>
    </va-card>
  );
};

export default AllergyListItem;

AllergyListItem.propTypes = {
  record: PropTypes.object,
};
