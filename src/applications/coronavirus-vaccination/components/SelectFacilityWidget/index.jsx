import React from 'react';
import { connect } from 'react-redux';
import * as userSelectors from 'platform/user/selectors';

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
    isLoggedIn: userSelectors.isLoggedIn(state),
    patientFacilityIds: userSelectors
      .selectPatientFacilities(state)
      ?.map(f => f.facilityId),
    formState: state.coronavirusVaccinationApp.formState,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectFacilityWidget);
export { SelectFacilityWidget };
