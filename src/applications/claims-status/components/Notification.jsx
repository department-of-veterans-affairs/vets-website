import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function Notification({
  body,
  role,
  title,
  type,
  onClose,
  onSetFocus,
}) {
  const closeable = !!onClose;
  useEffect(
    () => {
      if (typeof onSetFocus === 'function') {
        // Delay ensures focus lands on alert, not competing elements
        setTimeout(() => {
          onSetFocus();
        }, 150);
      }
    },
    [title, body, onSetFocus],
  );

  return (
    <VaAlert
      data-testid="notification"
      close-btn-aria-label="Close notification"
      className="claims-alert"
      closeable={closeable}
      onCloseEvent={onClose}
      role={role}
      status={type}
      visible
    >
      <h2 slot="headline" className="vads-u-margin-top--0">
        {title}
      </h2>
      <div className="vads-u-margin-y--0">{body}</div>
    </VaAlert>
  );
}

Notification.defaultProps = {
  type: 'success',
};

Notification.propTypes = {
  body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['alert', 'alertdialog', 'status']),
  type: PropTypes.string,
  onClose: PropTypes.func,
  onSetFocus: PropTypes.func,
};
