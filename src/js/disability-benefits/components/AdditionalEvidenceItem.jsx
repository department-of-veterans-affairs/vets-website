import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { getItemDate } from '../utils/helpers';

export default function AdditionalEvidenceItem({ item }) {
  const itemDate = getItemDate(item);
  return (
    <div className="submitted-file-list-item">
      <p className="submission-file-type additional-evidence">Additional evidence</p>
      <p className="submission-item">
        <span className="claim-item-label">File:</span> {item.filename}<br/>
        <span className="claim-item-label">Type:</span> {item.fileType}
      </p>
      <div>
        <h6>Submitted</h6>
        {!!itemDate && <p className="submission-date">{moment(itemDate).format('MMM D, YYYY')}</p>}
      </div>
    </div>
  );
}

AdditionalEvidenceItem.propTypes = {
  item: PropTypes.object.isRequired
};
