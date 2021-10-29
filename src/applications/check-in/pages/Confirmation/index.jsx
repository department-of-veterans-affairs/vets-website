import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MultipleAppointment from './MultipleAppointments';

import { triggerRefresh } from '../../actions';

const Confirmation = ({
  appointments,
  refreshAppointments,
  selectedAppointment,
}) => {
  return (
    <MultipleAppointment
      selectedAppointment={selectedAppointment}
      appointments={appointments}
      triggerRefresh={refreshAppointments}
    />
  );
};

const mapStateToProps = state => {
  return {
    appointments: state.checkInData.appointments,
    selectedAppointment: state.checkInData.context.appointment,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    refreshAppointments: () => {
      dispatch(triggerRefresh());
    },
  };
};

Confirmation.propTypes = {
  appointments: PropTypes.array,
  refreshAppointments: PropTypes.func,
  selectedAppointment: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);
