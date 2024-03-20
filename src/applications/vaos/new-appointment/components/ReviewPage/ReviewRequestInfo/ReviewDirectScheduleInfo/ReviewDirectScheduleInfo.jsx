import React from 'react';
import PropTypes from 'prop-types';
import { FLOW_TYPES } from '../../../../../utils/constants';
import ReasonForAppointmentSection from '../ReasonForAppointmentSection';
import ContactDetailSection from '../ContactDetailSection';
import AppointmentDate from '../../AppointmentDate';
import Description from './Description';
import TypeOfAppointmentSection from '../TypeOfAppointmentSection';
import State from '../../../../../components/State';

export default function ReviewDirectScheduleInfo({
  data,
  facility,
  clinic,
  pageTitle,
}) {
  return (
    <div>
      <h1 className="vaos-review__header vads-u-font-size--h2">{pageTitle}</h1>
      <Description data={data} flowType={FLOW_TYPES.DIRECT} />
      <TypeOfAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <AppointmentDate
        dates={data.selectedDates}
        facilityId={data.vaFacility}
      />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <h3 className="vaos-appts__block-label">{clinic.serviceName}</h3>
      {facility.name}
      <br />
      {facility.address?.city}, <State state={facility.address?.state} />
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
