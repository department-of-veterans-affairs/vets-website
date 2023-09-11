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
          <h3
            className="vads-u-font-size--h4 vads-u-margin--0 vads-u-line-height--4"
            aria-label={`${record.name} ${record.date}`}
          >
            {record.name}
          </h3>

          <div className="fields">
            <div>
              <span className="field-label">Date entered:</span>{' '}
              <span
                className="vads-u-display--inline-block"
                data-dd-privacy="mask"
              >
                {record.date}
              </span>
            </div>
            <div className="print-only">
              <span className="field-label">Reaction:</span>{' '}
              <ItemList list={record.reaction} />
            </div>
            <div className="print-only">
              <span className="field-label">Type of allergy:</span>{' '}
              <span data-dd-privacy="mask">{record.type}</span>
            </div>
            <div className="print-only">
              <span className="field-label">Location:</span>{' '}
              <span data-dd-privacy="mask">{record.location}</span>
            </div>
            <div className="print-only">
              <span className="field-label">Observed or reported:</span>{' '}
              <span data-dd-privacy="mask">{record.observedOrReported}</span>
            </div>
            <div className="print-only">
              <span className="field-label">Provider notes:</span>{' '}
              <span data-dd-privacy="mask">{record.notes}</span>
            </div>
          </div>

          <Link
            to={`/allergies/${record.id}`}
            className="vads-u-margin--0 no-print"
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
              {record.name} {record.date}
            </span>
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
