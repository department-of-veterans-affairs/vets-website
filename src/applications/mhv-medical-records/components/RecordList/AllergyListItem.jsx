import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ItemList from '../shared/ItemList';

const AllergyListItem = props => {
  const { record } = props;
  return (
    <va-card
      background
      class="record-list-item vads-u-margin-y--2p5 vad-u-padding-y--2p5 vads-u-padding-x--3"
      data-testid="record-list-item"
    >
      {/* web view header */}
      <Link
        to={`/allergies/${record.id}`}
        data-dd-privacy="mask"
        data-testid={`allergy-link-${record.id}`}
      >
        <span className="vads-u-font-weight--bold vads-u-margin-y--1 vads-u-line-height--4 no-print">
          {record.name} <span className="sr-only">on {record.date}</span>
        </span>
      </Link>

      {/* print view header */}
      <span
        className="vads-u-font-size--h4 vads-u-line-height--4 print-only"
        aria-hidden="true"
        data-dd-privacy="mask"
      >
        {record.name}
      </span>

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
      {!record.isOracleHealthData && (
        <div className="print-only">
          <span className="vads-u-display--inline-block vads-u-font-weight--bold">
            Location:
          </span>{' '}
          <span className="vads-u-display--inline-block" data-dd-privacy="mask">
            {record.location}
          </span>
        </div>
      )}
      {!record.isOracleHealthData && (
        <div className="print-only">
          <span className="vads-u-display--inline-block vads-u-font-weight--bold">
            Observed or historical:
          </span>{' '}
          <span className="vads-u-display--inline-block" data-dd-privacy="mask">
            {record.observedOrReported}
          </span>
        </div>
      )}
      {record.isOracleHealthData && (
        <div className="print-only">
          <span className="vads-u-display--inline-block vads-u-font-weight--bold">
            Recorded by:
          </span>{' '}
          <span className="vads-u-display--inline-block" data-dd-privacy="mask">
            {record.notes}
          </span>
        </div>
      )}
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
