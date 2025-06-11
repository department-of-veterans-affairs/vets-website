import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

export const ConfirmationAlert = ({ alertTitle, children }) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('va-alert h2', alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div>
      <va-alert status="success" ref={alertRef}>
        <h2 slot="headline">{alertTitle}</h2>
        {children}
      </va-alert>
    </div>
  );
};

ConfirmationAlert.propTypes = {
  alertTitle: PropTypes.string,
  children: PropTypes.element,
};
