import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ItemList from '../shared/ItemList';

const AllergyListItem = props => {
  const { record } = props;

  const content = () => {
    if (record) {
      return (
        <div
          className="record-list-item vads-u-padding--3 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
          data-testid="record-list-item"
        >
          <h4>{record.name}</h4>

          <div className="fields">
            <div>
              <span className="field-label">Date entered:</span> {record.date}
            </div>
            <div className="print-only">
              <span className="field-label">Reaction:</span>{' '}
              <ItemList list={record.reactions} />
            </div>
            <div className="print-only">
              <span className="field-label">Type of allergy:</span>{' '}
              {record.type || 'None noted'}
            </div>
            <div className="print-only">
              <span className="field-label">VA drug class:</span>{' '}
              {record.drugClass || 'None noted'}
            </div>
            <div className="print-only">
              <span className="field-label">Location:</span>{' '}
              {record.location || 'None noted'}
            </div>
            <div className="print-only">
              <span className="field-label">Observed or reported:</span>{' '}
              {record.observed
                ? 'Observed (your provider observed the reaction in person)'
                : 'Reported (you told your provider about the reaction)'}
            </div>
            <div className="print-only">
              <span className="field-label">Provider notes:</span>{' '}
              <ItemList list={record.notes} />
            </div>
          </div>

          <Link
            to={`/health-history/allergies/${record.id}`}
            className="vads-u-margin--0 no-print"
          >
            <strong>Details</strong>
            <i
              className="fas fa-angle-right details-link-icon"
              aria-hidden="true"
            />
          </Link>
        </div>
      );
    }
    return <></>;
  };

  return content();
};

export default AllergyListItem;

AllergyListItem.propTypes = {
  record: PropTypes.object,
};
