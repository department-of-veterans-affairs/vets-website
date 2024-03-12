import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PreferredDatesSection from './PreferredDatesSection';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import { FLOW_TYPES, TYPE_OF_VISIT } from '../../../utils/constants';
import State from '../../../components/State';
import getNewAppointmentFlow from '../../newAppointmentFlow';
import { getFlowType } from '../../redux/selectors';

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

function FacilitySection({ facility }) {
  const flowType = useSelector(getFlowType);

  if (FLOW_TYPES.DIRECT === flowType)
    return (
      <>
        <h3 className="vaos-appts__block-label">{facility.name}</h3>
        {facility.address?.city}, <State state={facility.address?.state} />
      </>
    );

  return (
    <>
      <h2 className="vads-u-font-size--base vaos-appts__block-label">
        Facility
      </h2>
      {facility.name}
      <br />
      {facility.address?.city}, <State state={facility.address?.state} />
    </>
  );
}
FacilitySection.propTypes = {
  facility: PropTypes.object.isRequired,
};

function TypeOfVisitSection({ data }) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);
  const flowType = useSelector(getFlowType);

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row vads-u-justify-content--space-between">
        <div className="vads-u-flex--1 vads-u-padding-right--1">
          <h2 className="vads-u-font-size--base vaos-appts__block-label">
            {FLOW_TYPES.DIRECT === flowType
              ? 'How to be seen'
              : 'How you want to attend'}
          </h2>
          {TYPE_OF_VISIT.find(visit => visit.id === data.visitType)?.name}
        </div>
        <div>
          <va-link
            onClick={handleClick(history, pageFlow)}
            text="Edit"
            aria-label="Edit how you want to attend"
          />
        </div>
      </div>
    </div>
  );
}
TypeOfVisitSection.propTypes = {
  data: PropTypes.object.isRequired,
};

export default function VAAppointmentSection({ data, facility }) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);
  const flowType = useSelector(getFlowType);

  if (FLOW_TYPES.DIRECT === flowType)
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
