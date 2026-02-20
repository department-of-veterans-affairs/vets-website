import React from 'react';
import { VaIcon } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getFormattedAppointmentTime, getShortTimezone } from '../utils';
import ItemsBlock from './ItemsBlock';
import ListBlock from './ListBlock';
import MedicationTerms from './MedicationTerms';
import type {
  YourAppointmentProps,
  AvsData,
  VitalSign,
  ClinicMedication,
} from '../types';

const clinicsVisited = (avs: AvsData): React.ReactNode => {
  const shortTimezone = getShortTimezone(avs);
  const clinics = avs.clinicsVisited.map((clinic, idx) => {
    return (
      <div key={clinic.clinicIen || idx}>
        <h3
          className={idx === 0 ? 'vads-u-margin-top--0' : ''}
          data-testid="appointment-time"
          key={clinic.clinicIen}
        >
          {getFormattedAppointmentTime(clinic.time)} {shortTimezone}
        </h3>
        <p>
          <span className="clinic-information" key="clinicSite">
            <VaIcon
              icon="location_city"
              size={4}
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

const renderVitalSign = (vitalSignItem: VitalSign): React.ReactNode => {
  return (
    <p>
      {vitalSignItem.type}
      <br />
      Result: {vitalSignItem.value}
      {vitalSignItem.qualifiers && ` (${vitalSignItem.qualifiers})`}
    </p>
  );
};

const clinicMedsIntro = (avs: AvsData): React.ReactNode => {
  return (
    <>
      <p>
        Medications ordered for administration during your visit to a VA clinic
        or emergency department.
      </p>
      <MedicationTerms avs={avs} />
    </>
  );
};

const renderClinicMedication = (
  medication: ClinicMedication,
): React.ReactNode => {
  return (
    <>
      <p>
        <strong>{medication.name}</strong>
        <br />
        {medication.sig}
        <br />
        Status: {medication.status}
        <br />
      </p>
    </>
  );
};

const YourAppointment: React.FC<YourAppointmentProps> = ({ avs }) => {
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
      <ItemsBlock<VitalSign>
        heading="Vitals as of this appointment"
        items={avs.vitals}
        itemType="vitals"
        renderItem={renderVitalSign}
        showSeparators
      />
      <ListBlock
        heading="Procedures"
        itemName="name"
        items={avs.procedures}
        itemType="procedure-list"
        keyName="code"
      />
      <ItemsBlock<ClinicMedication>
        heading="Medications ordered for administration in clinic"
        intro={clinicMedsIntro(avs)}
        itemType="clinic-medications"
        items={avs.clinicMedications}
        renderItem={renderClinicMedication}
        showSeparators
      />
    </div>
  );
};

export default YourAppointment;
