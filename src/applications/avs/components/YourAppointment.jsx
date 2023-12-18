import React from 'react';
import PropTypes from 'prop-types';

import {
  fieldHasValue,
  getFormattedAppointmentTime,
  getShortTimezone,
} from '../utils';

import MedicationTerms from './MedicationTerms';
import ItemsBlock from './ItemsBlock';

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
  // Filter out null/empty field values.
  let reasonForVisitListItems =
    avs.reasonForVisit?.filter(reason => fieldHasValue(reason.diagnosis)) || [];

  if (reasonForVisitListItems.length === 0) {
    return null;
  }

  reasonForVisitListItems = avs.reasonForVisit.map(reason => (
    <li key={reason.code}>{reason.diagnosis}</li>
  ));

  return (
    <div>
      <h3>Reason for appointment</h3>
      <ul data-testid="reason-for-appt-list">{reasonForVisitListItems}</ul>
    </div>
  );
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

const renderVitalSign = vitalSignItem => {
  return (
    <p>
      {vitalSignItem.type}
      <br />
      Result: {vitalSignItem.value}
      {vitalSignItem.qualifiers && ` (${vitalSignItem.qualifiers})`}
    </p>
  );
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
        <MedicationTerms avs={avs} />
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
      <ItemsBlock
        heading="Vitals as of this appointment"
        items={avs.vitals}
        itemType="vitals"
        renderItem={renderVitalSign}
        showSeparators
      />
      {procedures(avs)}
      {clinicMedications(avs)}
    </div>
  );
};

export default YourAppointment;

YourAppointment.propTypes = {
  avs: PropTypes.object,
};
