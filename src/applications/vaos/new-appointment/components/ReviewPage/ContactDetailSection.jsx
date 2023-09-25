import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import newAppointmentFlow from '../../newAppointmentFlow';

function handleClick(history) {
  return () => {
    history.push(newAppointmentFlow.contactInfo.url);
  };
}

export default function ContactDetailSection({ data }) {
  const history = useHistory();

  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">Your contact details</h3>
            <span>
              {data.email}
              <br />
              <VaTelephone
                notClickable
                contact={data.phoneNumber}
                data-testid="patient-telephone"
              />
            </span>
          </div>
          <div>
            <va-link
              aria-label="Edit call back time"
              text="Edit"
              data-testid="edit-new-appointment"
              onClick={handleClick(history)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

ContactDetailSection.propTypes = {
  data: PropTypes.object,
  flowType: PropTypes.string,
};
