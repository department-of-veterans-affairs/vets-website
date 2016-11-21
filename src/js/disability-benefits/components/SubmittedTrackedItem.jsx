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
            {item.documents.length > 1 && <span><h6 className="claims-turnedin-file-header">File {index + 1}</h6><br/></span>}
            File: {doc.filename}<br/>
            Type: {doc.fileType}
          </div>)
        )
        : null}
      {closed &&
        <div>
          <h6>No longer requested or needed</h6>
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
  item: React.PropTypes.object.isRequired
};
