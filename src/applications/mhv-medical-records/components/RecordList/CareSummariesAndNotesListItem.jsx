import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { loincCodes } from '../../util/constants';

const CareSummariesAndNotesListItem = props => {
  const { record } = props;
  const isDischargeSummary = record.type === loincCodes.DISCHARGE_SUMMARY;

  return (
    <va-card
      background
      class="record-list-item vads-u-margin-y--2p5"
      data-testid="record-list-item"
    >
      {/* web view header */}
      <h3 className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin-bottom--0p5 no-print">
        <Link
          to={`/summaries-and-notes/${record.id}`}
          data-dd-privacy="mask"
          aria-label={`${record.name} on ${
            isDischargeSummary ? record.admissionDate : record.dateSigned
          }`}
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

      <div>
        {isDischargeSummary && (
          <span className="vads-u-display--inline">Admitted on </span>
        )}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {isDischargeSummary ? record.admissionDate : record.dateSigned}
        </span>
      </div>
      <div data-dd-privacy="mask">{record.location}</div>
      <div>
        <span className="vads-u-display--inline">
          {isDischargeSummary ? 'Discharged by ' : 'Signed by '}
        </span>
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {isDischargeSummary ? record.dischargedBy : record.signedBy}
        </span>
      </div>
    </va-card>
  );
};

export default CareSummariesAndNotesListItem;

CareSummariesAndNotesListItem.propTypes = {
  record: PropTypes.object,
};
