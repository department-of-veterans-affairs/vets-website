import React from 'react';
import { connect } from 'react-redux';

import FeatureToggle, {
  FeatureOn,
  FeatureOff,
} from '../../components/FeatureToggle';
import SingleAppointment from './SingleAppointment';
import MultipleAppointment from './MultipleAppointments';

const Confirmation = ({
  appointments,
  selectedAppointment,
  isMultipleAppointmentsEnabled,
}) => {
  return (
    <FeatureToggle on={isMultipleAppointmentsEnabled}>
      <FeatureOn>
        <MultipleAppointment
          selectedAppointment={selectedAppointment}
          appointments={appointments}
        />
      </FeatureOn>
      <FeatureOff>
        <SingleAppointment appointments={appointments} />
      </FeatureOff>
    </FeatureToggle>
  );
};

const mapStateToProps = state => {
  return {
    appointments: state.checkInData.appointments,
    selectedAppointment: state.checkInData.context.appointment,
  };
};
const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);
