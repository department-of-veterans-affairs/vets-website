import React from 'react';
import { Link } from 'react-router';
import newAppointmentFlow from '../../newAppointmentFlow';
import { PURPOSE_TEXT } from '../../utils/constants';

export default function ReasonForAppointmentSection(props) {
  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col--6">
            <h3 className="vaos-appts__block-label">
              {
                PURPOSE_TEXT.find(
                  purpose => purpose.id === props.data.reasonForAppointment,
                )?.short
              }
            </h3>
          </div>
          <div className="vads-l-col--6 vads-u-text-align--right">
            <Link
              to={newAppointmentFlow.reasonForAppointment.url}
              aria-label="Edit purpose of appointment"
            >
              Edit
            </Link>
          </div>
          <span className="vaos-u-word-break--break-word">
            {props.data.reasonAdditionalInfo}
          </span>
        </div>
      </div>
    </>
  );
}
