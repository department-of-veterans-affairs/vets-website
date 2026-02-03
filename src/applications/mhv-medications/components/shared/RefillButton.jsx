import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { differenceInDays, parseISO } from 'date-fns';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { pharmacyPhoneNumber } from '@department-of-veterans-affairs/mhv/exports';
import { useRefillPrescriptionMutation } from '../../api/prescriptionsApi';
import CallPharmacyPhone from './CallPharmacyPhone';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';

const REFILL_SUPPRESSION_DAYS = 15;

/**
 * Check if a refill was recently submitted (within suppression period)
 * @param {string} refillSubmitDate - ISO date string of last refill submission
 * @returns {boolean} true if refill was submitted within suppression period
 */
const wasRecentlySubmitted = refillSubmitDate => {
  if (!refillSubmitDate) return false;

  try {
    const submitDate = parseISO(refillSubmitDate);
    const daysSinceSubmit = differenceInDays(new Date(), submitDate);
    return daysSinceSubmit < REFILL_SUPPRESSION_DAYS;
  } catch {
    return false;
  }
};

const RefillButton = rx => {
  const [localError, setLocalError] = useState(false);

  const [
    refillPrescription,
    { isLoading, isSuccess, isError },
  ] = useRefillPrescriptionMutation({
    fixedCacheKey: 'refill-request',
  });

  const { prescriptionId, isRefillable, refillSubmitDate } = rx;

  const pharmacyPhone = pharmacyPhoneNumber(rx);

  if (!isRefillable || wasRecentlySubmitted(refillSubmitDate)) {
    return null;
  }

  const handleRefillClick = async () => {
    try {
      setLocalError(false);
      await refillPrescription(prescriptionId).unwrap();
    } catch (error) {
      setLocalError(true);
    }
  };

  // Use RTK Query's isError but fallback to localError to prevent false positives during cache invalidation
  const showError = (isError && !isLoading) || (localError && !isLoading);

  return (
    <div className="rx-refill-button" data-testid="refill">
      {isSuccess && (
        <div className="vads-u-padding-top--2">
          <va-alert status="success" setFocus aria-live="polite" uswds>
            <p className="vads-u-margin-y--0" data-testid="success-message">
              We got your refill request.
            </p>
          </va-alert>
        </div>
      )}
      {showError &&
        !isLoading && (
          <div className="vads-u-padding-y--2">
            <va-alert
              status="error"
              setFocus
              id="refill-error-alert"
              data-testid="error-alert"
              aria-live="polite"
              uswds
            >
              <p className="vads-u-margin-y--0" data-testid="error-message">
                We couldn’t submit this refill request. Try again or call your
                VA pharmacy
                <CallPharmacyPhone
                  cmopDivisionPhone={pharmacyPhone}
                  page={pageType.LIST}
                />
              </p>
            </va-alert>
          </div>
        )}
      {isLoading && (
        <va-loading-indicator
          message="Submitting your request..."
          set-focus
          data-testid="refill-loader"
        />
      )}
      <VaButton
        secondary
        uswds
        className="va-button vads-u-padding-y--0p5"
        id={`refill-button-${prescriptionId}`}
        aria-describedby={`card-header-${prescriptionId}`}
        data-dd-action-name={
          dataDogActionNames.medicationsListPage.REFILL_BUTTON
        }
        data-testid="refill-request-button"
        hidden={isSuccess || isLoading}
        onClick={handleRefillClick}
        text="Request a refill"
      />
    </div>
  );
};

RefillButton.propTypes = {
  cmopDivisionPhone: PropTypes.string,
  isRefillable: PropTypes.bool,
  prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  refillSubmitDate: PropTypes.string,
};

export default RefillButton;
