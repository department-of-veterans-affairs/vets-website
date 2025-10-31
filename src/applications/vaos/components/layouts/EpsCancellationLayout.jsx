import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function EpsCancellationLayout({
  cancellationConfirmed,
  onConfirmCancellation,
  onAbortCancellation,
}) {
  return (
    <div>
      {/* TODO: https://github.com/department-of-veterans-affairs/va.gov-team/issues/122972 */}
      <p>Cancellation appointment detail card goes here</p>
      {!cancellationConfirmed && (
        <div className="vads-u-display--flex vads-u-margin-top--4 vaos-appts__block-label vads-u-flex-direction--column  vaos-hide-for-print  vaos-form__button-container">
          <VaButton
            text="Yes, cancel appointment"
            onClick={() => {
              onConfirmCancellation();
            }}
            data-testid="cancel-button"
            uswds
          />
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
      )}
    </div>
  );
}

EpsCancellationLayout.propTypes = {
  cancellationConfirmed: PropTypes.bool.isRequired,
  onAbortCancellation: PropTypes.func.isRequired,
  onConfirmCancellation: PropTypes.func.isRequired,
};
