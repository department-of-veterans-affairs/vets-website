import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Link } from 'react-router-dom';
import ItemList from '../shared/ItemList';

const VaccinesListItem = props => {
  const { record } = props;
  const formattedDate = formatDateLong(record.date);

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h3
        className="vads-u-font-size--h4 vads-u-margin--0 vads-u-line-height--4"
        aria-label={`${record.name} ${formattedDate}`}
        data-dd-privacy="mask"
      >
        {record.name}
      </h3>

      <div className="fields">
        <div>
          <span className="field-label">Date received:</span>{' '}
          <span data-dd-privacy="mask">{formattedDate}</span>
        </div>
        <div className="print-only">
          <span className="field-label">Manufacturer</span>{' '}
          <span data-dd-privacy="mask">{record.manufacturer}</span>
        </div>
        <div className="location-collapsed vads-u-line-height--3">
          <span className="field-label">Location:</span>{' '}
          <span data-dd-privacy="mask">{record.location}</span>
        </div>
        <div className="print-only">
          <span className="field-label">Reaction:</span>{' '}
          <ItemList list={record.reactions} />
        </div>
        <div className="print-only">
          <span className="field-label">Provider notes:</span>{' '}
          <ItemList list={record.notes} />
        </div>
      </div>
      <Link
        to={`/vaccines/${record.id}`}
        className="vads-u-margin-y--0p5 no-print"
        aria-describedby={`details-button-description-${record.id}`}
      >
        <strong>Details</strong>
        <i
          className="fas fa-angle-right details-link-icon"
          aria-hidden="true"
        />
        <span
          id={`details-button-description-${record.id}`}
          className="sr-only"
        >
          {record.name} {formattedDate}
        </span>
      </Link>
    </div>
  );
};

export default VaccinesListItem;

VaccinesListItem.propTypes = {
  record: PropTypes.object,
};
