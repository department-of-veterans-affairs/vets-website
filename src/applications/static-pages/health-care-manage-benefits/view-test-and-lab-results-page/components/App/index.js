// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
// Relative imports.
import { selectPatientFacilities as selectPatientFacilitiesDsot } from 'platform/user/cerner-dsot/selectors';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
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
  widgetType,
}) => {
  const cernerFacilities = facilities?.filter(f => f.usesCernerTestResults);
  const otherFacilities = facilities?.filter(f => !f.usesCernerTestResults);
  if (!isEmpty(cernerFacilities)) {
    return (
      <AuthContent
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
        ehrDataByVhaId={ehrDataByVhaId}
        authenticatedWithSSOe={authenticatedWithSSOe}
        useSingleLogout={useSingleLogout}
        widgetType={widgetType}
      />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  widgetType: PropTypes.string.isRequired,
  authenticatedWithSSOe: authenticatedWithSSOePropType,
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  facilities: facilitiesPropType,
  useSingleLogout: useSingleLogoutPropType,
};

const mapStateToProps = state => ({
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  ehrDataByVhaId: selectEhrDataByVhaId(state),
  facilities: selectPatientFacilitiesDsot(state),
  useSingleLogout: state?.featureToggles?.pwEhrCtaUseSlo,
});

export default connect(
  mapStateToProps,
  null,
)(App);
