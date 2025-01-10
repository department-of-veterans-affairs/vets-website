import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  VaCheckbox,
  VaModal,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { formatDateTime } from '../../../util/dates';
import TravelAgreementContent from '../../TravelAgreementContent';

const ReviewPage = ({
  appointment,
  address,
  onSubmit,
  setPageIndex,
  setYesNo,
  isAgreementChecked,
  setIsAgreementChecked,
}) => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const [formattedDate, formattedTime] = formatDateTime(
    appointment.vaos.apiData.start,
  );

  const [agreementModalOpen, setAgreementModalOpen] = useState(false);

  const onBack = () => {
    setYesNo({
      mileage: '',
      vehicle: '',
      address: '',
    });
    setPageIndex(1);
  };

  return (
    <div>
      <h1 tabIndex="-1" className="vad-u-margin-top--0">
        Review your travel claim
      </h1>
      <p>Confirm the information is correct before you submit your claim.</p>

      <h2 className="vads-u-margin-bottom--0">Claims</h2>
      <hr className="vads-u-margin-y--1" />
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
        What you’re claiming
      </h3>
      <p className="vads-u-margin-y--0">
        Mileage-only reimbursement for your appointment at{' '}
        {appointment.vaos.apiData.location.attributes.name}{' '}
        {appointment.vaos?.apiData?.practitioners
          ? `with ${appointment.vaos.apiData.practitioners[0].name.given.join(
              ' ',
            )} ${appointment.vaos.apiData.practitioners[0].name.family}`
          : ''}{' '}
        on {formattedDate}, {formattedTime}.
      </p>

      <h2 className="vads-u-margin-bottom--0">Travel method</h2>
      <hr className="vads-u-margin-y--1" />
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
        How you traveled
      </h3>
      <p className="vads-u-margin-y--0">In your own vehicle</p>

      <h2 className="vads-u-margin-bottom--0">Starting address</h2>
      <hr className="vads-u-margin-y--1" />
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
        Where you traveled from
      </h3>
      <p className="vads-u-margin-bottom--3 vads-u-margin-top--0">
        {address.addressLine1}
        <br />
        {address.addressLine2 && (
          <>
            {address.addressLine2}
            <br />
          </>
        )}
        {address.addressLine3 && (
          <>
            {address.addressLine3}
            <br />
          </>
        )}
        {`${address.city}, ${address.stateCode} ${address.zipCode}`}
        <br />
      </p>

      <va-card background>
        <h3 className="vad-u-margin-bottom--2 vads-u-margin-top--0">
          Beneficiary travel agreement
        </h3>
        <p>
          <strong>Penalty statement:</strong> There are severe criminal and
          civil penalties, including a fine, imprisonment, or both, for
          knowingly submitting a false, fictitious, or fraudulent claim.
        </p>
        <p>
          By submitting this claim, you agree to the beneficiary travel
          agreement.
        </p>

        <va-button
          secondary
          class="vads-u-margin-bottom--1"
          onClick={() => setAgreementModalOpen(true)}
          text="View beneficiary travel agreement"
          uswds
        />
        <VaModal
          modalTitle="Beneficiary travel agreement"
          onCloseEvent={() => setAgreementModalOpen(false)}
          onPrimaryButtonClick={() => setAgreementModalOpen(false)}
          primaryButtonText="Finish reviewing your travel claim"
          visible={agreementModalOpen}
        >
          <>
            <TravelAgreementContent />
            <p>
              Review your claim information now to file your travel pay claim.
            </p>
          </>
        </VaModal>

        <VaCheckbox
          className="vads-u-margin-x--1 vads-u-margin-y--2"
          checked={isAgreementChecked}
          name="accept-agreement"
          description={null}
          error={
            !isAgreementChecked
              ? 'You must accept the beneficiary travel agreement before continuing.'
              : null
          }
          hint={null}
          label="I confirm that the information is true and correct to the best of my knowledge and belief. I’ve read and I accept the beneficiary travel agreement."
          onVaChange={() => setIsAgreementChecked(!isAgreementChecked)}
          required
        />
      </va-card>

      <VaButtonPair
        class="vads-u-margin-top--2"
        leftButtonText="File claim"
        rightButtonText="Start over"
        onPrimaryClick={onSubmit}
        onSecondaryClick={onBack}
      />
    </div>
  );
};

ReviewPage.propTypes = {
  address: PropTypes.object,
  appointment: PropTypes.object,
  onSubmit: PropTypes.func,
  isAgreementChecked: PropTypes.bool,
  setIsAgreementChecked: PropTypes.func,
  setPageIndex: PropTypes.func,
  setYesNo: PropTypes.func,
};

export default ReviewPage;
