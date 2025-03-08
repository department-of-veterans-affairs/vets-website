import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { sendDataDogAction } from '../../util/helpers';

const ConditionListItem = props => {
  const { record } = props;

  return (
    <va-card
      background
      class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3"
      data-testid="record-list-item"
    >
      <div className="vads-u-font-weight--bold vads-u-margin-bottom--0p5">
        <Link
          to={`/conditions/${record.id}`}
          data-dd-privacy="mask"
          data-dd-action-name="Health Conditions Detail Link"
          className="no-print"
          onClick={() => {
            sendDataDogAction('Health Conditions Detail Link');
          }}
        >
          {record.name} <span className="sr-only">{`on ${record.date}`}</span>
        </Link>
      </div>

      <h2
        className="print-only"
        aria-hidden="true"
        data-dd-privacy="mask"
        data-dd-action-name="[condition list - name - Print]"
      >
        {record.name}
      </h2>

      <p className="vads-u-margin--0">
        Date entered:{' '}
        <span
          data-dd-privacy="mask"
          data-dd-action-name="[condition list - date]"
        >
          {record?.date}
        </span>
      </p>
    </va-card>
  );
};

export default ConditionListItem;

ConditionListItem.propTypes = {
  record: PropTypes.object,
};
