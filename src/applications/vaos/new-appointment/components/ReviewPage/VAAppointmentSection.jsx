import React from 'react';
import { Link } from 'react-router-dom';
import newAppointmentFlow from '../../newAppointmentFlow';
import PreferredDatesSection from './PreferredDatesSection';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import { TYPE_OF_VISIT } from '../../../utils/constants';
import State from '../../../components/State';

export default function VAAppointmentSection({ data, facility }) {
  return (
    <>
      <PreferredDatesSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <h3 className="vaos-appts__block-label">{facility.name}</h3>
      {facility.address?.city}, <State state={facility.address?.state} />
      <ReasonForAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">How to be seen</h3>
            {TYPE_OF_VISIT.find(visit => visit.id === data.visitType)?.name}
          </div>
          <div>
            <Link
              to={newAppointmentFlow.visitType.url}
              aria-label="Edit how to be seen"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </>
  );
}
