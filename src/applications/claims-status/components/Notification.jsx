import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function Notification({
  body,
  title,
  type,
  onClose,
  onSetFocus,
}) {
  const closeable = !!onClose;
  useEffect(() => {
    if (typeof onSetFocus === 'function') {
      setTimeout(() => {
        onSetFocus();
      });
    }
  });

  return (
    <VaAlert
      data-testid="notification"
      close-btn-aria-label="Close notification"
      className="claims-alert"
      closeable={closeable}
      onCloseEvent={onClose}
      status={type}
      visible
    >
      <h2 slot="headline">{title}</h2>
      <p className="vads-u-margin-y--0">{body}</p>
    </VaAlert>
  );
}

Notification.defaultProps = {
  type: 'success',
};

Notification.propTypes = {
  body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClose: PropTypes.func,
  onSetFocus: PropTypes.func,
};
