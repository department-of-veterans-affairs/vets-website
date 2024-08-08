import React from 'react';
import PropTypes from 'prop-types';
import PreferredDatesSection from '../PreferredDatesSection';
import ContactDetailSection from '../ContactDetailSection';
import ReasonForAppointmentSection from '../ReasonForAppointmentSection';
import FacilitySection from './FacilitySection';
import TypeOfVisitSection from './TypeOfVisitSection';

export default function VAAppointmentSection({ data, facility }) {
  return (
    <>
      <FacilitySection facility={facility} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <PreferredDatesSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ReasonForAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <TypeOfVisitSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </>
  );
}

VAAppointmentSection.propTypes = {
  data: PropTypes.object.isRequired,
  facility: PropTypes.object.isRequired,
};
