import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
// Note: Cross-app import for research study component
// eslint-disable-next-line import/no-unresolved
import { TaskTabs } from '~/applications/survivors-benefits/shared/components/TaskTabs';
// eslint-disable-next-line import/no-unresolved
import { Portal } from '~/applications/survivors-benefits/shared/components/Portal';
// eslint-disable-next-line import/no-unresolved
import { useMockedLogin } from '~/applications/survivors-benefits/hooks/useMockedLogin';

const TaskTabsRenderer = () => {
  // Get location from Redux store or window
  const routeState = useSelector(state => state.userNav?.route);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useLoggedInQuery } = useMockedLogin();
  const [shouldRender, setShouldRender] = React.useState(false);
  const [headerElements, setHeaderElements] = React.useState({
    minimal: null,
    default: null,
  });

  // Create location object that TaskTabs expects
  // Also watch window.location directly since routeState might not update for component-based apps
  const [windowLocation, setWindowLocation] = React.useState(() => ({
    pathname: window.location.pathname,
    search: window.location.search,
  }));

  React.useEffect(
    () => {
      const updateLocation = () => {
        setWindowLocation({
          pathname: window.location.pathname,
          search: window.location.search,
        });
      };

      // Update on route state changes
      if (routeState?.path || routeState?.search) {
        updateLocation();
      }

      // Also listen to popstate for browser navigation
      window.addEventListener('popstate', updateLocation);

      // Check periodically for URL changes (for apps that don't update route state)
      const interval = setInterval(() => {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        if (
          currentPath !== windowLocation.pathname ||
          currentSearch !== windowLocation.search
        ) {
          updateLocation();
        }
      }, 200);

      return () => {
        window.removeEventListener('popstate', updateLocation);
        clearInterval(interval);
      };
    },
    [routeState, windowLocation.pathname, windowLocation.search],
  );

  const location = React.useMemo(
    () => {
      const pathname =
        routeState?.path || windowLocation.pathname || window.location.pathname;
      const search =
        routeState?.search || windowLocation.search || window.location.search;

      // Parse query string into query object for useLoggedInQuery
      const query = {};
      if (search) {
        const searchParams = new URLSearchParams(search);
        searchParams.forEach((value, key) => {
          query[key] = value;
        });
      }

      return {
        pathname: pathname + (search || ''),
        query,
      };
    },
    [routeState, windowLocation],
  );

  useLoggedInQuery(location);

  // Check if we should render - only on root "/" or "/my-va", not on form paths
  React.useEffect(
    () => {
      const checkAndRender = () => {
        // Always use window.location.pathname as the source of truth first
        // routeState might not be updated for apps that use component instead of routes
        const currentPath = window.location.pathname || routeState?.path || '/';
        // Normalize path by removing trailing slashes (except for root)
        const normalizedPath = currentPath.replace(/\/+$/, '') || '/';
        const isFormPath = normalizedPath.includes(
          '/records/request-personal-records-form-20-10206',
        );

        // Only render on root "/" or "/my-va" paths, not on form paths
        const shouldShow =
          !isFormPath &&
          (normalizedPath === '/' || normalizedPath === '/my-va');

        if (shouldShow) {
          // Wait a bit to check if PatternConfigProvider already rendered TaskTabs
          const checkForExistingTabs = () => {
            const headerMinimal = document.getElementById('header-minimal');
            const headerDefault = document.getElementById('header-default');

            if (headerMinimal) {
              const existing = headerMinimal.querySelector(
                'nav[aria-label="Research study task navigation"]',
              );
              if (existing) return false;
            }
            if (headerDefault) {
              const existing = headerDefault.querySelector(
                'nav[aria-label="Research study task navigation"]',
              );
              if (existing) return false;
            }

            // Update header elements state if they exist
            if (headerMinimal || headerDefault) {
              setHeaderElements({
                minimal: headerMinimal,
                default: headerDefault,
              });
              return true;
            }

            return false;
          };

          // Try to find headers immediately
          if (checkForExistingTabs()) {
            setShouldRender(true);
          } else {
            // Delay check to allow headers to be rendered
            let retryTimeout;
            const timeout = setTimeout(() => {
              if (checkForExistingTabs()) {
                setShouldRender(true);
              } else {
                // Retry after a longer delay if headers aren't ready
                retryTimeout = setTimeout(() => {
                  if (checkForExistingTabs()) {
                    setShouldRender(true);
                  }
                }, 1000);
              }
            }, 300);

            return () => {
              clearTimeout(timeout);
              if (retryTimeout) {
                clearTimeout(retryTimeout);
              }
            };
          }
        } else {
          setShouldRender(false);
          // Don't clear header elements when shouldShow is false,
          // as they might still be needed if we navigate back
        }
        return undefined;
      };

      checkAndRender();

      // Also listen to popstate events for browser navigation
      const handlePopState = () => {
        setTimeout(checkAndRender, 100);
      };

      window.addEventListener('popstate', handlePopState);

      // Listen to custom route change events if they exist
      const handleRouteChange = () => {
        setTimeout(checkAndRender, 100);
      };

      window.addEventListener('va:route-change', handleRouteChange);

      // Also check periodically in case route state doesn't update immediately
      // Always check window.location.pathname as the source of truth
      const interval = setInterval(() => {
        checkAndRender();
      }, 300);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('va:route-change', handleRouteChange);
        clearInterval(interval);
      };
    },
    [routeState],
  );

  // Create formConfig - use the 20-10206 form's rootUrl for the tabs
  const formConfig = React.useMemo(
    () => ({
      rootUrl:
        'family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez',
    }),
    [],
  );

  if (!shouldRender || (!headerElements.minimal && !headerElements.default)) {
    return null;
  }

  return (
    <>
      {headerElements.minimal && (
        <Portal target={headerElements.minimal}>
          <TaskTabs location={location} formConfig={formConfig} />
        </Portal>
      )}
      {headerElements.default && (
        <Portal target={headerElements.default}>
          <TaskTabs location={location} formConfig={formConfig} />
        </Portal>
      )}
    </>
  );
};

export default function startTaskTabs(store) {
  // Wait for DOM to be ready and header elements to exist
  const initTaskTabs = () => {
    const headerMinimal = document.getElementById('header-minimal');
    const headerDefault = document.getElementById('header-default');

    if (headerMinimal || headerDefault) {
      // Create a container for the TaskTabs widget
      const container = document.createElement('div');
      container.id = 'task-tabs-widget-container';
      container.style.display = 'none'; // Hide the container, we only need it for React rendering
      document.body.appendChild(container);

      ReactDOM.render(
        <Provider store={store}>
          <TaskTabsRenderer />
        </Provider>,
        container,
      );
    } else {
      // Retry after a short delay if headers aren't ready yet
      setTimeout(initTaskTabs, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTaskTabs);
  } else {
    // Use setTimeout to ensure headers are rendered
    setTimeout(initTaskTabs, 0);
  }
}
