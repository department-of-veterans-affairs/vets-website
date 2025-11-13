import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { sendDataDogAction } from '../../util/helpers';

const AdditionalAccessInfo = ({ domainName }) => {
  const accessInfo = `Need more ${domainName}?`;

  return (
    <va-additional-info
      trigger={accessInfo}
      class="no-print vads-u-margin-y--3"
      data-dd-action-name={accessInfo}
    >
      <p>
        If you need more results, you can download full reports of your VA
        medical records or your self-entered health information.
      </p>
      <p>
        <Link
          to="/download"
          onClick={() => {
            sendDataDogAction('Additional Info Link');
          }}
        >
          Find medical records reports to download
        </Link>
      </p>
    </va-additional-info>
  );
};

AdditionalAccessInfo.propTypes = {
  domainName: PropTypes.string,
};

export default AdditionalAccessInfo;
