import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { pharmacyPhoneNumber } from '@department-of-veterans-affairs/mhv/exports';
import { useRefillPrescriptionMutation } from '../../api/prescriptionsApi';
import CallPharmacyPhone from './CallPharmacyPhone';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';

const FillRefillButton = rx => {
  const [refillPrescription, { isLoading }] = useRefillPrescriptionMutation();

  const { dispensedDate, error, prescriptionId, success, isRefillable } = rx;

  const hasBeenDispensed =
    dispensedDate || rx.rxRfRecords?.find(record => record.dispensedDate);
  const pharmacyPhone = pharmacyPhoneNumber(rx);

  if (isRefillable) {
    return (
      <div className="rx-fill-refill-button" data-testid="fill-refill">
        {success && (
          <va-alert status="success" setFocus aria-live="polite" uswds>
            <p className="vads-u-margin-y--0" data-testid="success-message">
              We got your request to {`${dispensedDate ? 'refill' : 'fill'}`}{' '}
              this prescription.
            </p>
          </va-alert>
        )}
        {error &&
          !isLoading && (
            <>
              <va-alert
                status="error"
                setFocus
                id="fill-error-alert"
                data-testid="error-alert"
                aria-live="polite"
                uswds
              >
                <p className="vads-u-margin-y--0" data-testid="error-message">
                  We didn’t get your request. Try again.
                </p>
              </va-alert>
              <p className="vads-u-margin-bottom--1 vads-u-margin-top--2">
                If it still doesn’t work, call your VA pharmacy
                <CallPharmacyPhone
                  cmopDivisionPhone={pharmacyPhone}
                  page={pageType.LIST}
                />
              </p>
            </>
          )}
        {isLoading && (
          <va-loading-indicator
            message="Submitting your request..."
            set-focus
            data-testid="refill-loader"
          />
        )}
        <VaButton
          uswds
          type="button"
          className="va-button vads-u-padding-y--0p5"
          id={`fill-or-refill-button-${rx.prescriptionId}`}
          aria-describedby={`card-header-${prescriptionId}`}
          data-dd-action-name={
            dataDogActionNames.medicationsListPage.FILL_OR_REFILL_BUTTON
          }
          data-testid="refill-request-button"
          hidden={success || isLoading}
          onClick={() => {
            refillPrescription(prescriptionId);
          }}
          text={`Request ${hasBeenDispensed ? 'a refill' : 'the first fill'}`}
        />
      </div>
    );
  }

  return null;
};

FillRefillButton.propTypes = {
  rx: PropTypes.shape({
    dispensedDate: PropTypes.string,
    error: PropTypes.object,
    prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    refillRemaining: PropTypes.number,
    success: PropTypes.bool,
    dispStatus: PropTypes.string,
  }),
};

export default FillRefillButton;
