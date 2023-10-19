import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PURPOSE_TEXT_V2 } from '../../../utils/constants';
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick(history, pageFlow) {
  const { home, reasonForAppointment } = pageFlow;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (reasonForAppointment.url.endsWith('/') &&
        reasonForAppointment.url !== home.url)
    )
      history.push(`../${reasonForAppointment.url}`);
    else history.push(reasonForAppointment.url);
  };
}

export default function ReasonForAppointmentSection({ data }) {
  const { reasonForAppointment, reasonAdditionalInfo } = data;
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);

  if (!reasonForAppointment && !reasonAdditionalInfo) {
    return null;
  }

  return (
    <>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">
              {PURPOSE_TEXT_V2.find(
                purpose => purpose.id === reasonForAppointment,
              )?.short || 'Additional details'}
            </h3>
            <span className="vaos-u-word-break--break-word">
              {reasonAdditionalInfo}
            </span>
          </div>
          <div>
            <va-link
              aria-label="Edit purpose of appointment"
              text="Edit"
              data-testid="edit-new-appointment"
              onClick={handleClick(history, pageFlow)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

ReasonForAppointmentSection.propTypes = {
  data: PropTypes.object.isRequired,
};
