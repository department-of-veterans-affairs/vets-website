import React from 'react';
import moment from 'moment';

import { getSubmittedItemDate } from '../utils/helpers';

export default function SubmittedTrackedItem({ item }) {
  const itemDate = getSubmittedItemDate(item);
  return (
    <div className="submitted-file-list-item">
      <p className="submission-file-type">Additional Evidence</p>
      <p className="submission-item">
        File: {item.filename}<br/>
        Type: {item.fileType}
      </p>
      <div>
        <h6>Submitted</h6>
        {!!itemDate && <p className="submission-date">{moment(itemDate).format('MMM D, YYYY')}</p>}
      </div>
    </div>
  );
}

SubmittedTrackedItem.propTypes = {
  item: React.PropTypes.object.required
};
