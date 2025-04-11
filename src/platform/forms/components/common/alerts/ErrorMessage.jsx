// libs
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';

/**
 * A column layout component
 * @param {boolean} active when true, renders the component
 * @param {node} children content that the columns class wraps
 * @param {string} message error message text to appear
 * @param {string} title error title text to appear
 */
function ErrorMessage(props) {
  const { active, children, message, testId, title } = props;
  const alertRef = useRef(null);

  useEffect(() => {
    if (active && alertRef?.current) {
      waitForRenderThenFocus('.schemaform-failure-alert');
    }
  }, [active, alertRef]);

  return !active ? null : (
    <va-alert
      ref={alertRef}
      status="error"
      class="schemaform-failure-alert vads-u-margin-top--4"
      data-testid={testId}
    >
      <h2 slot="headline" className="schemaform-warning-header">
        {title}
      </h2>
      <p>{message}</p>
      {children}
    </va-alert>
  );
}

ErrorMessage.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  message: PropTypes.string,
  testId: PropTypes.string,
  title: PropTypes.string,
};

export default ErrorMessage;
