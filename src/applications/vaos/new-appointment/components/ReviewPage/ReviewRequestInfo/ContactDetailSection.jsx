import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { FACILITY_TYPES } from '../../../../utils/constants';
import { getFormData } from '../../../redux/selectors';
import getNewAppointmentFlow from '../../../newAppointmentFlow';

function formatBestTimeToCall(bestTime) {
  const times = [];
  let output = '';
  if (bestTime?.morning) {
    times.push('Morning');
  }

  if (bestTime?.afternoon) {
    times.push('Afternoon');
  }

  if (bestTime?.evening) {
    times.push('Evening');
  }

  if (times.length === 1) {
    [output] = times;
  } else if (times.length === 2) {
    output = `${times[0]} or ${times[1]}`;
  } else {
    output = 'Anytime during the day';
  }

  return output.toLowerCase();
}

function handleClick(history, home, contactInfo) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    if (
      history.location.pathname.endsWith('/') ||
      (contactInfo.url.endsWith('/') && contactInfo.url !== home.url)
    )
      history.push(`../${contactInfo.url}`);
    else history.push(contactInfo.url);
  };
}

export default function ContactDetailSection({ data }) {
  const formData = useSelector(getFormData);
  const history = useHistory();
  const { home, contactInfo } = useSelector(getNewAppointmentFlow);

  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div
            className="vads-u-flex--1 vads-u-padding-right--1"
            data-dd-privacy="mask"
          >
            <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
              Your contact information
            </h2>
            <span data-dd-privacy="mask">
              <strong>Email: </strong>
              {data.email}
              <br />
              <strong>Phone number: </strong>
              <VaTelephone
                data-dd-privacy="mask"
                notClickable
                contact={data.phoneNumber}
                data-testid="patient-telephone"
              />
              {formData.facilityType === FACILITY_TYPES.COMMUNITY_CARE && (
                <>
                  <br />
                  <strong>Best time to call: </strong>
                  {/* The following line tag is for italics not an icon */}
                  {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-icon-component */}
                  <i>Call {formatBestTimeToCall(data.bestTimeToCall)}</i>
                </>
              )}
            </span>
          </div>
          <div>
            <va-link
              href={contactInfo.url}
              aria-label="Edit your contact information"
              text="Edit"
              data-testid="edit-new-appointment"
              onClick={handleClick(history, home, contactInfo)}
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
