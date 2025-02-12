import React from 'react';
import PropTypes from 'prop-types';
import { resolutionDate } from '../utilities/poaRequests';

const ProcessingBanner = ({ status, header, accepted, copy, date }) => {
  return (
    <va-alert status={status} visible>
      <h2>{header}</h2>
      <p className="vads-u-margin-y--0">
        {accepted && (
          <>
            <span className="processing-date">
              {accepted} <strong>{resolutionDate(date)}</strong>.
            </span>
            <br />
          </>
        )}
        {copy}
      </p>
    </va-alert>
  );
};

ProcessingBanner.propTypes = {
  accepted: PropTypes.string,
  copy: PropTypes.string,
  date: PropTypes.string,
  header: PropTypes.object,
  status: PropTypes.string,
};

export default ProcessingBanner;
