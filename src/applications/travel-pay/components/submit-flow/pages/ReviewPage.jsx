import React from 'react';
import { formatDateTime } from '../../../util/dates';

const ReviewPage = props => {
  const { appointment, address, onSubmit, pageIndex, setPageIndex } = props;

  //   clinicName,
  //   clinicPhysicalLocation,
  //   clinicPhone,
  //   clinicPhoneExtension,
  //   facility,
  //   facilityPhone,
  //   locationId,
  //   isPastAppointment,
  //   practitionerName,
  //   startDate,
  //   status,
  //   typeOfCareName,

  const [formattedDate, formattedTime] = formatDateTime(
    appointment.vaos.apiData.start,
  );

  const onBack = e => {
    e.preventDefault();
    setPageIndex(pageIndex - 1);
  };

  return (
    <div className="vads-u-margin--3">
      <h1 className="vad-u-margin-top--0">Review your travel claim</h1>
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

      <h3 className="vad-u-margin-y--3">Travel agreement block</h3>

      <va-button
        className="vads-u-margin-top--3"
        text="Back"
        onClick={e => onBack(e)}
      />
      <va-button
        className="vads-u-margin-top--3"
        text="Submit"
        onClick={e => onSubmit(e)}
      />
    </div>
  );
};

export default ReviewPage;
