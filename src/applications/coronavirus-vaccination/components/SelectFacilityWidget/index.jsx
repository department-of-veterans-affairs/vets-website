import React from 'react';
import { connect } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import { selectPatientFacilities } from 'platform/user/cerner-dsot/selectors';

import PatientFacilities from './PatientFacilities';

function SelectFacilityWidget({ patientFacilityIds, value, onChange }) {
  return (
    <>
      {patientFacilityIds ? (
        <PatientFacilities
          facilityIds={patientFacilityIds}
          value={value}
          onChange={onChange}
        />
      ) : null}
    </>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: isLoggedIn(state),
    patientFacilityIds: selectPatientFacilities(state)?.map(f => f.facilityId),
    formState: state.coronavirusVaccinationApp.formState,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectFacilityWidget);
export { SelectFacilityWidget };
