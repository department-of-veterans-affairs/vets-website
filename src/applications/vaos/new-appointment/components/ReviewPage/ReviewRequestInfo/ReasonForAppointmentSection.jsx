import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import getNewAppointmentFlow from '../../../newAppointmentFlow';

function handleClick(history, home, reasonForAppointment) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

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
  const { reasonAdditionalInfo } = data;
  const history = useHistory();
  const { home, reasonForAppointment: reason } = useSelector(
    getNewAppointmentFlow,
  );

  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
              Reason for appointment
            </h2>
            {!reasonAdditionalInfo && <span>No details shared</span>}
            <span
              className="vaos-u-word-break--break-word"
              data-dd-privacy="mask"
            >
              {reasonAdditionalInfo}
            </span>
          </div>
          <div>
            <va-link
              href={reason.url}
              label="Edit reason for appointment"
              text="Edit"
              data-testid="edit-new-appointment"
              onClick={handleClick(history, home, reason)}
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
