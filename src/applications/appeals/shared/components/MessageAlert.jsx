import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { scrollAndFocus } from 'platform/utilities/scroll';

export const MessageAlert = ({
  title,
  message,
  headerLevel = 3,
  errorKey,
  errorReason,
  classes = 'vads-u-margin-bottom--2',
}) => {
  const wrapAlert = useRef(null);
  const Header = `h${headerLevel}`;

  useEffect(
    () => {
      if (wrapAlert?.current) {
        scrollAndFocus(wrapAlert.current);
      }
    },
    [wrapAlert],
  );

  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'error',
    'alert-box-heading': title,
    'error-key': errorKey,
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': errorReason,
  });

  return (
    <div ref={wrapAlert}>
      <va-alert status="error" class={classes}>
        <Header slot="headline" className="eligible-issues-error">
          {title}
        </Header>
        <p>{message}</p>
      </va-alert>
    </div>
  );
};

MessageAlert.propTypes = {
  classes: PropTypes.string,
  errorKey: PropTypes.string,
  errorReason: PropTypes.string,
  headerLevel: PropTypes.number,
  message: PropTypes.string,
  title: PropTypes.string,
};
