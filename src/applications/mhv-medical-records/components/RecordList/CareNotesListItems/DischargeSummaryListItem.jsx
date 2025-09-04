import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { sendDataDogAction } from '../../../util/helpers';

const DischargeSummaryListItem = ({ record }) => (
  <va-card
    background
    class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3"
    data-testid="record-list-item"
  >
    {/* web view header */}
    <div className="vads-u-font-weight--bold vads-u-margin-bottom--0p5">
      <Link
        to={`/summaries-and-notes/${record.id}`}
        data-dd-privacy="mask"
        data-dd-action-name="Care Summaries & Notes Detail Link"
        className="no-print"
        onClick={() => {
          sendDataDogAction('Care Summaries & Notes Detail Link');
        }}
        data-testid="note-name"
      >
        {record.name}
        <span className="sr-only" data-testid="sr-note-date">
          {`on ${record.admissionDate}`}
        </span>
      </Link>
    </div>

    {/* print view header */}
    <h2
      className="print-only"
      aria-hidden="true"
      data-dd-privacy="mask"
      data-dd-action-name="[care summary - name - Print]"
    >
      {record.name}
    </h2>

    {/* fields */}
    <div className="vads-u-margin-bottom--0p5" data-testid="note-item-date">
      {record.admissionDate}
    </div>
    <div
      className="vads-u-margin-bottom--0p5"
      data-dd-privacy="mask"
      data-dd-action-name="[care summary - location]"
      data-testid="note-location"
    >
      {record.location}
    </div>
    <div>
      <span className="vads-u-display--inline">Discharged by </span>
      <span
        className="vads-u-display--inline"
        data-dd-privacy="mask"
        data-dd-action-name="[care summary - written/discharged by]"
        data-testid="note-discharged-by"
      >
        {record.dischargedBy}
      </span>
    </div>
  </va-card>
);

DischargeSummaryListItem.propTypes = {
  record: PropTypes.object,
};

export default DischargeSummaryListItem;
