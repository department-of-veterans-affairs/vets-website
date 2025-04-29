import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollTo, focusElement } from 'platform/utilities/ui';

const SubmissionError = () => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo(alertRef.current);
        focusElement('h3', {}, alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <va-alert
      ref={alertRef}
      id="submission-error"
      status="error"
      class="vads-u-margin-y--2"
      uswds
    >
      <h3 slot="headline">We couldn’t generate your form</h3>
      <p>
        We’re sorry. Something went wrong when we tried to generate your form.
        Select the <b>Continue</b> button to try again.
      </p>
    </va-alert>
  );
};

SubmissionError.propTypes = {
  form: PropTypes.shape({
    inProgressFormId: PropTypes.number,
  }),
};

export default SubmissionError;
