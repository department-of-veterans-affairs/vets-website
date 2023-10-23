import React from 'react';
import PropTypes from 'prop-types';

import { getFormattedAppointmentTime, getShortTimezone } from '../utils';

import MedicationTerms from './MedicationTerms';

const clinicsVisited = avs => {
  const shortTimezone = getShortTimezone(avs);
  const clinics = avs.clinicsVisited.map((clinic, idx) => {
    return (
      <div key={clinic.clinicIen}>
        <h3
          className={idx === 0 && 'vads-u-margin-top--0'}
          data-testid="appointment-time"
          key={clinic.clinicIen}
        >
          {getFormattedAppointmentTime(clinic.time)} {shortTimezone}
        </h3>
        <p>
          <span className="clinic-information" key="clinicSite">
            <i
              className="fas fa-building"
              aria-hidden="true"
              data-testid="appointment-icon"
            />
            {clinic.site}
          </span>
          <br />
          <span key="clinicName">Clinic: {clinic.clinic}</span>
        </p>
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
      <ul data-testid="provider-list">{providerListItems}</ul>
    </div>
  );
};

const reasonForAppointment = avs => {
  if (avs.reasonForVisit?.length > 0) {
    const reasonForVisitListItems = avs.reasonForVisit.map(reason => (
      <li key={reason.code}>{reason.diagnosis}</li>
    ));

    return (
      <div>
        <h3>Reason for appointment</h3>
        <ul data-testid="reason-for-appt-list">{reasonForVisitListItems}</ul>
      </div>
    );
  }

  return null;
};

const youWereDiagnosedWith = avs => {
  if (avs.diagnoses?.length > 0) {
    const diagnosisListItems = avs.diagnoses.map(diagnosis => (
      <li key={diagnosis.code}>{diagnosis.diagnosis}</li>
    ));

    return (
      <div>
        <h3>You were diagnosed with</h3>
        <ul className="bulleted-list" data-testid="diagnoses-list">
          {diagnosisListItems}
        </ul>
      </div>
    );
  }

  return null;
};

const vitalSigns = avs => {
  if (avs.vitals?.length > 0) {
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
      <div data-testid="vitals">
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
    // TODO: get procedures and add test case.

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
      <div data-testid="clinic-medications">
        <h3>Medications ordered for administration in clinic</h3>
        <p>
          Medications ordered for administration during your visit to a VA
          clinic or emergency department.
        </p>
        <MedicationTerms />
      </div>
    );
  }

  return null;
};

const YourAppointment = props => {
  const { avs } = props;

  return (
    <div className="avs-accordion-item">
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
