import React from 'react';
import { Link } from 'react-router';
import newAppointmentFlow from '../../newAppointmentFlow';
import { formatBestTimeToCall } from '../../utils/formatters';

export default function ContactDetailSection(props) {
  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col--6">
            <h3 className="vaos-appts__block-label">Your contact details</h3>
          </div>
          <div className="vads-l-col--6 vads-u-text-align--right">
            <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
          </div>
        </div>
      </div>
      <span className="vads-u-padding-right--1">
        {props.data.email}
        <br />
        {props.data.phoneNumber}
        <br />
        <i>
          Call {formatBestTimeToCall(props.data.bestTimeToCall).toLowerCase()}
        </i>
      </span>
    </>
  );
}
