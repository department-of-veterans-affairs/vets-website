import React from 'react';
import PropTypes from 'prop-types';

import { getFormattedAppointmentTime, getShortTimezone } from '../utils';

import ItemsBlock from './ItemsBlock';
import ListBlock from './ListBlock';
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
      <ListBlock
        heading="Providers"
        itemType="provider-list"
        items={avs.providers}
      />
      <ListBlock
        heading="Reason for appointment"
        itemType="reason-for-appt-list"
        items={avs.reasonForVisit}
        itemName="diagnosis"
        keyName="code"
      />
      <ListBlock
        heading="You were diagnosed with"
        itemType="diagnoses-list"
        items={avs.diagnoses}
        itemName="diagnosis"
        keyName="code"
      />
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
