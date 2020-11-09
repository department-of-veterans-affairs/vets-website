import React, { useEffect } from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

export default function LoadingOverlay({ show, message }) {
  useEffect(
    () => {
      if (show) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
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
