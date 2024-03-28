import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FLOW_TYPES, TYPE_OF_VISIT } from '../../../../../utils/constants';
import getNewAppointmentFlow from '../../../../newAppointmentFlow';
import { getFlowType } from '../../../../redux/selectors';

export function handleClick(history, pageFlow) {
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

export default function TypeOfVisitSection({ data }) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);
  const flowType = useSelector(getFlowType);

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row vads-u-justify-content--space-between">
        <div className="vads-u-flex--1 vads-u-padding-right--1">
          <h2 className="vads-u-font-size--h3 vaos-appts__block-label">
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
