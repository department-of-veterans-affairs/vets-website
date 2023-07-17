import React from 'react';
import PropTypes from 'prop-types';

const clinicsVisited = avs => {
  const clinics = avs.data.clinicsVisited.map(clinic => {
    // TODO: format time and add time zone.
    return (
      <div key={clinic.clinicIen}>
        <h3>{clinic.time}</h3>
        <ul>
          {/* TODO: style lists without bullets. */}
          {/* TODO: add building icon. */}
          <li>{clinic.site}</li>
          <li>{clinic.clinic}</li>
          {/* TODO: add details link. */}
        </ul>
      </div>
    );
  });
  return <div>{clinics}</div>;
};

const providers = avs => {
  const providerListItems = avs.data.providers.map((provider, idx) => (
    <li key={idx}>{provider}</li>
  ));
  return (
    <div>
      <h3>Providers</h3>
      <ul>{providerListItems}</ul>
    </div>
  );
};

const reasonForAppointment = avs => {
  if (avs.data.reasonForVisit.length > 0) {
    const reasonForVisitListItems = avs.data.reasonForVisit.map(
      (reason, idx) => <li key={idx}>{reason.diagnosis}</li>,
    );

    return (
      <div>
        <h3>Reason for appointment</h3>
        <ul>{reasonForVisitListItems}</ul>
      </div>
    );
  }

  return null;
};

const youWereDiagnosedWith = avs => {
  if (avs.data.diagnoses.length > 0) {
    const diagnosisListItems = avs.data.diagnoses.map((diagnosis, idx) => (
      <li key={idx}>{diagnosis.diagnosis}</li>
    ));

    return (
      <div>
        <h3>You were diagnosed with</h3>
        <ul>{diagnosisListItems}</ul>
      </div>
    );
  }

  return null;
};

const vitalSigns = avs => {
  if (avs.data.vitals.length > 0) {
    const vitalSignItems = avs.data.vitals.map((vitalSign, idx) => (
      <>
        <p key={idx}>
          {vitalSign.type}
          <br />
          {vitalSign.value}
        </p>
        <hr />
      </>
    ));

    return (
      <div>
        <h3>Vitals as of this appointment</h3>
        {/* TODO: Check semantics and spacing */}
        {vitalSignItems}
      </div>
    );
  }

  return null;
};

const procedures = avs => {
  if (avs.data.procedures?.length > 0) {
    // TODO: get procedures.

    return (
      <div>
        <h3>Procedures</h3>
      </div>
    );
  }

  return null;
};

const YourAppointment = props => {
  const { avs } = props;

  return (
    <div>
      {clinicsVisited(avs)}
      {providers(avs)}
      {reasonForAppointment(avs)}
      {youWereDiagnosedWith(avs)}
      {vitalSigns(avs)}
      {procedures(avs)}
    </div>
  );
};

export default YourAppointment;

YourAppointment.propTypes = {
  avs: PropTypes.object,
};
