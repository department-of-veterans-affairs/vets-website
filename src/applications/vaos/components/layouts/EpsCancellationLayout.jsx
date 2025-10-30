import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function EpsCancellationLayout({
  cancellationConfirmed,
  onConfirmCancellation,
  onAbortCancellation,
}) {
  if (cancellationConfirmed) {
    return (
      <div>
        {/* TODO: https://github.com/department-of-veterans-affairs/va.gov-team/issues/122970 */}
        <p>Cancellation successful component goes here</p>
      </div>
    );
  }

  return (
    <div>
      {/* TODO: https://github.com/department-of-veterans-affairs/va.gov-team/issues/122968 */}
      <p>Cancellation confirm page goes here</p>
      <div>
        <VaButton
          text="Yes, cancel appointment"
          secondary
          onClick={() => {
            onConfirmCancellation();
          }}
          data-testid="cancel-button"
          uswds
        />
      </div>
      <div>
        <VaButton
          text="No, do not cancel"
          secondary
          onClick={() => {
            onAbortCancellation();
          }}
          data-testid="do-not-cancel-button"
          uswds
        />
      </div>
    </div>
  );
}

EpsCancellationLayout.propTypes = {
  cancellationConfirmed: PropTypes.bool.isRequired,
  onAbortCancellation: PropTypes.func.isRequired,
  onConfirmCancellation: PropTypes.func.isRequired,
};
