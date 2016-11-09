import React from 'react';
import moment from 'moment';

import { truncateDescription, hasBeenReviewed, getSubmittedItemDate } from '../utils/helpers';

export default function SubmittedTrackedItem({ item }) {
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
      {hasBeenReviewed(item)
        ?
        <div>
          <h6 className="reviewed-file"><i className="fa fa-check-circle"></i>Reviewed by VA</h6>
          <p className="submission-date reviewed-file">{moment(getSubmittedItemDate(item)).format('MMM D, YYYY')}</p>
        </div>
        :
        <div>
          <h6>Submitted</h6>
          <p className="submission-date">{moment(getSubmittedItemDate(item)).format('MMM D, YYYY')}{' (pending)'}</p>
        </div>
      }
    </div>
  );
}

SubmittedTrackedItem.propTypes = {
  item: React.PropTypes.object.isRequired
};
