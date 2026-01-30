import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import { selectFlowType, selectUuid } from '../redux/slices/formSlice';
import { FLOW_TYPES, URLS } from '../utils/constants';

/**
 * HOC that restricts route access based on the user's current flow type.
 *
 * This prevents users from switching between schedule and cancel flows:
 * - Users in the 'schedule' flow cannot access cancel-only routes
 * - Users in the 'cancel' flow cannot access schedule-only routes
 * - Routes marked as 'any' are accessible from both flows
 *
 * @param {React.Component} Component - The component to wrap
 * @param {'schedule'|'cancel'|'any'} allowedFlow - Which flow can access this route
 * @returns {React.Component} - The wrapped component with flow guard logic
 */
const withFlowGuard = (Component, allowedFlow = FLOW_TYPES.ANY) => {
  const WrappedComponent = props => {
    const navigate = useNavigate();
    const flowType = useSelector(selectFlowType);
    const uuid = useSelector(selectUuid);

    useEffect(
      () => {
        // Skip guard if route allows any flow
        if (allowedFlow === FLOW_TYPES.ANY) return;

        // Skip guard if flow type hasn't been set yet (user just started)
        if (!flowType || flowType === FLOW_TYPES.ANY) return;

        // If user's flow doesn't match the allowed flow, redirect to start
        if (flowType !== allowedFlow) {
          // Redirect back to Verify page with uuid to restart in their original flow
          const redirectUrl = uuid
            ? `${URLS.VERIFY}?uuid=${uuid}${
                flowType === FLOW_TYPES.CANCEL ? '&cancel=true' : ''
              }`
            : `${URLS.VERIFY}${
                flowType === FLOW_TYPES.CANCEL ? '?cancel=true' : ''
              }`;
          navigate(redirectUrl, { replace: true });
        }
      },
      [flowType, navigate, uuid],
    );

    // Don't render while redirect is pending (wrong flow detected)
    if (
      allowedFlow !== FLOW_TYPES.ANY &&
      flowType &&
      flowType !== FLOW_TYPES.ANY &&
      flowType !== allowedFlow
    ) {
      return null;
    }

    return <Component {...props} />;
  };

  // Set display name for debugging
  WrappedComponent.displayName = `withFlowGuard(${Component.displayName ||
    Component.name ||
    'Component'})`;

  return WrappedComponent;
};

export default withFlowGuard;
