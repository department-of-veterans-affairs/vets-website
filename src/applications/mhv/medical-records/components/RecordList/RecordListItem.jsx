import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat, typeAndDose } from '../../util/helpers';
import ItemList from '../shared/ItemList';

const RecordListItem = props => {
  const { record } = props;
  const formattedDate = dateFormat(record.date, 'MMMM D, YYYY');

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h4>{record.name}</h4>
      <div className="fields">
        <div>
          <span className="field-label">Date received:</span> {formattedDate}
        </div>
        <div className="print-only">
          <span className="field-label">Type and dosage:</span> {typeAndDose()}
        </div>
        <div className="print-only">
          <span className="field-label">Series:</span>{' '}
          {record.series || 'There is no series reported at this time'}
        </div>
        <div className="location-collapsed vads-u-line-height--3">
          <span className="field-label">Location:</span> {record.facility}
        </div>
        <div className="print-only">
          <span className="field-label">Reactions recorded by provider:</span>{' '}
          <ItemList list={record.reactions} emptyMessage="None reported" />
        </div>
        <div className="print-only">
          <span className="field-label">Provider comments:</span>{' '}
          <ItemList
            list={record.comments}
            emptyMessage="No comments at this time"
          />
        </div>
      </div>
      <Link
        to={`/vaccine-details/${record.id}`}
        className="vads-u-margin-y--0p5 no-print"
      >
        Details
        <i
          className="fas fa-angle-right details-link-icon"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
};

export default RecordListItem;

RecordListItem.propTypes = {
  record: PropTypes.object,
};
