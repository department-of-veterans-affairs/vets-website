// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
// Relative imports.
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import { selectPatientFacilities } from 'platform/user/selectors';
import { selectPatientFacilities as selectPatientFacilitiesDsot } from 'platform/user/cerner-dsot/selectors';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import {
  authenticatedWithSSOePropType,
  ehrDataByVhaIdPropType,
  facilitiesPropType,
  useSingleLogoutPropType,
} from '../../../propTypes';

export const App = ({
  authenticatedWithSSOe,
  ehrDataByVhaId,
  facilities,
  useSingleLogout,
}) => {
  const cernerFacilities = facilities?.filter(f => f.usesCernerRx);
  const otherFacilities = facilities?.filter(f => !f.usesCernerRx);
  if (!isEmpty(cernerFacilities)) {
    return (
      <AuthContent
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
        ehrDataByVhaId={ehrDataByVhaId}
        authenticatedWithSSOe={authenticatedWithSSOe}
        useSingleLogout={useSingleLogout}
      />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  authenticatedWithSSOe: authenticatedWithSSOePropType,
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  facilities: facilitiesPropType,
  useSingleLogout: useSingleLogoutPropType,
};

const mapStateToProps = state => ({
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  ehrDataByVhaId: selectEhrDataByVhaId(state),
  facilities: state?.featureToggles?.pwEhrCtaDrupalSourceOfTruth
    ? selectPatientFacilitiesDsot(state)
    : selectPatientFacilities(state),
  useSingleLogout: state?.featureToggles?.pwEhrCtaUseSlo,
});

export default connect(
  mapStateToProps,
  null,
)(App);
