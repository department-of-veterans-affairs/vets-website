import React, { useEffect } from 'react';
import moment from '../../lib/moment-tz.js';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event.js';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getTimezoneAbbrBySystemId } from '../../utils/timezone.js';
import { GA_PREFIX } from '../../utils/constants.js';
import FacilityAddress from '../../components/FacilityAddress.jsx';
import { selectConfirmationPage } from '../redux/selectors.js';

const pageTitle = 'Your appointment has been scheduled';

function ConfirmationPage({ data, systemId, facilityDetails }) {
  const history = useHistory();
  useEffect(() => {
    if (history && !data?.date1) {
      history.replace('/');
    }
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  const { date1 } = data;

  return (
    <div>
      <h1>{pageTitle}</h1>
      <AlertBox status="success">
        <strong>Your appointment is confirmed</strong>
        <br />
        Please see your appointment details below.
      </AlertBox>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">
          COVID-19 vaccination
        </h2>
        First dose
        <br />
        {moment(date1, 'YYYY-MM-DDTHH:mm:ssZ').format(
          'dddd, MMMM D, YYYY [at] h:mm a ',
        ) + getTimezoneAbbrBySystemId(systemId)}
        <br />
        <br />
        {facilityDetails && (
          <FacilityAddress
            name={facilityDetails.name}
            facility={facilityDetails}
          />
        )}
      </div>
      <div className="vads-u-margin-y--2">
        <Link
          to="/"
          className="usa-button vads-u-padding-right--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
            });
          }}
        >
          View your appointments
        </Link>
      </div>
    </div>
  );
}

export default connect(selectConfirmationPage)(ConfirmationPage);
