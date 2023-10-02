import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick(history, pageFlow) {
  const { home, contactInfo } = pageFlow;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (contactInfo.url.endsWith('/') && contactInfo.url !== home.url)
    )
      history.push(`../${contactInfo.url}`);
    else history.push(contactInfo.url);
  };
}

export default function ContactDetailSection({ data }) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);

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
              onClick={handleClick(history, pageFlow)}
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
