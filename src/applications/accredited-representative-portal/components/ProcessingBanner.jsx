import React from 'react';
import PropTypes from 'prop-types';
import { resolutionDate } from '../utilities/poaRequests';

const ProcessingBanner = ({
  status,
  header,
  accepted,
  copy,
  date,
  representative,
}) => {
  return (
    <va-alert status={status} visible className="poa__alert">
      <h2>{header}</h2>
      <p className="vads-u-margin-y--0">
        {accepted && (
          <>
            <p className="processing-date">
              {representative} {accepted} {resolutionDate(date)}.
            </p>
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
  representative: PropTypes.string,
  status: PropTypes.string,
};

export default ProcessingBanner;
