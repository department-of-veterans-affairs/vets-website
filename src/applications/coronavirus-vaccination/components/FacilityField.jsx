import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import * as userSelectors from 'platform/user/selectors';
import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

function FacilityField({
  formState,
  isLoggedIn,
  patientFacilities,
  value,
  onChange,
  ...props
}) {
  useEffect(
    () => {
      // todo hit the facilities API
    },
    [patientFacilities],
  );

  return (
    <>
      <TextWidget value={value} onChange={onChange} type="text" {...props} />
      <div>{JSON.stringify(patientFacilities)}</div>
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
