import PropTypes from 'prop-types';
import React from 'react';
import AppointmentDate from '../../AppointmentDate';
import ContactDetailSection from '../ContactDetailSection';
import ReasonForAppointmentSection from '../ReasonForAppointmentSection';
import TypeOfAppointmentSection from '../TypeOfAppointmentSection';
import FacilitySection from '../VAAppointmentSection/FacilitySection';
import OHProviderSection from './OHProviderSection';

export default function ReviewDirectScheduleInfo({
  data,
  facility,
  clinic,
  pageTitle,
}) {
  return (
    <div>
      <h1 className="vaos-review__header vaos__dynamic-font-size--h2">
        {pageTitle}
      </h1>
      <TypeOfAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <FacilitySection facility={facility} clinic={clinic} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      {!!data.selectedProvider && (
        <>
          <OHProviderSection data={data} />
          <hr aria-hidden="true" className="vads-u-margin-y--2" />
        </>
      )}
      <AppointmentDate
        dates={data.selectedDates}
        facilityId={data.vaFacility}
        level={2}
        directSchedule
      />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ReasonForAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </div>
  );
}

ReviewDirectScheduleInfo.propTypes = {
  clinic: PropTypes.object,
  data: PropTypes.object,
  facility: PropTypes.object,
  pageTitle: PropTypes.string,
};
