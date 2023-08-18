// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
// Relative imports.
import { selectPatientFacilities as selectPatientFacilitiesDsot } from 'platform/user/cerner-dsot/selectors';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import {
  ehrDataByVhaIdPropType,
  facilitiesPropType,
  useSingleLogoutPropType,
} from '../../../propTypes';

export const App = ({
  ehrDataByVhaId,
  facilities,
  useSingleLogout,
  widgetType,
}) => {
  const cernerFacilities = facilities?.filter(f => f.usesCernerAppointments);
  const otherFacilities = facilities?.filter(f => !f.usesCernerAppointments);
  if (!isEmpty(cernerFacilities)) {
    return (
      <AuthContent
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
        ehrDataByVhaId={ehrDataByVhaId}
        useSingleLogout={useSingleLogout}
        widgetType={widgetType}
      />
    );
  }

  return <UnauthContent widgetType={widgetType} />;
};

App.propTypes = {
  // From mapStateToProps.
  widgetType: PropTypes.string.isRequired,
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  facilities: facilitiesPropType,
  useSingleLogout: useSingleLogoutPropType,
};

const mapStateToProps = state => ({
  ehrDataByVhaId: selectEhrDataByVhaId(state),
  facilities: selectPatientFacilitiesDsot(state),
  useSingleLogout: state?.featureToggles?.pwEhrCtaUseSlo,
});

export default connect(
  mapStateToProps,
  null,
)(App);
