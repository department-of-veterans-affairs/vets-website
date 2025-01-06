import React, { useState } from 'react';
import {
  VaCheckbox,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { formatDateTime } from '../../../util/dates';
import TravelAgreementContent from '../../TravelAgreementContent';

const ReviewPage = ({
  appointment,
  address,
  onSubmit,
  pageIndex,
  setPageIndex,
  isAgreementChecked,
  setIsAgreementChecked,
}) => {
  const [formattedDate, formattedTime] = formatDateTime(
    appointment.vaos.apiData.start,
  );

  const [agreementModalOpen, setAgreementModalOpen] = useState(false);

  const onBack = e => {
    e.preventDefault();
    setPageIndex(pageIndex - 1);
  };

  return (
    <div>
      <h1 tabIndex="-1">Review your travel claim</h1>
      <p>Confirm the information is correct before you submit your claim.</p>

      <h2 className="vads-u-margin-top--2">Claims</h2>
      <hr className="vads-u-margin-y--0" />
      <h3 className=" vad-u-margin-top--0">What you’re claiming</h3>
      <p>
        Mileage-only reimbursement for your appointment at{' '}
        {appointment.vaos.apiData.location.attributes.name}{' '}
        {appointment.vaos?.apiData?.practitioners
          ? `with ${appointment.vaos.apiData.practitioners[0].name.given.join(
              ' ',
            )} ${appointment.vaos.apiData.practitioners[0].name.family}`
          : ''}{' '}
        on {formattedDate}, {formattedTime}.
      </p>

      <h2 className="vads-u-margin-top--3">Travel method</h2>
      <hr className="vads-u-margin-y--0" />
      <h3 className=" vad-u-margin-top--0">How you traveled</h3>
      <p>In your own vehicle</p>

      <h2 className="vads-u-margin-top--3">Starting address</h2>
      <hr className="vads-u-margin-y--0" />
      <h3 className="vad-u-margin-top--0">Where you traveled from</h3>
      <p className="vads-u-margin-top--3">
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
        <h3 className="vad-u-margin-bottom--2">Beneficiary travel agreement</h3>
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
          class="vads-u-margin-y--1"
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

      <div className="vads-u-margin-y--2">
        <va-button text="Back" onClick={e => onBack(e)} />
        <va-button text="Submit" onClick={e => onSubmit(e)} />
      </div>
    </div>
  );
};

ReviewPage.propTypes = {
  address: PropTypes.object,
  appointment: PropTypes.object,
  onSubmit: PropTypes.func,
  pageIndex: PropTypes.number,
  isAgreementChecked: PropTypes.bool,
  setIsAgreementChecked: PropTypes.func,
  setPageIndex: PropTypes.func,
};

export default ReviewPage;
