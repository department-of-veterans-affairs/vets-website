import React from 'react';
import { Link } from 'react-router';
import newAppointmentFlow from '../../newAppointmentFlow';
import { formatBestTimeToCall } from '../../utils/formatters';

export default function ContactDetailSection(props) {
  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">Your contact details</h3>
            <span>
              {props.data.email}
              <br />
              {props.data.phoneNumber}
              <br />
              <i>
                Call{' '}
                {formatBestTimeToCall(props.data.bestTimeToCall).toLowerCase()}
              </i>
            </span>
          </div>
          <div>
            <Link
              to={newAppointmentFlow.contactInfo.url}
              aria-label="Edit call back time"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
