import React from 'react';
import { Link } from 'react-router';
import newAppointmentFlow from '../../newAppointmentFlow';
import PreferredDatesSection from './PreferredDatesSection';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import { TYPE_OF_VISIT } from '../../utils/constants';

export default function VAAppointmentSection({ data, facility }) {
  return (
    <>
      <PreferredDatesSection data={data} />
      <hr className="vads-u-margin-y--2" />
      <h3 className="vaos-appts__block-label">{facility.authoritativeName}</h3>
      {facility.city}, {facility.stateAbbrev}
      <hr className="vads-u-margin-y--2" />
      <ReasonForAppointmentSection data={data} />
      <hr className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col--6">
            <h3 className="vaos-appts__block-label">How to be seen</h3>
          </div>
          <div className="vads-l-col--6 vads-u-text-align--right">
            <Link
              to={newAppointmentFlow.visitType.url}
              aria-label="Edit how to be seen"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
      {TYPE_OF_VISIT.find(visit => visit.id === data.visitType)?.name}
      <hr className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </>
  );
}
