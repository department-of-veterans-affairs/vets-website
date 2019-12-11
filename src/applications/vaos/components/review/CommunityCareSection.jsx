import React from 'react';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import PreferredDatesSection from './PreferredDatesSection';
import PreferredProviderSection from './PreferredProviderSection';

export default function CommunityCareSection(props) {
  return (
    <>
      <PreferredProviderSection
        data={props.data}
        vaCityState={props.vaCityState}
      />
      <hr />
      <ReasonForAppointmentSection data={props.data} />
      <hr />
      <PreferredDatesSection data={props.data} />
      <hr />
      <ContactDetailSection data={props.data} />
    </>
  );
}
