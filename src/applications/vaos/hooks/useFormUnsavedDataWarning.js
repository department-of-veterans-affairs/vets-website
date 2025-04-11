import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function onBeforeUnload(e) {
  const expirationDate = localStorage.getItem('sessionExpiration');
  const expirationDateSSO = localStorage.getItem('sessionExpirationSSO');

  // If there's no expiration date, then the session has already expired
  // and keeping a person on the form won't save their data
  if (expirationDate || expirationDateSSO) {
    e.preventDefault();
    e.returnValue =
      'Are you sure you wish to leave this application? All progress will be lost.';
  }
}
/**
 * Hook for managing the warning message about unsaved data on forms.
 *
 * @export
 * @param {Object} [hookParams={}]
 * @param {boolean} [hookParams.disabled=false] A boolean indicating if we should currently show the unsaved
 *   data warning. Can be used to disable the warning on certain pages
 */
export default function useFormUnsavedDataWarning({ disabled = false } = {}) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith('confirmation')) {
      window.removeEventListener('beforeunload', onBeforeUnload);
    }
  }, [location]);

  useEffect(() => {
    if (disabled) {
      window.removeEventListener('beforeunload', onBeforeUnload);
    } else {
      window.addEventListener('beforeunload', onBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [location.pathname, disabled]);
}
