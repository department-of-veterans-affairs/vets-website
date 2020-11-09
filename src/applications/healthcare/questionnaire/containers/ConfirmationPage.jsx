import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const ConfirmationPage = props => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);
  const { appointment, form } = props;
  const { submission } = form || undefined;
  const { response } = submission || {};
  return (
    <div className="healthcare-questionnaire-confirm">
      <div className="usa-alert usa-alert-success schemaform-sip-alert">
        <div className="usa-alert-body">
          <h2 className="usa-alert-heading">
            Your questionnaire has been sent to your provider.
          </h2>
          <div className="usa-alert-text">
            <p>We look forward to seeing you at your upcoming appointment.</p>
          </div>
        </div>
      </div>

      <div className="inset">
        <h3>Upcoming appointment questionnaire</h3>
        {response?.veteranInfo?.fullName && (
          <p>
            For{' '}
            <span
              aria-label="Veteran's full name"
              data-testid="veterans-full-name"
            >
              {response.veteranInfo.fullName}
            </span>
          </p>
        )}

        {response && (
          <ul className="claim-list">
            <li>
              <strong>Date received</strong>
              <br />
              <span>{moment(response.timestamp).format('MMMM D, YYYY')}</span>
            </li>
            <li>
              <strong>Your information was sent to</strong>
              <br />
              <span data-testid="facility-name" aria-label="Facility Name">
                {appointment?.vdsAppointments[0]?.clinic?.facility?.displayName}
              </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
    appointment: state?.questionnaireData?.context?.appointment,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
