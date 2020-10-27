import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { focusElement } from 'platform/utilities/ui';
import * as actions from '../../redux/actions';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../../../utils/constants';
import {
  vaosPastAppts,
  selectPastAppointments,
  selectExpressCare,
} from '../../../utils/selectors';
import { getPastAppointmentDateRangeOptions } from '../../../utils/appointment';
import ConfirmedAppointmentListItem from '../cards/confirmed/ConfirmedAppointmentListItem';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';

function PastAppointmentsList({
  expressCare,
  dateRangeOptions = getPastAppointmentDateRangeOptions(),
  past,
  pastSelectedIndex,
  pastStatus,
  facilityData,
  fetchPastAppointments,
  showPastAppointments,
}) {
  const history = useHistory();
  const [isInitialMount, setInitialMount] = useState(true);
  useEffect(() => {
    if (!showPastAppointments) {
      history.push('/');
    } else if (pastStatus === FETCH_STATUS.notStarted) {
      const selectedDateRange = dateRangeOptions[pastSelectedIndex];
      fetchPastAppointments(
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        pastSelectedIndex,
      );
    }
  }, []);
  useEffect(
    () => {
      if (pastStatus === FETCH_STATUS.succeeded && !isInitialMount) {
        focusElement('#queryResultLabel');
      }
    },
    [isInitialMount, pastStatus],
  );

  const onDateRangeChange = index => {
    const selectedDateRange = dateRangeOptions[index];

    setInitialMount(false);
    fetchPastAppointments(
      selectedDateRange.startDate,
      selectedDateRange.endDate,
      index,
    );
  };

  let content;

  if (pastStatus === FETCH_STATUS.loading) {
    content = (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your appointments..." />
      </div>
    );
  } else if (pastStatus === FETCH_STATUS.succeeded && past?.length > 0) {
    content = (
      <>
        <span
          id="queryResultLabel"
          className="vads-u-font-size--sm vads-u-display--block vads-u-margin-bottom--1"
          style={{ outline: 'none' }}
        >
          Showing appointments for: {dateRangeOptions[pastSelectedIndex].label}
        </span>
        <ul className="usa-unstyled-list" id="appointments-list">
          {past.map((appt, index) => {
            switch (appt.vaos?.appointmentType) {
              case APPOINTMENT_TYPES.ccAppointment:
              case APPOINTMENT_TYPES.vaAppointment:
                return (
                  <ConfirmedAppointmentListItem
                    key={index}
                    index={index}
                    appointment={appt}
                    facility={facilityData[getVAAppointmentLocationId(appt)]}
                  />
                );
              default:
                return null;
            }
          })}
        </ul>
      </>
    );
  } else if (pastStatus === FETCH_STATUS.failed) {
    content = (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your past appointments. Please try again
        later.
      </AlertBox>
    );
  } else {
    content = (
      <h3 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        You don’t have any appointments in the selected date range
      </h3>
    );
  }

  return (
    <div role="tabpanel" aria-labelledby="tabpast" id="tabpanelpast">
      {!expressCare.hasRequests && (
        <h2 tabIndex="-1" id="pastAppts" className="vads-u-font-size--h3">
          Past appointments
        </h2>
      )}
      <PastAppointmentsDateDropdown
        currentRange={pastSelectedIndex}
        onChange={onDateRangeChange}
        options={dateRangeOptions}
      />
      {content}
    </div>
  );
}

PastAppointmentsList.propTypes = {
  past: PropTypes.array,
  pastStatus: PropTypes.string,
  pastSelectedIndex: PropTypes.number,
  facilityData: PropTypes.object,
  fetchPastAppointments: PropTypes.func,
  showPastAppointments: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    past: selectPastAppointments(state),
    pastStatus: state.appointments.pastStatus,
    pastSelectedIndex: state.appointments.pastSelectedIndex,
    facilityData: state.appointments.facilityData,
    showPastAppointments: vaosPastAppts(state),
    expressCare: selectExpressCare(state),
  };
}

const mapDispatchToProps = {
  fetchPastAppointments: actions.fetchPastAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastAppointmentsList);
