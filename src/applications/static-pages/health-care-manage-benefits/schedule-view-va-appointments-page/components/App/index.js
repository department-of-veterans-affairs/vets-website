// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
// Relative imports.
import { selectPatientFacilities } from 'platform/user/selectors';
import { selectPatientFacilities as selectPatientFacilitiesDsot } from 'platform/user/cerner-dsot/selectors';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import { ehrDataByVhaIdPropType, facilitiesPropType } from '../../../propTypes';

export const App = ({ ehrDataByVhaId, facilities }) => {
  const cernerFacilities = facilities?.filter(f => f.usesCernerAppointments);
  const otherFacilities = facilities?.filter(f => !f.usesCernerAppointments);
  if (!isEmpty(cernerFacilities)) {
    return (
      <AuthContent
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
        ehrDataByVhaId={ehrDataByVhaId}
      />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  // From mapStateToProps.
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  facilities: facilitiesPropType,
};

const mapStateToProps = state => ({
  ehrDataByVhaId: selectEhrDataByVhaId(state),
  facilities: state?.featureToggles?.pwEhrCtaDrupalSourceOfTruth
    ? selectPatientFacilitiesDsot(state)
    : selectPatientFacilities(state),
});

export default connect(
  mapStateToProps,
  null,
)(App);
