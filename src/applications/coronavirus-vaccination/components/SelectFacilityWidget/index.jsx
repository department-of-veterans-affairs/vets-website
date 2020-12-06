import React from 'react';
import { connect } from 'react-redux';
import * as userSelectors from 'platform/user/selectors';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

import PatientFacilities from './PatientFacilities';

function SelectFacilityWidget({
  patientFacilityIds,
  value,
  onChange,
  ...props
}) {
  return (
    <>
      <TextWidget value={value} onChange={onChange} type="text" {...props} />
      {patientFacilityIds ? (
        <PatientFacilities facilityIds={patientFacilityIds} />
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
