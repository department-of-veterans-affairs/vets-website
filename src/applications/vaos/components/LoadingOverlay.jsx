import React, { useEffect } from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

let openTime;

export default function LoadingOverlay({ show, message }) {
  useEffect(
    () => {
      if (show) {
        document.body.classList.add('modal-open');
        openTime = Date.now();
      } else {
        document.body.classList.remove('modal-open');
        recordEvent({
          event: 'loading-indicator-displayed',
          'loading-indicator-display-time': Date.now() - openTime,
        });
      }
    },
    [show],
  );

  if (show) {
    return (
      <div className="vaos__loading-overlay">
        <div className="vaos__loading-overlay-inner">
          <LoadingIndicator message={message} />
        </div>
      </div>
    );
  }

  return null;
}
