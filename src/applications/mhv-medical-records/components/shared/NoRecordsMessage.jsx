import React from 'react';
import PropTypes from 'prop-types';
import { recordType } from '../../util/constants';

const NoRecordsMessage = ({ type, timeFrame }) => {
  let errorContent = (
    <va-card
      background
      class="record-list-item vads-u-margin-top--4 vads-u-margin-bottom--8"
      data-testid="record-list-item"
    >
      <h2
        className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans vads-u-margin-top--0 vads-u-margin-bottom--0"
        data-testid="no-records-message"
      >
        {`There are no ${type} in your VA medical records${
          timeFrame ? ` for ${timeFrame}` : ''
        }.`}
      </h2>
    </va-card>
  );
  if (type === recordType.VITALS) {
    errorContent = (
      <>
        <p>Vitals include:</p>
        <ul>
          <li>Blood pressure and blood oxygen level</li>
          <li>Breathing rate and heart rate</li>
          <li>Height and weight</li>
          <li>Temperature</li>
        </ul>
        {errorContent}
      </>
    );
  }
  return errorContent;
};

export default NoRecordsMessage;

NoRecordsMessage.propTypes = {
  timeFrame: PropTypes.string,
  type: PropTypes.string,
};
