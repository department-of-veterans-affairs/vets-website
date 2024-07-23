import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import getNewAppointmentFlow from '../../../../newAppointmentFlow';

function handleClick(history, pageFlow) {
  const { home, ccPreferences } = pageFlow;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (ccPreferences.url.endsWith('/') && ccPreferences.url !== home.url)
    )
      history.push(`../${ccPreferences.url}`);
    else history.push(ccPreferences.url);
  };
}

export default function SchedulingFacilitySection({ facility }) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);
  const { telecom } = facility;

  let phone = '';
  if (telecom && telecom.length > 0) {
    const { value } = telecom[0];
    phone = value;
  }

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row vads-u-justify-content--space-between">
        <div className="vads-u-flex--1 vads-u-padding-right--1">
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Scheduling facility
          </h2>
          <p>
            This facility will contact you if we need more information about
            your request.
          </p>
          <p className="vaos-u-word-break--break-word">
            {facility.name}
            <br />
            <strong>Main phone: </strong>
            <VaTelephone contact={phone} data-testid="facility-telephone" /> (
            <VaTelephone contact="711" tty data-testid="tty-telephone" />)
          </p>
        </div>
        <div>
          <va-link
            onClick={handleClick(history, pageFlow)}
            aria-label="Edit provider preference"
            text="Edit"
            data-testid="edit-new-appointment"
            tabindex="0"
          />
        </div>
      </div>
    </div>
  );
}

SchedulingFacilitySection.propTypes = {
  facility: PropTypes.object,
};
