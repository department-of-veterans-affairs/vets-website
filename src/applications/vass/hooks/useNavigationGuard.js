import { useEffect, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

/**
 * Custom hook for managing navigation guards in the VASS form
 *
 * This hook provides:
 * - Warning when leaving the form via external links
 * - Warning when closing/refreshing the browser window
 * - Modal confirmation for navigation attempts
 *
 * @param {Object} options Configuration options
 * @param {boolean} options.shouldBlock - Whether navigation should be blocked
 * @param {Function} options.onNavigateAway - Optional callback when user confirms navigation
 * @returns {Object} An object containing navigation guard state and handlers
 */
export const useNavigationGuard = ({
  shouldBlock = false,
  onNavigateAway = null,
} = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [blockedLocation, setBlockedLocation] = useState(null);

  // Handle browser window close/refresh
  const handleBeforeUnload = useCallback(
    e => {
      if (shouldBlock) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    },
    [shouldBlock],
  );

  // Handle clicks on links that leave the application
  const handleExternalLinkClick = useCallback(
    e => {
      if (!shouldBlock) return;

      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Check if link is external (starts with http/https or is absolute path outside app)
      const isExternal =
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        (href.startsWith('/') &&
          !href.startsWith(location.pathname.split('/')[1]));

      if (isExternal) {
        e.preventDefault();
        setBlockedLocation({ pathname: href, isExternal: true });
        setIsModalVisible(true);
      }
    },
    [shouldBlock, location.pathname],
  );

  // Set up event listeners
  useEffect(
    () => {
      if (shouldBlock) {
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleExternalLinkClick, true);
      }

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('click', handleExternalLinkClick, true);
      };
    },
    [shouldBlock, handleBeforeUnload, handleExternalLinkClick],
  );

  // Handle user confirming they want to leave
  const confirmNavigation = useCallback(
    () => {
      setIsModalVisible(false);

      if (onNavigateAway) {
        onNavigateAway();
      }

      if (blockedLocation) {
        if (blockedLocation.isExternal) {
          // For external links, navigate directly
          window.location.href = blockedLocation.pathname;
        } else {
          // For internal navigation, use navigate
          navigate(blockedLocation.pathname, { replace: false });
        }
        setBlockedLocation(null);
      }
    },
    [blockedLocation, navigate, onNavigateAway],
  );

  // Handle user canceling navigation
  const cancelNavigation = useCallback(() => {
    setIsModalVisible(false);
    setBlockedLocation(null);
  }, []);

  return {
    isModalVisible,
    blockedLocation,
    confirmNavigation,
    cancelNavigation,
    setIsModalVisible,
  };
};

export default useNavigationGuard;
