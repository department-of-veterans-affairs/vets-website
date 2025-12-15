import PropTypes from 'prop-types';
import React from 'react';
import {
  VaCard,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { buildDateFormatter } from '../utils/helpers';

const formatDate = buildDateFormatter();

const VARIANT_CONFIG = {
  received: {
    datePrefix: 'Received on',
    testIdPrefix: 'file-received-card',
  },
  'in-progress': {
    datePrefix: 'Submission started on',
    testIdPrefix: 'file-in-progress-card',
  },
  failed: {
    datePrefix: 'Date failed:',
    testIdPrefix: 'failed-file',
  },
};

const DocumentCard = ({
  index,
  variant,
  statusBadgeText,
  headingRef,
  fileName,
  documentType,
  requestTypeText,
  date,
  link,
}) => {
  const config = VARIANT_CONFIG[variant];
  const testId = `${config.testIdPrefix}-${index}`;
  const displayFileName = fileName || 'File name unknown';
  const hasRealFileName = Boolean(fileName);

  return (
    <VaCard className="vads-u-margin-y--3" data-testid={testId}>
      {statusBadgeText && (
        <div className="file-status-badge vads-u-margin-bottom--2">
          <span className="vads-u-visibility--screen-reader">Status</span>
          <span className="usa-label vads-u-padding-x--1">
            {statusBadgeText}
          </span>
        </div>
      )}
      <h4
        className="filename-title vads-u-font-size--h4 vads-u-margin-y--0"
        style={{ overflowWrap: 'break-word' }}
        {...hasRealFileName && {
          'data-dd-privacy': 'mask',
          'data-dd-action-name': 'document filename',
        }}
        ref={headingRef}
        tabIndex="-1"
      >
        {displayFileName}
      </h4>
      <div>
        {documentType && (
          <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">{`Document type: ${documentType}`}</p>
        )}
        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
          {requestTypeText}
        </p>
      </div>
      {date && (
        <p className="document-card-date vads-u-margin-top--2 vads-u-margin-bottom--0">
          {`${config.datePrefix} ${formatDate(date)}`}
        </p>
      )}
      {link && (
        <div className="vads-u-margin-top--0p5">
          <VaLink active href={link.href} text={link.text} label={link.label} />
        </div>
      )}
    </VaCard>
  );
};

DocumentCard.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  requestTypeText: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['received', 'in-progress', 'failed']).isRequired,
  date: PropTypes.string,
  documentType: PropTypes.string,
  fileName: PropTypes.string,
  headingRef: PropTypes.func,
  link: PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    label: PropTypes.string,
  }),
  statusBadgeText: PropTypes.string,
};

export default DocumentCard;
