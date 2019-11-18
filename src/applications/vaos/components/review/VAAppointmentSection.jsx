import React from 'react';
// import { Link } from 'react-router';
// import newAppointmentFlow from '../../newAppointmentFlow';
import PreferredDatesSection from './PreferredDatesSection';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';

export default function VAAppointmentSection(props) {
  return (
    <>
      <ReasonForAppointmentSection data={props.data} />
      <hr />
      <PreferredDatesSection data={props.data} />
      <hr />
      <ContactDetailSection data={props.data} />
    </>
  );
}
