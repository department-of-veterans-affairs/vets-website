import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { getErrorTypeFromFormat } from '../../util/helpers';
import ApiErrorNotification from '../shared/ApiErrorNotification';
import { DOWNLOAD_FORMAT } from '../../util/constants';

const FileExportErrorNotification = ({ pdfTxtGenerateStatus }) => (
  <div className="vads-u-margin-y--3">
    <ApiErrorNotification
      errorType={getErrorTypeFromFormat(pdfTxtGenerateStatus.format)}
      content="records"
    >
      <div>
        If it still doesn’t work, call us at{' '}
        <va-telephone contact="8773270022" /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </div>
    </ApiErrorNotification>
  </div>
);

FileExportErrorNotification.propTypes = {
  pdfTxtGenerateStatus: PropTypes.shape({
    format: PropTypes.oneOf(Object.values(DOWNLOAD_FORMAT)),
  }).isRequired,
};

export default FileExportErrorNotification;
