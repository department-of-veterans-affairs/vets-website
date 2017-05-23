import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { truncateDescription, hasBeenReviewed, getItemDate } from '../utils/helpers';

export default function SubmittedTrackedItem({ item }) {
  const closed = item.type.startsWith('never_received') || item.status === 'NO_LONGER_REQUIRED';
  const reviewed = hasBeenReviewed(item);
  return (
    <div className="submitted-file-list-item">
      <p className="submission-file-type">{item.displayName}</p>
      <p>{truncateDescription(item.description)}</p>
      {item.documents
        ? item.documents.map((doc, index) => (
          <div key={index} className="submission-item">
            <span className="claim-item-label">File:</span> {doc.filename}<br/>
            <span className="claim-item-label">Type:</span> {doc.fileType}
          </div>)
        )
        : null}
      {closed &&
        <div>
          <h6>No longer needed</h6>
        </div>}
      {!closed && reviewed &&
        <div>
          <h6 className="reviewed-file"><i className="fa fa-check-circle"></i>Reviewed by VA</h6>
          <p className="submission-date reviewed-file">{moment(getItemDate(item)).format('MMM D, YYYY')}</p>
        </div>}
      {!closed && !reviewed &&
        <div>
          <h6>Submitted</h6>
          <p className="submission-date">{moment(getItemDate(item)).format('MMM D, YYYY')}{' (pending)'}</p>
        </div>}
    </div>
  );
}

SubmittedTrackedItem.propTypes = {
  item: PropTypes.object.isRequired
};
