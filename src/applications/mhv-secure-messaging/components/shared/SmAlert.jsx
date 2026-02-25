/**
 * SmAlert — drop-in replacement for VaAlert with built-in screen-reader
 * announcement timing.
 *
 * Wraps VaAlert and adds a hidden aria-live="polite" region whose content
 * is deferred until page focus has settled (via useFocusSettle).  This
 * prevents VoiceOver from swallowing the polite announcement when focus
 * moves at the same time the alert appears.
 *
 * Consumers never need to think about focus-settle timing — just use
 * SmAlert wherever you would use VaAlert and pass srMessage with the
 * text you want announced.
 *
 * @prop {string} srMessage — text for the polite screen-reader announcement.
 *   Pass a non-empty string while the alert is active; pass '' or omit to
 *   silence the announcement.
 *
 * All other props are forwarded directly to VaAlert.
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useFocusSettle from '../../hooks/useFocusSettle';

const SmAlert = forwardRef(({ srMessage, children, ...rest }, ref) => {
  const srContent = useFocusSettle(srMessage || '');

  return (
    <VaAlert ref={ref} {...rest}>
      {children}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {srContent}
      </span>
    </VaAlert>
  );
});

SmAlert.displayName = 'SmAlert';

SmAlert.propTypes = {
  children: PropTypes.node,
  srMessage: PropTypes.string,
};

export default SmAlert;
