import React from 'react';
import { connect } from 'react-redux';
import * as userSelectors from 'platform/user/selectors';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

import usePatientFacilities from '../hooks/usePatientFacilities';

function FacilityField({ patientFacilities, value, onChange, ...props }) {
  const facilityIds = patientFacilities?.map(f => f.facilityId);
  const [facilities, status] = usePatientFacilities(facilityIds);

  return (
    <>
      <TextWidget value={value} onChange={onChange} type="text" {...props} />
      <div>{JSON.stringify(patientFacilities)}</div>
      {JSON.stringify(facilities)}
      {JSON.stringify(status)}
    </>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: userSelectors.isLoggedIn(state),
    patientFacilities: userSelectors.selectPatientFacilities(state),
    formState: state.coronavirusVaccinationApp.formState,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilityField);
export { FacilityField };
