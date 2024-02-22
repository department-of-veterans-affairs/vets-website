import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PreferredDatesSection from './PreferredDatesSection';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import { TYPE_OF_VISIT } from '../../../utils/constants';
import State from '../../../components/State';
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick(history, pageFlow) {
  const { home, visitType } = pageFlow;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (visitType.url.endsWith('/') && visitType.url !== home.url)
    )
      history.push(`../${visitType.url}`);
    else history.push(visitType.url);
  };
}

export default function VAAppointmentSection({ data, facility }) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);

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
            <va-link
              onClick={handleClick(history, pageFlow)}
              text="Edit"
              aria-label="Edit how to be seen"
            />
          </div>
        </div>
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </>
  );
}

VAAppointmentSection.propTypes = {
  data: PropTypes.object.isRequired,
  facility: PropTypes.object.isRequired,
};
