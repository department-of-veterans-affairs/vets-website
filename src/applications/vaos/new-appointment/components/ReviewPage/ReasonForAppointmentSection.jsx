import React from 'react';
import PropTypes from 'prop-types';
import newAppointmentFlow from '../../newAppointmentFlow';
import { PURPOSE_TEXT } from '../../../utils/constants';

export default function ReasonForAppointmentSection({ data }) {
  const { reasonForAppointment, reasonAdditionalInfo } = data;

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
              {PURPOSE_TEXT.find(purpose => purpose.id === reasonForAppointment)
                ?.short || 'Additional details'}
            </h3>
            <span className="vaos-u-word-break--break-word">
              {reasonAdditionalInfo}
            </span>
          </div>
          <div>
            <va-link
              to={newAppointmentFlow.reasonForAppointment.url}
              aria-label="Edit purpose of appointment"
              text="Edit"
            />
          </div>
        </div>
      </div>
    </>
  );
}

ReasonForAppointmentSection.propTypes = {
  data: PropTypes.object,
};
