import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import MultipleAppointment from './MultipleAppointments';

import { triggerRefresh } from '../../actions';

import { makeSelectConfirmationData } from '../../hooks/selectors';

const Confirmation = ({ refreshAppointments }) => {
  const selectConfirmationData = useMemo(makeSelectConfirmationData, []);
  const { appointments, selectedAppointment } = useSelector(
    selectConfirmationData,
  );

  return (
    <MultipleAppointment
      selectedAppointment={selectedAppointment}
      appointments={appointments}
      triggerRefresh={refreshAppointments}
    />
  );
};

const mapDispatchToProps = dispatch => {
  return {
    refreshAppointments: () => {
      dispatch(triggerRefresh());
    },
  };
};

Confirmation.propTypes = {
  refreshAppointments: PropTypes.func,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(Confirmation);
