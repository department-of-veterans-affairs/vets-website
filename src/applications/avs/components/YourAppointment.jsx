import React from 'react';
import PropTypes from 'prop-types';

import { getShortTimezone } from '../utils';

const clinicsVisited = avs => {
  const shortTimezone = getShortTimezone(avs);
  const clinics = avs.clinicsVisited.map(clinic => {
    return (
      <div key={clinic.clinicIen}>
        <h3>
          {clinic.time} {shortTimezone}
        </h3>
        <ul>
          {/* TODO: style lists without bullets. */}
          {/* TODO: add building icon. */}
          <li key="clinicSite">{clinic.site}</li>
          <li key="clinicName">{clinic.clinic}</li>
          {/* TODO: add details link. */}
        </ul>
      </div>
    );
  });
  return <div>{clinics}</div>;
};

const providers = avs => {
  const providerListItems = avs.providers.map((provider, idx) => (
    <li key={`provider-${idx}`}>{provider}</li>
  ));
  return (
    <div>
      <h3>Providers</h3>
      <ul>{providerListItems}</ul>
    </div>
  );
};

const reasonForAppointment = avs => {
  if (avs.reasonForVisit.length > 0) {
    const reasonForVisitListItems = avs.reasonForVisit.map(reason => (
      <li key={reason.code}>{reason.diagnosis}</li>
    ));

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
  if (avs.diagnoses.length > 0) {
    const diagnosisListItems = avs.diagnoses.map(diagnosis => (
      <li key={diagnosis.code}>{diagnosis.diagnosis}</li>
    ));

    return (
      <div>
        <h3>You were diagnosed with</h3>
        <ul className="bulleted-list">{diagnosisListItems}</ul>
      </div>
    );
  }

  return null;
};

const vitalSigns = avs => {
  if (avs.vitals.length > 0) {
    const vitalSignItems = avs.vitals.map((vitalSign, idx) => (
      <div key={`vital-${idx}`}>
        <p>
          {vitalSign.type}
          <br />
          Result: {vitalSign.value}
        </p>
        <hr />
      </div>
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
  if (avs.procedures?.length > 0) {
    // TODO: get procedures.

    return (
      <div>
        <h3>Procedures</h3>
        {/* TODO: use bulleted list. */}
      </div>
    );
  }

  return null;
};

const clinicMedications = avs => {
  if (avs.vaMedications?.length > 0) {
    // TODO: get clinic meds.

    return (
      <div>
        <h3>Medications ordered for administration in clinic</h3>
        <p>
          Medications ordered for administration during your visit to a VA
          clinic or emergency department.
        </p>
        {/* TODO: add "What do these medications terms mean?" */}
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
      {clinicMedications(avs)}
    </div>
  );
};

export default YourAppointment;

YourAppointment.propTypes = {
  avs: PropTypes.object,
};
